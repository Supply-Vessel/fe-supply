"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog"
import { toast } from "sonner"

interface RequestsHeaderProps {
  onCreateType?: (data: { name: string; displayName: string; description?: string; color?: string }) => Promise<void>
  canInviteMembers: boolean
  isLoading?: boolean
}

const COLORS = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#22C55E" },
  { name: "Red", value: "#EF4444" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Purple", value: "#A855F7" },
  { name: "Orange", value: "#F97316" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Pink", value: "#EC4899" },
]

export function RequestsHeader({ onCreateType, isLoading, canInviteMembers }: RequestsHeaderProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState(COLORS[0].value)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!onCreateType || !name.trim() || !displayName.trim()) return

    setSubmitting(true)
    try {
      await onCreateType({
        name: name.trim(),
        displayName: displayName.trim(),
        description: description.trim() || undefined,
        color,
      })
      setOpen(false)
      setName("")
      setDisplayName("")
      setDescription("")
      setColor(COLORS[0].value)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Requests Status</h1>
        <p className="text-gray-500">Manage and monitor your requests</p>
      </div>

      {onCreateType && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                if (!canInviteMembers) {
                  toast.error("You are not authorized to add request types")
                  return
                }
              }}
              variant="outline"
              size="sm"
              disabled={isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Request Type
            </Button>
          </DialogTrigger>
          {canInviteMembers && <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create Request Type</DialogTitle>
                <DialogDescription>
                  Add a new request type. It will appear as a new tab.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name (ID)</Label>
                  <Input
                    id="name"
                    placeholder="e.g., ENGINE, ELECTRICAL"
                    value={name}
                    onChange={(e) => setName(e.target.value.toUpperCase().replace(/\s+/g, "_"))}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Unique identifier, uppercase, no spaces
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    placeholder="e.g., Engine, Electrical"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    placeholder="Brief description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Color</Label>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          color === c.value ? "border-foreground scale-110" : "border-transparent"
                        }`}
                        style={{ backgroundColor: c.value }}
                        onClick={() => setColor(c.value)}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || !name.trim() || !displayName.trim()} style={{ backgroundColor: "#2563EB" }}>
                  {submitting ? "Creating..." : "Create Request Type"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>}
        </Dialog>
      )}
    </div>
  )
}
