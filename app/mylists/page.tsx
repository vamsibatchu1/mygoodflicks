// User's media lists
// List management
// Show/movie counts

"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { listsService } from "@/lib/services/lists";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Lock, Globe } from "lucide-react"
import { CreateListDialog } from "./components/create-list-dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import Image from 'next/image'
import type { List as ListType } from "@/types"
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
import { auth } from "@/lib/firebase"
import { Plus } from "lucide-react"

interface UserList {
  id: string
  name: string
  isPrivate: boolean
  userId: string
  items: any[]
  createdAt: any
  updatedAt?: any  // Add optional updatedAt field
  movieCount: number
  showCount: number
  lastUpdated: any
}

export default function ShowsPage() {
  const { user, loading: authLoading } = useAuth();
  const [userLists, setUserLists] = useState<UserList[]>([]);
  const [publicLists, setPublicLists] = useState<UserList[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newListName, setNewListName] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const fetchLists = useCallback(async () => {
    if (!user) {
      console.log("No user found, clearing lists");
      setUserLists([]);
      setPublicLists([]);
      return;
    }

    try {
      console.log("Current user ID:", user.uid);
      console.log("Starting to fetch user lists...");
      
      const fetchedLists = await listsService.getUserLists(user.uid);
      const transformedLists = fetchedLists.map(list => ({
        ...list,
        movieCount: (list.items || []).filter(item => item.type === 'movie').length,
        showCount: (list.items || []).filter(item => item.type === 'show').length,
        isPrivate: list.isPrivate ?? true,
        lastUpdated: list.createdAt
      }));
      setUserLists(transformedLists);

      console.log("Starting to fetch public lists...");
      const public_lists = await listsService.getPublicLists();
      const publicListsWithCounts = public_lists.map(list => ({
        ...list,
        movieCount: (list.items || []).filter(item => item.type === 'movie').length,
        showCount: (list.items || []).filter(item => item.type === 'show').length,
        isPrivate: list.isPrivate ?? false,
        lastUpdated: list.createdAt  // Just use createdAt for now
      }));
      setPublicLists(publicListsWithCounts);
      
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

  const filteredLists = (listArray: UserList[]) => {
    return listArray.filter(list => 
      list.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const ListGrid = ({ items }: { items: UserList[] }) => (
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
      await listsService.createList({
        title: newListName,
        isPublic: !isPrivate
      });
      toast.success("List created successfully!");
      setIsOpen(false);
      setNewListName('');
      setIsPrivate(false);
      
      // Refresh user lists
      const updated_lists = await listsService.getUserLists(user.uid);
      const transformedLists = updated_lists.map(list => ({
        ...list,
        movieCount: (list.items || []).filter(item => item.type === 'movie').length,
        showCount: (list.items || []).filter(item => item.type === 'show').length,
        lastUpdated: list.createdAt,
        isPrivate: list.isPrivate ?? true  // Provide default value
      }));
      setUserLists(transformedLists);
      
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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">My Lists</h1>
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

      {user && (
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Your Lists</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {userLists.map((list) => (
                <ListCard key={list.id} list={list} />
              ))}
            </div>
          </section>
        </div>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-4">Public Lists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {publicLists.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      </section>
    </div>
  )
} 