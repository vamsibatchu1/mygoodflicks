'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Show } from '@/types'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, BookmarkPlus, MoreVertical, Users } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function ShowPage() {
  const params = useParams()
  const [show, setShow] = useState<Show | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShowData = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Fetching show data for:', params.id) // Debug log
        const response = await fetch(`/api/shows/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch show')
        const data = await response.json()
        console.log('Received show data:', data) // Debug log
        setShow(data)
      } catch (error) {
        console.error('Error fetching show:', error) // Debug log
        setError(error instanceof Error ? error.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchShowData()
    }
  }, [params.id])

  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>
  if (!show) return <div className="p-6">Show not found</div>

  return (
    <div className="p-6">
      <Card className="mb-8">
        <CardContent className="p-6">
          {/* Show Details Section */}
          <div className="flex gap-6 mb-6">
            <div className="w-[180px] h-[270px] relative bg-muted rounded-md overflow-hidden">
              {show?.imageUrl && (
                <div className="relative h-auto max-w-[300px] rounded-lg overflow-hidden">
                  <img 
                    src={show.imageUrl} 
                    alt={show.title || 'Movie poster'} 
                    className="w-full h-auto rounded-lg"
                    loading="eager"
                  />
                </div>
              )}
              <p className="mt-4">{show?.description}</p>
              <div className="mt-4">
                Genres: {show?.genres ? show.genres.join(', ') : 'No genres available'}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{show.title}</h1>
                  <div className="flex gap-2 mb-4">
                    {show.genres.map((genre) => (
                      <Badge key={genre} variant="secondary">{genre}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <BookmarkPlus className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuItem>Add to list</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <p className="text-muted-foreground">{show.description}</p>
            </div>
          </div>

          {/* Ratings Section */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">
                Based on your movie preferences, you are highly likely to enjoy this series
              </p>
            </Card>
            <Card className="p-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">IMDB Rating</p>
                <Users className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold">{show?.ratings?.networkScore ? show.ratings.networkScore : '0.0'}</p>
            </Card>
            <Card className="p-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Metascore</p>
                <Users className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold">{show.ratings.allTimeScore}</p>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <h2 className="text-xl font-semibold mt-6 mb-4">
        {show?.reviewCount || 0} reviews from your friends
      </h2>
      
      {/* Only map if reviews exist */}
      {show?.reviews && show.reviews.length > 0 ? (
        show.reviews.map((review) => (
          <Card key={review.id} className="p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="font-medium">{review.name}</div>
            </div>
          </Card>
        ))
      ) : (
        <p>No reviews yet</p>
      )}
    </div>
  )
}