import { api, APIError } from "encore.dev/api";
import { videoDB } from "./db";
import type { GetVideoResponse, Video } from "./types";

// Retrieves a specific video by ID.
export const get = api<{ id: string }, GetVideoResponse>(
  { expose: true, method: "GET", path: "/videos/:id" },
  async ({ id }) => {
    const row = await videoDB.queryRow<{
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
      WHERE id = ${id}
    `;

    if (!row) {
      throw APIError.notFound("video not found");
    }

    const video: Video = {
      id: row.id,
      title: row.title,
      description: row.description || undefined,
      videoUrl: row.video_url,
      thumbnailUrl: row.thumbnail_url || undefined,
      redirectUrl: row.redirect_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    return { video };
  }
);
