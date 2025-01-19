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
  Type: string;
  imdbRating: string;
  Plot: string;
  imdbID: string;  // Add this line
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🍿 Flick Finder: Your Personal Movie DJ</h1>
      <main className="flex-1 p-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 space-y-6">            
            <div className="space-y-2 mb-16">
              <h3 className="text-base font-medium flex items-center gap-2">
                <Popcorn className="w-5 h-5" />
                What are you in the mood for?
              </h3>
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
                <ToggleGroupItem 
                  value="animation" 
                  className="rounded-full bg-white border hover:bg-gray-50 data-[state=on]:bg-primary data-[state=on]:text-white"
                >
                  Animation
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="musical" 
                  className="rounded-full bg-white border hover:bg-gray-50 data-[state=on]:bg-primary data-[state=on]:text-white"
                >
                  Musical
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="crime" 
                  className="rounded-full bg-white border hover:bg-gray-50 data-[state=on]:bg-primary data-[state=on]:text-white"
                >
                  Crime
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-medium flex items-center gap-2">
                <Clock className="w-5 h-5" />
                How much time do you have for watching?
              </h3>
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

            <div className="space-y-2">
              <h3 className="text-base font-medium flex items-center gap-2">
                <Star className="w-5 h-5" />
                What&apos;s your rating choice like?
              </h3>
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

            <div className="space-y-2">
              <h3 className="text-base font-medium flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Release time
              </h3>
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

            <div>
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
            </div>

            <Button 
              className="w-full" 
              onClick={handleGetRecommendations}
              disabled={isLoading}
            >
              {isLoading ? 'Finding the perfect shows...' : 'Show me my shows now'}
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Your Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((media, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative aspect-[2/3]">
                    {media.Poster && media.Poster !== "N/A" ? (
                      <img
                        src={media.Poster}
                        alt={media.Title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        No Poster Available
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{media.Title}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {media.Year} • {media.Type} • ⭐ {media.imdbRating}
                    </p>
                    <p className="text-sm line-clamp-3">{media.Plot}</p>
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      asChild
                    >
                      <Link href={`/media/${media.imdbID}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 