"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BookmarkPlus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/useAuth"
import { listsService } from "@/lib/services/lists"
import { toast } from "sonner"
import type { List } from "@/types"

interface AddToListButtonProps {
  mediaId: string
  mediaType: 'movie' | 'show'
  title: string
  posterPath?: string
}

export function AddToListButton({ mediaId, mediaType, title, posterPath }: AddToListButtonProps) {
  const { user } = useAuth()
  const [lists, setLists] = useState<List[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLists, setSelectedLists] = useState<Set<string>>(new Set())
  const [open, setOpen] = useState(false)

  console.log("AddToListButton rendered with:", { mediaId, mediaType, title, user })

  useEffect(() => {
    const fetchLists = async () => {
      if (!user) return
      try {
        const userLists = await listsService.getUserLists(user.uid)
        setLists(userLists)
        
        // Check which lists already contain this item
        const containingLists = await listsService.getListsContainingItem(mediaId)
        setSelectedLists(new Set(containingLists.map(list => list.id)))
      } catch (error) {
        console.error("Error fetching lists:", error)
        toast.error("Failed to load your lists")
      } finally {
        setLoading(false)
      }
    }

    fetchLists()
  }, [user, mediaId])

  const handleListToggle = async (listId: string) => {
    try {
      if (selectedLists.has(listId)) {
        // Remove from list
        await listsService.removeItemFromList(listId, mediaId, mediaType)
        selectedLists.delete(listId)
      } else {
        // Add to list
        await listsService.addItemToList(listId, {
          id: mediaId,
          type: mediaType,
          title,
          posterPath,
          addedAt: new Date()
        })
        selectedLists.add(listId)
      }
      setSelectedLists(new Set(selectedLists))
      toast.success(selectedLists.has(listId) 
        ? `Added "${title}" to list` 
        : `Removed "${title}" from list`
      )
    } catch (error) {
      console.error("Error updating list:", error)
      toast.error("Failed to update list")
    }
  }

  const handleClick = () => {
    console.log("Button clicked, current open state:", open)
    setOpen(!open)
  }

  if (!user) return null

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild onClick={handleClick}>
        <Button variant="outline" size="icon">
          <BookmarkPlus className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {loading ? (
          <DropdownMenuItem disabled>Loading lists...</DropdownMenuItem>
        ) : lists.length === 0 ? (
          <DropdownMenuItem disabled>No lists found</DropdownMenuItem>
        ) : (
          lists.map((list) => (
            <DropdownMenuItem
              key={list.id}
              onSelect={(e) => {
                e.preventDefault()
                handleListToggle(list.id)
              }}
              className="flex items-center gap-2"
            >
              <Checkbox
                checked={selectedLists.has(list.id)}
                onCheckedChange={() => {}}
                className="mr-2"
              />
              {list.name}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 