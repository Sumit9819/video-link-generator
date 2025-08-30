import { api } from "encore.dev/api";
import { videoDB } from "./db";
import type { ListVideosResponse, Video } from "./types";

// Retrieves all videos, ordered by creation date (latest first).
export const list = api<void, ListVideosResponse>(
  { expose: true, method: "GET", path: "/videos" },
  async () => {
    const rows = await videoDB.queryAll<{
      id: string;
      title: string;
      description: string | null;
      video_url: string;
      thumbnail_url: string | null;
      redirect_url: string;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT id, title, description, video_url, thumbnail_url, redirect_url, created_at, updated_at
      FROM videos
      ORDER BY created_at DESC
    `;

    const videos: Video[] = rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description || undefined,
      videoUrl: row.video_url,
      thumbnailUrl: row.thumbnail_url || undefined,
      redirectUrl: row.redirect_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return { videos };
  }
);
