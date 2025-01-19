"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/lib/auth"
import { listsService, MediaItem } from "@/lib/services/lists"
import { toast } from "sonner"

interface AddToListButtonProps {
  mediaId: string
  type: 'movie' | 'show'
  title: string
  posterPath?: string
}

export default function AddToListButton({ 
  mediaId, 
  type, 
  title, 
  posterPath 
}: AddToListButtonProps) {
  const [lists, setLists] = useState<any[]>([])
  const [selectedList, setSelectedList] = useState<string>("")
  const [selectedLists] = useState<Set<string>>(new Set())
  const { user } = useAuth()

  useEffect(() => {
    const fetchLists = async () => {
      if (user) {
        try {
          const userLists = await listsService.getUserLists(user.uid)
          setLists(userLists)
        } catch (error) {
          console.error("Error fetching lists:", error)
        }
      }
    }

    fetchLists()
  }, [user])

  const handleAddToList = async (listId: string) => {
    try {
      if (!selectedLists.has(listId)) {
        const mediaItem: Omit<MediaItem, "addedAt"> = {
          id: mediaId,
          type,
          title,
          posterPath,
        }
        await listsService.addItemToList(listId, mediaItem)
        selectedLists.add(listId)
        toast.success("Added to list!")
      }
    } catch (error) {
      console.error("Error adding to list:", error)
      toast.error("Failed to add to list")
    }
  }

  if (!user) return null

  return (
    <div className="flex gap-4">
      <Select
        value={selectedList}
        onValueChange={setSelectedList}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a list" />
        </SelectTrigger>
        <SelectContent>
          {lists.map((list) => (
            <SelectItem 
              key={list.id} 
              value={list.id}
              disabled={selectedLists.has(list.id)}
            >
              {list.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={() => selectedList && handleAddToList(selectedList)}
        disabled={!selectedList}
      >
        Add to List
      </Button>
    </div>
  )
} 