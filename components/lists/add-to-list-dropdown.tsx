'use client'

import { useState, useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { listsService } from '@/lib/services/lists'
import { auth } from '@/lib/firebase'
import { toast } from "sonner"

interface AddToListDropdownProps {
  mediaId: string
  mediaType: 'movie' | 'show'
  mediaTitle: string
  mediaPoster: string
}

export function AddToListDropdown({ 
  mediaId, 
  mediaType, 
  mediaTitle, 
  mediaPoster 
}: AddToListDropdownProps) {
  const [lists, setLists] = useState<Array<{ id: string; name: string }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLists = async () => {
      const user = auth.currentUser
      if (!user) return

      try {
        const data = await listsService.getUserLists(user.uid)
        const filteredLists = data
          .filter(list => list.name)
          .map(list => ({
            id: list.id,
            name: list.name
          }))
        setLists(filteredLists)
      } catch (error) {
        console.error('Error fetching lists:', error)
        toast.error('Failed to load your lists')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLists()
  }, [])

  const handleAddToList = async (listId: string) => {
    try {
      await listsService.addToList(listId, {
        mediaId,
        mediaType,
        mediaTitle,
        mediaPoster
      })
      toast.success('Added to list')
    } catch (error) {
      console.error('Error adding to list:', error)
      toast.error('Failed to add to list')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add to list</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {isLoading ? (
          <DropdownMenuItem disabled>
            Loading lists...
          </DropdownMenuItem>
        ) : lists.length > 0 ? (
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