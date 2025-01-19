"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Show } from "@/types";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, BookmarkPlus, MoreVertical, Users, Heart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddToListButton } from "./components/add-to-list-button";
import { useAuth } from "@/hooks/useAuth";
import { listsService } from "@/lib/services/lists";
import { toast } from "sonner";
import type { List } from "@/types";

const reviewsData = [
  {
    name: "Martin Rashford",
    rating: 3.4,
    review:
      "I love the banter and the setting, but some of the storylines don't hold up as well today. Still, it's a feel-good series with unforgettable characters. Definitely worth watching if you enjoy slice-of-life dramas.",
  },
  {
    name: "Tony Dill",
    rating: 3.4,
    review:
      "This show got me through some tough times. It's funny, emotional, and just plain comforting. I especially loved how every character has depth, even the town gossip! Lorelai is my favorite—such a strong, independent woman.",
  },
  {
    name: "Jennifer Minz",
    rating: 2.0,
    review:
      "I don't understand the hype. The dialogue feels forced and overly snappy, and Rory's character becomes hard to root for as the series goes on. I gave up around season 5.",
  },
  {
    name: "Varsha G",
    rating: 2.0,
    review:
      "The first few seasons were delightful, but the later seasons lost their magic. Rory's character arc felt off to me, and some plotlines dragged on unnecessarily. However, Stars Hollow and its quirky residents kept me watching.",
  },
];

export default function ShowPage() {
  const params = useParams();
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    const fetchShowData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching show data for:", params.id); // Debug log
        const response = await fetch(`/api/shows/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch show");
        const data = await response.json();
        console.log("Received show data:", data); // Debug log
        setShow(data);
      } catch (error) {
        console.error("Error fetching show:", error); // Debug log
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchShowData();
    }
  }, [params.id]);

  useEffect(() => {
    console.log("Page rendered with params:", params);
  }, [params]);

  useEffect(() => {
    const fetchLists = async () => {
      if (!user) return;
      try {
        const userLists = await listsService.getUserLists(user.uid);
        setLists(userLists);
      } catch (error) {
        console.error("Error fetching lists:", error);
        toast.error("Failed to load your lists");
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [user]);

  const handleAddToList = async (listId: string) => {
    if (!user) return;
    try {
      await listsService.addItemToList(listId, {
        id: params.id,
        type: params.type as 'movie' | 'show',
        title: show?.title || show?.name || '',
        posterPath: show?.imageUrl,
        addedAt: new Date()
      });
      
      // Update the local lists state to reflect the new count
      setLists(prevLists => prevLists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            [`${params.type}Count`]: (list[`${params.type}Count`] || 0) + 1,
            lastUpdated: new Date()
          };
        }
        return list;
      }));
      
      toast.success("Added to list");
    } catch (error) {
      console.error("Error adding to list:", error);
      toast.error("Failed to add to list");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!show) return <div className="p-6">Show not found</div>;

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
                    alt={show.title}
                    className="w-full h-auto rounded-lg"
                    loading="eager"
                  />
                </div>
              )}
              <p className="mt-4">{show?.description}</p>
              <div className="mt-4">
                Genres:{" "}
                {show?.genres ? show.genres.join(", ") : "No genres available"}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{show.title}</h1>
                  <div className="flex gap-2 mb-4">
                    {show.genres.map((genre) => (
                      <Badge key={genre} variant="secondary">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Star className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <BookmarkPlus className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {loading ? (
                        <DropdownMenuItem disabled>Loading lists...</DropdownMenuItem>
                      ) : lists.length === 0 ? (
                        <DropdownMenuItem disabled>No lists found</DropdownMenuItem>
                      ) : (
                        lists.map((list) => (
                          <DropdownMenuItem
                            key={list.id}
                            onClick={() => handleAddToList(list.id)}
                          >
                            {list.name}
                          </DropdownMenuItem>
                        ))
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
               
                  <span className="block mt-2">🏆</span>
  
              </p>
            </Card>
            <Card className="p-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">IMDB Rating</p>
                <Users className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold">
                {show?.ratings?.networkScore
                  ? show.ratings.networkScore
                  : "0.0"}
              </p>
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

      <div className="mt-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {reviewsData.length} reviews from your friends
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              All
            </Button>
            <Button variant="outline" size="sm">
              Year
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {reviewsData.map((review, index) => (
            <div key={index} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{review.name}</span>
                  <span className="text-lg font-semibold">{review.rating}</span>
                </div>
                <p className="text-gray-600">{review.review}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Heart className="h-6 w-6" />
        </Button>
        <AddToListButton 
          mediaId={params.id}
          mediaType={params.type as 'movie' | 'show'}
          title={show?.title || show?.name || ''}
          posterPath={show?.imageUrl}
        />
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
