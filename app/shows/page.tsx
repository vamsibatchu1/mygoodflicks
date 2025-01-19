"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { listsService } from "@/lib/services/lists";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Lock, Globe } from "lucide-react"
import { CreateListDialog } from "./components/create-list-dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface List {
  id: string;
  name: string;
  userId: string;
  movieCount: number;
  showCount: number;
  isPrivate: boolean;
  createdAt: Date;
  lastUpdated?: Date | null;
}

export default function ShowsPage() {
  const { user, loading: authLoading } = useAuth();
  const [lists, setLists] = useState<List[]>([]);
  const [publicLists, setPublicLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLists = async () => {
    if (!user) {
      console.log("No user found, clearing lists");
      setLists([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log("Current user ID:", user.uid);
      console.log("Starting to fetch user lists...");
      
      const userLists = await listsService.getUserLists(user.uid);
      console.log("Successfully fetched user lists:", userLists);
      setLists(userLists || []); // Ensure we always set an array

      console.log("Starting to fetch public lists...");
      const public_lists = await listsService.getPublicLists();
      console.log("Successfully fetched public lists:", public_lists);
      setPublicLists(public_lists || []); // Ensure we always set an array
      
    } catch (error: any) {
      console.error("Detailed fetch error:", {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      toast.error(error.message || "Failed to fetch lists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch lists after auth is initialized
    if (!authLoading) {
      console.log("Auth state loaded, fetching lists...");
      fetchLists();
    }
  }, [user, authLoading]);

  // Add loading state for auth
  if (authLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const handleCreateList = async (name: string, isPrivate: boolean) => {
    if (!user) return;
    
    try {
      await listsService.createList(user.uid, name, isPrivate);
      // Refresh lists
      const userLists = await listsService.getUserLists(user.uid);
      setLists(userLists);
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  const filteredLists = (listArray: List[]) => {
    return listArray.filter(list => 
      list.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const ListGrid = ({ items }: { items: List[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((list) => (
        <Card key={list.id} className="p-4">
          <div className="aspect-[2/1] relative mb-4">
            <div className="grid grid-cols-2 gap-1 h-full">
              <img
                src="/placeholder.jpg"
                alt="List cover"
                className="w-full h-full object-cover rounded-l-md"
              />
              <img
                src="/placeholder.jpg"
                alt="List cover"
                className="w-full h-full object-cover rounded-r-md"
              />
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">{list.name}</h3>
            {list.isPrivate ? (
              <Lock className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Globe className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{list.movieCount} Movies</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{list.showCount} Shows</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">My lists</h1>
          <p className="text-muted-foreground">
            Create and manage your personalized movie and TV show collections.
          </p>
        </div>
        <Button 
          variant="default" 
          onClick={() => setDialogOpen(true)}
          disabled={!user}
        >
          Add new list
        </Button>
      </div>

      <CreateListDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onListCreated={fetchLists}
      />

      {!user ? (
        <div className="text-center py-8 text-muted-foreground">
          Please sign in to create and manage lists
        </div>
      ) : (
        <Tabs defaultValue="created" className="space-y-4">
          <TabsList>
            <TabsTrigger value="created">Created by you ({lists.length})</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="popular">Popular ({publicLists.length})</TabsTrigger>
          </TabsList>

          <div className="relative">
            <Input
              type="search"
              placeholder="Search lists..."
              className="max-w-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <TabsContent value="created" className="space-y-4">
            {lists.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No lists created yet. Create your first list!
              </div>
            ) : (
              <ListGrid items={filteredLists(lists)} />
            )}
          </TabsContent>

          <TabsContent value="popular" className="space-y-4">
            {publicLists.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No public lists available.
              </div>
            ) : (
              <ListGrid items={filteredLists(publicLists)} />
            )}
          </TabsContent>

          <TabsContent value="following" className="space-y-4">
            <div className="text-center text-muted-foreground py-8">
              Following feature coming soon!
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
} 