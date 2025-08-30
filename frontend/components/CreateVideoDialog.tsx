import React, { useState } from "react";
import { Upload, Link, FileVideo } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import type { Video } from "~backend/video/types";
import backend from "../lib/api";
import { useToast } from "@/components/ui/use-toast";

interface CreateVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVideoCreated: (video: Video) => void;
}

export default function CreateVideoDialog({ 
  open, 
  onOpenChange, 
  onVideoCreated 
}: CreateVideoDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setRedirectUrl("");
    setVideoFile(null);
    setThumbnailFile(null);
    setUploadProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !redirectUrl.trim() || !videoFile) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select a video file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create video entry and get upload URLs
      const response = await backend.video.create({
        title: title.trim(),
        description: description.trim() || undefined,
        redirectUrl: redirectUrl.trim(),
      });

      setUploadProgress(25);

      // Upload video file
      const videoFormData = new FormData();
      videoFormData.append("file", videoFile);

      await fetch(response.uploadUrls.videoUploadUrl, {
        method: "PUT",
        body: videoFile,
        headers: {
          "Content-Type": videoFile.type,
        },
      });

      setUploadProgress(75);

      // Upload thumbnail if provided
      if (thumbnailFile && response.uploadUrls.thumbnailUploadUrl) {
        await fetch(response.uploadUrls.thumbnailUploadUrl, {
          method: "PUT",
          body: thumbnailFile,
          headers: {
            "Content-Type": thumbnailFile.type,
          },
        });
      }

      setUploadProgress(100);

      onVideoCreated(response.video);
      resetForm();
      toast({
        title: "Success",
        description: "Video created successfully",
      });
    } catch (error) {
      console.error("Failed to create video:", error);
      toast({
        title: "Error",
        description: "Failed to create video",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("video/")) {
        setVideoFile(file);
      } else {
        toast({
          title: "Error",
          description: "Please select a valid video file",
          variant: "destructive",
        });
      }
    }
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setThumbnailFile(file);
      } else {
        toast({
          title: "Error",
          description: "Please select a valid image file",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Video Link</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              disabled={uploading}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description (optional)"
              disabled={uploading}
            />
          </div>
          
          <div>
            <Label htmlFor="redirectUrl">Redirect URL *</Label>
            <Input
              id="redirectUrl"
              type="url"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              placeholder="https://example.com"
              disabled={uploading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Users will be redirected to this URL when they click the video
            </p>
          </div>
          
          <div>
            <Label htmlFor="video">Video File *</Label>
            <div className="mt-1">
              <input
                id="video"
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
                disabled={uploading}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("video")?.click()}
                disabled={uploading}
                className="w-full"
              >
                <FileVideo className="w-4 h-4 mr-2" />
                {videoFile ? videoFile.name : "Select Video File"}
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="thumbnail">Thumbnail Image (Optional)</Label>
            <div className="mt-1">
              <input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleThumbnailFileChange}
                disabled={uploading}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("thumbnail")?.click()}
                disabled={uploading}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                {thumbnailFile ? thumbnailFile.name : "Select Thumbnail Image"}
              </Button>
            </div>
          </div>
          
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
          
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              disabled={uploading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={uploading} className="flex-1">
              {uploading ? "Creating..." : "Create Video Link"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
