"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Lock, Globe } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { listsService } from "@/lib/services/lists"
import { toast } from "sonner"

interface CreateListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onListCreated: () => void  // New callback for list creation
}

export function CreateListDialog({ open, onOpenChange, onListCreated }: CreateListDialogProps) {
  const { user } = useAuth()
  const [listName, setListName] = useState("")
  const [isPrivate, setIsPrivate] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!user || !listName.trim()) return

    setIsLoading(true)
    try {
      await listsService.createList(user.uid, listName.trim(), isPrivate)
      toast.success("List created successfully!")
      onListCreated() // Trigger refresh of lists
      setListName("")
      setIsPrivate(true)
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating list:", error)
      toast.error("Failed to create list. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>What do you want to call the list?</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Enter list name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            disabled={isLoading}
          />
          <ToggleGroup
            type="single"
            value={isPrivate ? "private" : "public"}
            onValueChange={(value) => setIsPrivate(value === "private")}
            className="justify-start"
            disabled={isLoading}
          >
            <ToggleGroupItem value="private" aria-label="Private list">
              <Lock className="h-4 w-4 mr-2" />
              Private
            </ToggleGroupItem>
            <ToggleGroupItem value="public" aria-label="Public list">
              <Globe className="h-4 w-4 mr-2" />
              Public
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!listName.trim() || isLoading}
          >
            {isLoading ? "Creating..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 