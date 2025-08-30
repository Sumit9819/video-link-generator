export interface Video {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  redirectUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVideoRequest {
  title: string;
  description?: string;
  redirectUrl: string;
}

export interface CreateVideoResponse {
  video: Video;
  uploadUrls: {
    videoUploadUrl: string;
    thumbnailUploadUrl?: string;
  };
}

export interface UpdateVideoRequest {
  id: string;
  title?: string;
  description?: string;
  redirectUrl?: string;
}

export interface ListVideosResponse {
  videos: Video[];
}

export interface GetVideoResponse {
  video: Video;
}
