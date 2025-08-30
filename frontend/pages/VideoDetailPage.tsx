import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EditVideoDialog from "../components/EditVideoDialog";
import DeleteVideoDialog from "../components/DeleteVideoDialog";
import type { Video } from "~backend/video/types";
import backend from "../lib/api";
import { useToast } from "@/components/ui/use-toast";

export default function VideoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const loadVideo = async () => {
    if (!id) return;
    
    try {
      const response = await backend.video.get({ id });
      setVideo(response.video);
    } catch (error) {
      console.error("Failed to load video:", error);
      toast({
        title: "Error",
        description: "Failed to load video",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideo();
  }, [id]);

  const handleVideoUpdated = (updatedVideo: Video) => {
    setVideo(updatedVideo);
    setEditDialogOpen(false);
  };

  const handleVideoDeleted = () => {
    navigate("/");
  };

  const copyShareLink = () => {
    if (!video) return;
    
    const shareUrl = `${window.location.origin}/share/${video.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Copied!",
      description: "Share link copied to clipboard",
    });
  };

  const openShareLink = () => {
    if (!video) return;
    
    const shareUrl = `${window.location.origin}/share/${video.id}`;
    window.open(shareUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Video not found</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button onClick={() => navigate("/")} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        <div className="flex gap-2">
          <Button onClick={copyShareLink} variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Copy Share Link
          </Button>
          <Button onClick={openShareLink} variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Share Link
          </Button>
          <Button onClick={() => setEditDialogOpen(true)} variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button onClick={() => setDeleteDialogOpen(true)} variant="destructive" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Video Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <video 
                  src={video.videoUrl} 
                  controls 
                  className="w-full h-full object-contain"
                  poster={video.thumbnailUrl}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Title</label>
                <p className="text-lg font-semibold">{video.title}</p>
              </div>
              
              {video.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-700">{video.description}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-500">Redirect URL</label>
                <p className="text-blue-600 hover:text-blue-800 break-all">
                  <a href={video.redirectUrl} target="_blank" rel="noopener noreferrer">
                    {video.redirectUrl}
                  </a>
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="text-gray-700">
                  {new Date(video.createdAt).toLocaleDateString()} at{" "}
                  {new Date(video.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Share Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Share URL</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-2 bg-gray-100 rounded text-sm break-all">
                    {window.location.origin}/share/{video.id}
                  </code>
                  <Button onClick={copyShareLink} size="sm" variant="outline">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Badge variant="secondary">Twitter Preview Enabled</Badge>
                <Badge variant="secondary">Custom Redirect Configured</Badge>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>When shared on Twitter, this link will:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Display a rich media preview with video thumbnail</li>
                  <li>Show an embedded video player</li>
                  <li>Redirect users to your custom URL when clicked</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <EditVideoDialog
        video={video}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onVideoUpdated={handleVideoUpdated}
      />

      <DeleteVideoDialog
        video={video}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onVideoDeleted={handleVideoDeleted}
      />
    </div>
  );
}
