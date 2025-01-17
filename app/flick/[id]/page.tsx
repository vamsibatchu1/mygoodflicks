'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Star, BookmarkPlus, MoreVertical, Home, Users, BookMarked, Activity } from 'lucide-react'
import { Show } from '@/types'
import { useParams } from 'next/navigation'

export default function Page() {
  const params = useParams();
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShowData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/shows/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch show');
        const data = await response.json();
        setShow(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchShowData();
    }
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!show) return <div>Show not found</div>;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Sidebar with Tabs */}
      <aside className="w-16 border-r flex flex-col items-center py-4">
        <Tabs defaultValue="similar" orientation="vertical" className="h-full">
          <TabsList className="flex flex-col h-auto gap-2 bg-transparent">
            <TabsTrigger value="home" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
              <Home className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </TabsTrigger>
            <TabsTrigger value="similar" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
              <Users className="h-5 w-5" />
              <span className="sr-only">Similar Shows</span>
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
              <BookMarked className="h-5 w-5" />
              <span className="sr-only">Watchlist</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
              <Activity className="h-5 w-5" />
              <span className="sr-only">Activity</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </aside>

      <main className="flex-1 overflow-y-auto h-screen">
        <div className="flex h-full overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Header with Search */}
            <div className="flex justify-end mb-6">
              <Input 
                type="search" 
                placeholder="Search..." 
                className="w-[300px]"
              />
            </div>

            {/* Show Details Card */}
            <Card className="mb-8">
              <CardContent className="p-6">
                {/* First Row: Image and Details */}
                <div className="flex gap-6 mb-6 h-[200px]">
                  {/* Left Column: Image */}
                  <div className="w-[150px] h-full relative bg-muted rounded-md overflow-hidden">
                    <Image
                      src={show.imageUrl}
                      alt={show.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Right Column: Title and Details */}
                  <div className="flex-1 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h1 className="text-2xl font-bold mb-2">{show.title}</h1>
                        <div className="flex gap-2 mb-2">
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
                    <p className="text-muted-foreground flex-grow line-clamp-4">
                      {show.description}
                    </p>
                  </div>
                </div>

                {/* Second Row: Ratings Section */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Based on your movie preferences, you are highly likely to enjoy this series
                    </p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Your network</p>
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-2xl font-bold">{show.ratings.networkScore}/5</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">All time</p>
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-2xl font-bold">{show.ratings.allTimeScore}/5</p>
                  </Card>
                </div>

                <p className="text-sm text-muted-foreground mt-6">
                  {show.watchlistCount} friends added it to their watchlist
                </p>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="p-6 h-[400px] overflow-y-auto">
              <div className="space-y-6 h-full">
                <p className="text-sm text-muted-foreground">{show.reviewCount} reviews from your friends</p>
                
                {/* Review Items */}
                {show.reviews.map((review) => (
                  <div key={review.id} className="flex gap-4">
                    <Avatar>
                      <AvatarImage src={review.avatarUrl || "/placeholder.svg"} />
                      <AvatarFallback>{review.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{review.name}</h3>
                        <span className="text-xl font-bold">{review.rating}</span>
                      </div>
                      <p className="text-muted-foreground" dangerouslySetInnerHTML={{ 
                        __html: review.review.replace(/'/g, '&apos;') 
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <Tabs className="w-[300px] border-l">
            <TabsContent value="similar">
              <div className="p-6">
                <h2 className="font-semibold mb-4">Similar shows your friends are watching</h2>
                <div className="space-y-4">
                  {show.similarShows.map((similar, i) => (
                    <Card key={i} className="p-4">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-muted rounded">
                          <Image
                            src={similar.imageUrl}
                            alt={similar.title}
                            width={64}
                            height={64}
                            className="rounded object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{similar.title}</h3>
                          <p className="text-sm text-muted-foreground">{similar.friendCount} friends</p>
                          <p className="text-xl font-bold">{similar.rating}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Updated {show.lastUpdated}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="home">
              <div className="p-6">
                <h2 className="font-semibold mb-4">Your Home Feed</h2>
                <div className="space-y-4">
                  <Card className="p-4">
                    <p className="text-muted-foreground">Recent activity and recommendations will appear here</p>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="watchlist">
              <div className="p-6">
                <h2 className="font-semibold mb-4">Your Watchlist</h2>
                <div className="space-y-4">
                  <Card className="p-4">
                    <p className="text-muted-foreground">Shows and movies you want to watch will appear here</p>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <div className="p-6">
                <h2 className="font-semibold mb-4">Friend Activity</h2>
                <div className="space-y-4">
                  <Card className="p-4">
                    <p className="text-muted-foreground">Your friends' recent activity will appear here</p>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}