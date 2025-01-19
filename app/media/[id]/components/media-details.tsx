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
      await listsService.addItemToList(listId, {
        id: id.toString(),
        type: show?.Type?.toLowerCase() as 'movie' | 'show',
        title: show?.Title || '',
        posterPath: show?.Poster,
      })
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
    <div className="grid md:grid-cols-3 gap-8">
      {/* Poster Column */}
      <div className="md:col-span-1">
        <Card>
          <CardContent className="p-4">
            <img
              src={show.Poster !== 'N/A' ? show.Poster : '/placeholder.png'}
              alt={show.Title}
              className="w-full rounded-lg shadow-lg"
            />
          </CardContent>
        </Card>
      </div>

      {/* Details Column */}
      <div className="md:col-span-2 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{show.Title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{show.Year}</Badge>
            <Badge variant="secondary">{show.Rated}</Badge>
            <Badge variant="secondary">{show.Runtime}</Badge>
            {show.Genre?.split(', ').map((genre: string) => (
              <Badge key={genre} variant="outline">
                {genre}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Plot</h2>
            <p className="text-gray-700">{show.Plot}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="font-medium text-gray-500">Director</dt>
                <dd>{show.Director}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Writers</dt>
                <dd>{show.Writer}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Actors</dt>
                <dd>{show.Actors}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Awards</dt>
                <dd>{show.Awards}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Ratings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {show.Ratings?.map((rating: any) => (
                <div key={rating.Source} className="bg-gray-50 p-4 rounded-lg">
                  <dt className="font-medium text-gray-500">{rating.Source}</dt>
                  <dd className="text-2xl font-bold">{rating.Value}</dd>
                </div>
              ))}
            </div>
          </div>

          {user && (
            <div className="pt-4">
              <h2 className="text-xl font-semibold mb-4">Add to List</h2>
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
                      <SelectItem key={list.id} value={list.id}>
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 