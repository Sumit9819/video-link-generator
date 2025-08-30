import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoList from "../components/VideoList";
import CreateVideoDialog from "../components/CreateVideoDialog";
import type { Video } from "~backend/video/types";
import backend from "~backend/client";
import { useToast } from "@/components/ui/use-toast";

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const loadVideos = async () => {
    try {
      const response = await backend.video.list();
      setVideos(response.videos);
    } catch (error) {
      console.error("Failed to load videos:", error);
      toast({
        title: "Error",
        description: "Failed to load videos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleVideoCreated = (video: Video) => {
    setVideos(prev => [video, ...prev]);
    setCreateDialogOpen(false);
  };

  const handleVideoDeleted = (videoId: string) => {
    setVideos(prev => prev.filter(v => v.id !== videoId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Video Link Generator</h1>
          <p className="text-gray-600 mt-2">
            Create shareable video links with Twitter preview and custom redirects
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Video Link
        </Button>
      </div>

      <VideoList 
        videos={videos} 
        loading={loading} 
        onVideoDeleted={handleVideoDeleted}
      />

      <CreateVideoDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onVideoCreated={handleVideoCreated}
      />
    </div>
  );
}
