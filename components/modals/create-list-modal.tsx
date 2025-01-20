'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { listsService } from "@/lib/services/lists"
import { toast } from "sonner"

interface CreateListModalProps {
  open: boolean
  onClose: () => void
}

export function CreateListModal({ open, onClose }: CreateListModalProps) {
  const [title, setTitle] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await listsService.createList({
        title: title.trim(),
        isPublic
      })
      toast.success("List created successfully")
      onClose()
      setTitle("")
      setIsPublic(false)
    } catch (error) {
      console.error("Error creating list:", error)
      toast.error("Failed to create list")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New List</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">List Name</Label>
            <Input
              id="title"
              placeholder="Enter list name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="public">Make this list public</Label>
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
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