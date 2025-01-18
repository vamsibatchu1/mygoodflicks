import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to your personalized dashboard.
      </p>
      <main className="flex-1 p-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold">Get watching in secs</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="mb-3">What are you in the mood for?</h3>
                <div className="flex flex-wrap gap-2">
                  {["Action", "Drama", "Comedy", "Romance", "Horror", "Thriller", "Fantasy", "Animation", "Musical", "Crime"].map((genre) => (
                    <Select key={genre}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder={genre} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3">How much time do you have for watching?</h3>
                <div className="flex flex-wrap gap-2">
                  {["30 mins", "1 hour", "2-3 hours", "all the time in the world"].map((time) => (
                    <Button
                      key={time}
                      variant="outline"
                      className="rounded-full"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3">What's your rating choice like?</h3>
                <div className="flex flex-wrap gap-2">
                  {["Oscar winners", "Indie movies", "Hidden gems", "IMDB top 100"].map((rating) => (
                    <Button
                      key={rating}
                      variant="outline"
                      className="rounded-full"
                    >
                      {rating}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3">Release time</h3>
                <div className="flex flex-wrap gap-2">
                  {["New releases", "Classics", "Specific date range"].map((release) => (
                    <Button
                      key={release}
                      variant="outline"
                      className="rounded-full"
                    >
                      {release}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3">and finally, what subscriptions do you have?</h3>
                <div className="flex flex-wrap gap-2">
                  {["Netflix", "HBO Max", "Apple TV +", "Prime", "Hulu", "Other"].map((service) => (
                    <Button
                      key={service}
                      variant="outline"
                      className="min-w-[100px]"
                    >
                      {service}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3">Other filters</h3>
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

              <Button className="w-full">Show me my shows now</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 