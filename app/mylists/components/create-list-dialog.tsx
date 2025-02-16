"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { listsService } from "@/lib/services/lists"
import { auth } from "@/lib/firebase"
import { toast } from "sonner"

interface CreateListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onListCreated: () => void
}

export function CreateListDialog({ open, onOpenChange, onListCreated }: CreateListDialogProps) {
  const [listName, setListName] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const user = auth.currentUser

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error("Please sign in to create a list")
      return
    }
    setIsLoading(true)
    try {
      await listsService.createList({
        title: listName.trim(),
        isPublic: !isPrivate
      })
      toast.success("List created successfully!")
      onListCreated() // Trigger refresh of lists
      setListName("")
      setIsPrivate(false)
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating list:", error)
      toast.error("Failed to create list")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New List</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">List Name</Label>
            <Input
              id="name"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="Enter list name"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="private">Make this list private</Label>
            <Switch
              id="private"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create List"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 