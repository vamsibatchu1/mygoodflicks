// User dashboard
// Shows personalized content
// Quick access to lists and recent activity

"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { 
  Popcorn, 
  Clock, 
  Star, 
  Calendar, 
  Tv2, 
  SlidersHorizontal 
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const streamingServices = [
  { name: "Netflix", logo: "/assets/images/logos/netflix.png" },
  { name: "HBO Max", logo: "/assets/images/logos/hbo.png" },
  { name: "Apple TV +", logo: "/assets/images/logos/apple.png" },
  { name: "Prime", logo: "/assets/images/logos/prime.png" },
  { name: "Hulu", logo: "/assets/images/logos/hulu.png" },
  { name: "Other", logo: "/assets/images/logos/disney.png" }, // No logo for "Other"
]

// First, add this type for the media results
type MediaResult = {
  Title: string;
  Year: string;
  Poster: string;
  Plot: string;
  imdbRating: string;
  Ratings: {
    Source: string;
    Value: string;
  }[];
  Awards: string;
  id: string;
}

export default function DashboardPage() {
  const [selectedMoods, setSelectedMoods] = React.useState<string[]>([])
  const [selectedTime, setSelectedTime] = React.useState<string>("")
  const [selectedRating, setSelectedRating] = React.useState<string>("")
  const [selectedRelease, setSelectedRelease] = React.useState<string>("")
  const [results, setResults] = useState<MediaResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleGetRecommendations = async () => {
    setIsLoading(true)
    try {
      const formData = {
        moods: selectedMoods,
        watchTime: selectedTime,
        ratingPreference: selectedRating,
        releaseTime: selectedRelease,
      }
      console.log('Sending form data:', formData)

      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Received data:', data)
      
      setResults(data)
    } catch (error) {
      console.error('Detailed error:', error)
      toast.error('Failed to get recommendations')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-2 sm:px-8 py-8 sm:py-12">
      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
        {/* Form Section - Now with flex-shrink-0 */}
        <div className="flex-shrink-0 lg:max-w-2xl w-full">
          <Card>
            <CardContent className="p-6 space-y-6"> 
              <h1 className="text-2xl font-bold mb-6">Flick Finder: Your Personal Movie DJ</h1>           
              <div className="space-y-16 sm:space-y-6">
                <div className="flex flex-col min-h-[120px] sm:min-h-fit mb-8 sm:mb-0">
                  <h2 className="text-base font-medium flex items-center gap-2">
                    <Popcorn className="w-5 h-5" />
                    What are you in the mood for?
                  </h2>
                  <div className="flex-1 flex flex-wrap gap-2 mt-4">
                    <ToggleGroup 
                      type="multiple"
                      value={selectedMoods}
                      onValueChange={setSelectedMoods}
                      className="flex flex-wrap gap-2 bg-transparent p-0 justify-start w-full"
                    >
                      <ToggleGroupItem 
                        value="action" 
                        className="rounded-full bg-white border hover:bg-gray-50 data-[state=on]:bg-primary data-[state=on]:text-white"
                      >
                        Action
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="drama" 
                        className="rounded-full bg-white border hover:bg-gray-50 data-[state=on]:bg-primary data-[state=on]:text-white"
                      >
                        Drama
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="comedy" 
                        className="rounded-full bg-white border hover:bg-gray-50 data-[state=on]:bg-primary data-[state=on]:text-white"
                      >
                        Comedy
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="romance" 
                        className="rounded-full bg-white border hover:bg-gray-50 data-[state=on]:bg-primary data-[state=on]:text-white"
                      >
                        Romance
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="horror" 
                        className="rounded-full bg-white border hover:bg-gray-50 data-[state=on]:bg-primary data-[state=on]:text-white"
                      >
                        Horror
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="thriller" 
                        className="rounded-full bg-white border hover:bg-gray-50 data-[state=on]:bg-primary data-[state=on]:text-white"
                      >
                        Thriller
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="fantasy" 
                        className="rounded-full bg-white border hover:bg-gray-50 data-[state=on]:bg-primary data-[state=on]:text-white"
                      >
                        Fantasy
                      </ToggleGroupItem>
                    
                    </ToggleGroup>
                  </div>
                </div>

                <div className="flex flex-col min-h-[120px] sm:min-h-fit mb-8 sm:mb-0">
                  <h2 className="text-base font-medium flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    How much time do you have for watching?
                  </h2>
                  <div className="flex-1 flex flex-wrap gap-2 mt-4">
                    <ToggleGroup 
                      type="single"
                      value={selectedTime}
                      onValueChange={setSelectedTime}
                      className="flex flex-wrap gap-2 bg-transparent p-0 justify-start w-full"
                    >
                      <ToggleGroupItem 
                        value="30mins" 
                        className="rounded-full bg-white border hover:bg-gray-50 data-[state=on]:bg-primary data-[state=on]:text-white"
                      >
                        30 mins
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="1hour" 
                        className="rounded-full bg-white border hover:bg-gray-50 data-[state=on]:bg-primary data-[state=on]:text-white"
                      >
                        1 hour
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="2-3hours" 
                        className="rounded-full bg-white border hover:bg-gray-50 data-[state=on]:bg-primary data-[state=on]:text-white"
                      >
                        2-3 hours
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="alltime" 
                        className="rounded-full bg-white border hover:bg-gray-50 data-[state=on]:bg-primary data-[state=on]:text-white"
                      >
                        all the time in the world
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>

                <div className="flex flex-col min-h-[120px] sm:min-h-fit mb-8 sm:mb-0">
                  <h2 className="text-base font-medium flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    What&apos;s your rating choice like?
                  </h2>
                  <div className="flex-1 flex flex-wrap gap-2 mt-4">
                    <ToggleGroup 
                      type="single"
                      value={selectedRating}
                      onValueChange={setSelectedRating}
                      className="flex flex-wrap gap-2 bg-transparent p-0 justify-start w-full"
                    >
                      <ToggleGroupItem 
                        value="oscar" 
                        className="rounded-full bg-white border hover:bg-gray-50 data-[state=on]:bg-primary data-[state=on]:text-white"
                      >
                        Oscar winners
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="indie" 
                        className="rounded-full bg-white border hover:bg-gray-50 data-[state=on]:bg-primary data-[state=on]:text-white"
                      >
                        Indie movies
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="hidden" 
                        className="rounded-full bg-white border hover:bg-gray-50 data-[state=on]:bg-primary data-[state=on]:text-white"
                      >
                        Hidden gems
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="imdb" 
                        className="rounded-full bg-white border hover:bg-gray-50 data-[state=on]:bg-primary data-[state=on]:text-white"
                      >
                        IMDB top 100
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>

                <div className="flex flex-col min-h-[120px] sm:min-h-fit mb-8 sm:mb-0">
                  <h2 className="text-base font-medium flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Release time
                  </h2>
                  <div className="flex-1 flex flex-wrap gap-2 mt-4">
                    <ToggleGroup 
                      type="single"
                      value={selectedRelease}
                      onValueChange={setSelectedRelease}
                      className="flex flex-wrap gap-2 bg-transparent p-0 justify-start w-full"
                    >
                      <ToggleGroupItem 
                        value="new" 
                        className="rounded-full bg-white border hover:bg-gray-50 data-[state=on]:bg-primary data-[state=on]:text-white"
                      >
                        New releases
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="classics" 
                        className="rounded-full bg-white border hover:bg-gray-50 data-[state=on]:bg-primary data-[state=on]:text-white"
                      >
                        Classics
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="date-range" 
                        className="rounded-full bg-white border hover:bg-gray-50 data-[state=on]:bg-primary data-[state=on]:text-white"
                      >
                        Specific date range
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-base font-medium flex items-center gap-2">
                    <Tv2 className="w-5 h-5" />
                    and finally, what subscriptions do you have?
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {streamingServices.map((service) => (
                      <Button
                        key={service.name}
                        variant="outline"
                        className="min-w-[100px] flex items-center gap-2 px-4 py-2"
                      >
                        {service.logo ? (
                          <Image 
                            src={service.logo} 
                            alt={`${service.name} logo`}
                            width={20}
                            height={20}
                            className="object-contain"
                          />
                        ) : null}
                        {service.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
               {/* <div> 
 <h3 className="mb-3 text-base font-medium flex items-center gap-2">
   <SlidersHorizontal className="w-5 h-5" />
   Other filters
 </h3>
 <div className="space-y-2">
   {[
     "Top picks from my friends",
     "Staff picks",
     "Family-friendly",
     "Binge-worthy series"
   ].map((filter) => (
     <div key={filter} className="flex items-center justify-between">
       <span>{filter}</span>
       <Switch />
     </div>
   ))}
 </div>
 </div> */}

                <Button 
                  className="w-full" 
                  onClick={handleGetRecommendations}
                  disabled={isLoading}
                >
                  {isLoading ? 'Finding the perfect shows...' : 'Show me my shows now'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations Section - Now with sticky positioning */}
        {results.length > 0 && (
          <div className="mt-8 lg:mt-0 lg:sticky lg:top-4 lg:w-[400px] lg:flex-shrink-0">
            <h2 className="text-2xl font-bold mb-4">Here are your {results.length} recommendations</h2>
            
            {/* Mobile View (Horizontal Scroll) */}
            <div className="lg:hidden">
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max space-x-4 p-4">
                  {results.map((movie) => (
                    <div key={movie.id} className="w-[280px] flex-none">
                      <div className="bg-gray-50 rounded-lg p-4 h-full">
                        <div className="flex flex-col gap-4">
                          {/* Image container with fixed aspect ratio */}
                          <div className="relative w-full aspect-[2/3]"> {/* This ensures consistent aspect ratio */}
                            <img
                              src={movie.Poster !== 'N/A' ? movie.Poster : '/images/placeholder.jpg'}
                              alt={movie.Title}
                              className="absolute inset-0 w-full h-full object-cover rounded-md"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <h3 className="text-lg font-bold leading-tight line-clamp-2">{movie.Title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-3">{movie.Plot}</p>
                            
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div className="bg-white p-2 rounded">
                                <div className="text-xs text-gray-600">IMDB</div>
                                <div className="font-bold text-sm">{movie.imdbRating}/10</div>
                              </div>
                              {movie.Ratings?.find(r => r.Source === "Rotten Tomatoes") && (
                                <div className="bg-white p-2 rounded">
                                  <div className="text-xs text-gray-600">Rotten Tomatoes</div>
                                  <div className="font-bold text-sm">
                                    {movie.Ratings.find(r => r.Source === "Rotten Tomatoes")?.Value}
                                  </div>
                                </div>
                              )}
                            </div>

                            {movie.Awards && movie.Awards !== 'N/A' && (
                              <p className="text-xs text-gray-500 italic mt-2">{movie.Awards}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:flex lg:flex-col lg:space-y-4">
              {results.map((movie) => (
                <div key={movie.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex gap-4">
                    {/* Poster Image */}
                    <img
                      src={movie.Poster !== 'N/A' ? movie.Poster : '/images/placeholder.jpg'}
                      alt={movie.Title}
                      className="w-20 h-28 object-cover rounded-md flex-shrink-0"
                    />
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <h3 className="font-bold text-lg">{movie.Title}</h3>
                      
                      {/* Description */}
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{movie.Plot}</p>
                      
                      {/* Ratings */}
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">IMDB</span>
                          <span className="text-sm font-medium">{movie.imdbRating}/10</span>
                        </div>
                        
                        {movie.Ratings?.map((rating) => {
                          if (rating.Source === "Rotten Tomatoes") {
                            return (
                              <div key="rt" className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Rotten Tomatoes</span>
                                <span className="text-sm font-medium">{rating.Value}</span>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>

                      {/* Awards/Nominations */}
                      {movie.Awards && movie.Awards !== 'N/A' && (
                        <p className="text-xs text-gray-500 italic mt-2">
                          {movie.Awards}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 