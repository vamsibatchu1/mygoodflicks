// User's media lists
// List management
// Show/movie counts

"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { listsService } from "@/lib/services/lists";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Lock, Globe } from "lucide-react"
import { CreateListDialog } from "./components/create-list-dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import Image from 'next/image'
import type { List } from "@/types"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import ListCard from '@/components/list-card'

export default function ShowsPage() {
  const { user, loading: authLoading } = useAuth();
  const [lists, setLists] = useState<List[]>([]);
  const [publicLists, setPublicLists] = useState<List[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newListName, setNewListName] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const fetchLists = useCallback(async () => {
    if (!user) {
      console.log("No user found, clearing lists");
      setLists([]);
      return;
    }

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
      
    } catch (error: unknown) {
      console.error("Error fetching lists:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Failed to fetch lists");
      } else {
        toast.error("Failed to fetch lists");
      }
    }
  }, [user]);

  useEffect(() => {
    fetchLists();
  }, [user, fetchLists]);

  // Add loading state for auth
  if (authLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

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
              <Image
                src="/placeholder.jpg"
                alt="List cover"
                width={200}
                height={100}
                className="w-full h-full object-cover rounded-l-md"
              />
              <Image
                src="/placeholder.jpg"
                alt="List cover"
                width={200}
                height={100}
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

  const handleCreateList = async () => {
    if (!user) {
      toast.error("Please log in to create a list");
      return;
    }

    if (!newListName.trim()) {
      toast.error("Please enter a list name");
      return;
    }

    try {
      await listsService.createList(user.uid, newListName, isPrivate);
      toast.success("List created successfully!");
      setIsOpen(false);
      setNewListName('');
      setIsPrivate(false);
      
      // Refresh user lists
      const updated_lists = await listsService.getUserLists(user.uid);
      setLists(updated_lists);
      
    } catch (error: unknown) {
      console.error("Error creating list:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Failed to create list");
      } else {
        toast.error("Failed to create list");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">My lists</h1>
          <p className="text-muted-foreground">
            Create and manage your personalized movie and TV show collections.
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Create New List</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New List</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">List Name</Label>
                <Input
                  id="name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Enter list name"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="private"
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                />
                <Label htmlFor="private">Private List</Label>
              </div>
              <Button onClick={handleCreateList}>Create List</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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