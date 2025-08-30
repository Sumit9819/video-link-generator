import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Video } from "~backend/video/types";
import backend from "~backend/client";
import { useToast } from "@/components/ui/use-toast";

interface EditVideoDialogProps {
  video: Video;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVideoUpdated: (video: Video) => void;
}

export default function EditVideoDialog({ 
  video,
  open, 
  onOpenChange, 
  onVideoUpdated 
}: EditVideoDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (video) {
      setTitle(video.title);
      setDescription(video.description || "");
      setRedirectUrl(video.redirectUrl);
    }
  }, [video]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !redirectUrl.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const response = await backend.video.update({
        id: video.id,
        title: title.trim(),
        description: description.trim() || undefined,
        redirectUrl: redirectUrl.trim(),
      });

      onVideoUpdated(response.video);
      toast({
        title: "Success",
        description: "Video updated successfully",
      });
    } catch (error) {
      console.error("Failed to update video:", error);
      toast({
        title: "Error",
        description: "Failed to update video",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Video</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              disabled={saving}
            />
          </div>
          
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description (optional)"
              disabled={saving}
            />
          </div>
          
          <div>
            <Label htmlFor="edit-redirectUrl">Redirect URL *</Label>
            <Input
              id="edit-redirectUrl"
              type="url"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              placeholder="https://example.com"
              disabled={saving}
            />
            <p className="text-xs text-gray-500 mt-1">
              Users will be redirected to this URL when they click the video
            </p>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
