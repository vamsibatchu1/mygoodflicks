"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { listsService } from "@/lib/services/lists"
import { auth } from "@/lib/firebase"
import { toast } from "sonner"

interface AddToListButtonProps {
  mediaId: string
  mediaType: 'movie' | 'show'
  title: string
  posterPath: string
}

export function AddToListButton({ mediaId, mediaType, title, posterPath }: AddToListButtonProps) {
  const [lists, setLists] = useState<Array<{ id: string; name: string }>>([])
  const [selectedLists] = useState(new Set<string>())

  const handleDropdownOpen = async () => {
    const user = auth.currentUser
    if (!user) {
      toast.error('Please sign in to add to lists')
      return
    }

    try {
      const data = await listsService.getUserLists(user.uid)
      const filteredLists = data
        .filter((list): list is (typeof list & { name: string }) => Boolean(list.name))
        .map(list => ({
          id: list.id,
          name: list.name
        }))
      setLists(filteredLists)
    } catch (error) {
      console.error('Error fetching lists:', error)
      toast.error('Failed to load your lists')
    }
  }

  const handleAddToList = async (listId: string) => {
    try {
      if (selectedLists.has(listId)) {
        toast.info("Already in list")
        return
      }

      const mediaItem = {
        mediaId,
        mediaType,
        mediaTitle: title,
        mediaPoster: posterPath
      }

      await listsService.addToList(listId, mediaItem)
      selectedLists.add(listId)
      toast.success("Added to list!")
    } catch (error) {
      console.error('Error adding to list:', error)
      toast.error('Failed to add to list')
    }
  }

  return (
    <DropdownMenu onOpenChange={(open) => {
      if (open) {
        handleDropdownOpen()
      }
    }}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48"
      >
        {lists.length > 0 ? (
          lists.map((list) => (
            <DropdownMenuItem
              key={list.id}
              onClick={() => handleAddToList(list.id)}
            >
              {list.name}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>
            No lists found
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 