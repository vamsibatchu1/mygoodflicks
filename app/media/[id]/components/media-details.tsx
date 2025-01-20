'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { listsService } from '@/lib/services/lists'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MediaItem } from '@/lib/services/lists'

interface MediaDetailsProps {
  id: string;
}

export default function MediaDetails({ id }: MediaDetailsProps) {
  const [show, setShow] = useState<any>(null)
  const [selectedList, setSelectedList] = useState<string>('')
  const [lists, setLists] = useState<any[]>([])
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const response = await fetch(`/api/shows/${id}`)
        const data = await response.json()
        setShow(data)
      } catch (error) {
        console.error('Error fetching show:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchShow()
  }, [id])

  useEffect(() => {
    const fetchLists = async () => {
      if (user) {
        try {
          const userLists = await listsService.getUserLists(user.uid)
          setLists(userLists)
        } catch (error) {
          console.error('Error fetching lists:', error)
        }
      }
    }

    fetchLists()
  }, [user])

  const handleAddToList = async (listId: string) => {
    try {
      const mediaItem = {
        mediaId: show?.imdbID,
        mediaType: 'show',
        mediaTitle: show?.Title,
        mediaPoster: show?.Poster,
      }
      
      await listsService.addToList(listId, mediaItem)
      toast.success('Added to list!')
    } catch (error) {
      console.error('Error adding to list:', error)
      toast.error('Failed to add to list')
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!show) {
    return <div className="text-center">Show not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Poster Column */}
        <div className="md:col-span-1">
          <img
            src={show?.Poster !== 'N/A' ? show?.Poster : '/images/placeholder.jpg'}
            alt={show?.Title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Details Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold">{show?.Title}</h1>
            <div className="flex flex-wrap gap-2">
              <Badge>{show?.Type}</Badge>
              <Badge variant="secondary">{show?.Year}</Badge>
            </div>
          </div>

          {/* Rating and Genre */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {show?.imdbRating && (
              <span className="flex items-center gap-1">
                ⭐ {show.imdbRating}
              </span>
            )}
            {show?.Runtime && <span>{show.Runtime}</span>}
            {show?.Genre && <span>{show.Genre}</span>}
          </div>

          {/* Plot */}
          <p className="text-gray-700">{show?.Plot}</p>

          {/* Add to List Section */}
          {user && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Add to List</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select
                  value={selectedList}
                  onValueChange={setSelectedList}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select a list" />
                  </SelectTrigger>
                  <SelectContent>
                    {lists.map((list) => (
                      <SelectItem key={list.id} value={list.id}>
                        {list.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => selectedList && handleAddToList(selectedList)}
                  disabled={!selectedList}
                  className="w-full sm:w-auto"
                >
                  Add to List
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 