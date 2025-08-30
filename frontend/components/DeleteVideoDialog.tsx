import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import type { Video } from "~backend/video/types";
import backend from "../lib/api";
import { useToast } from "@/components/ui/use-toast";

interface DeleteVideoDialogProps {
  video: Video;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVideoDeleted: () => void;
}

export default function DeleteVideoDialog({ 
  video,
  open, 
  onOpenChange, 
  onVideoDeleted 
}: DeleteVideoDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await backend.video.deleteVideo({ id: video.id });
      onVideoDeleted();
      toast({
        title: "Success",
        description: "Video deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete video:", error);
      toast({
        title: "Error",
        description: "Failed to delete video",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <DialogTitle>Delete Video</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete "{video.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1"
          >
            {deleting ? "Deleting..." : "Delete Video"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
