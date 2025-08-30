import React from "react";
import { Play, ExternalLink, Calendar, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Video } from "~backend/video/types";
import { useNavigate } from "react-router-dom";
import backend from "../lib/api";
import { useToast } from "@/components/ui/use-toast";

interface VideoListProps {
  videos: Video[];
  loading: boolean;
  onVideoDeleted: (videoId: string) => void;
}

export default function VideoList({ videos = [], loading, onVideoDeleted }: VideoListProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = async (video: Video, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm(`Are you sure you want to delete "${video.title}"?`)) {
      return;
    }

    try {
      await backend.video.deleteVideo({ id: video.id });
      onVideoDeleted(video.id);
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
    }
  };

  const copyShareLink = (video: Video, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/share/${video.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Copied!",
      description: "Share link copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-12">
        <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos yet</h3>
        <p className="text-gray-600 mb-6">
          Create your first video link to get started with Twitter previews and custom redirects.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <Card 
          key={video.id} 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate(`/video/${video.id}`)}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
              {video.thumbnailUrl ? (
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Play className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            
            {video.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {video.description}
              </p>
            )}
            
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">
                <ExternalLink className="w-3 h-3 mr-1" />
                Redirect
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(video.createdAt).toLocaleDateString()}
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={(e) => copyShareLink(video, e)}
              >
                Copy Link
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/video/${video.id}`);
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={(e) => handleDelete(video, e)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
