import { api, APIError } from "encore.dev/api";
import { videoDB } from "./db";
import type { UpdateVideoRequest, GetVideoResponse, Video } from "./types";

// Updates an existing video's metadata.
export const update = api<UpdateVideoRequest, GetVideoResponse>(
  { expose: true, method: "PUT", path: "/videos/:id" },
  async (req) => {
    const { id, ...updates } = req;

    // Check if video exists
    const existing = await videoDB.queryRow`
      SELECT id FROM videos WHERE id = ${id}
    `;

    if (!existing) {
      throw APIError.notFound("video not found");
    }

    const now = new Date();
    const setParts: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) {
      setParts.push(`title = $${setParts.length + 1}`);
      values.push(updates.title);
    }

    if (updates.description !== undefined) {
      setParts.push(`description = $${setParts.length + 1}`);
      values.push(updates.description || null);
    }

    if (updates.redirectUrl !== undefined) {
      setParts.push(`redirect_url = $${setParts.length + 1}`);
      values.push(updates.redirectUrl);
    }

    if (setParts.length === 0) {
      throw APIError.invalidArgument("no fields to update");
    }

    setParts.push(`updated_at = $${setParts.length + 1}`);
    values.push(now);

    const query = `
      UPDATE videos 
      SET ${setParts.join(", ")}
      WHERE id = $${setParts.length + 1}
    `;
    values.push(id);

    await videoDB.rawExec(query, ...values);

    // Fetch and return updated video
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

    const video: Video = {
      id: row!.id,
      title: row!.title,
      description: row!.description || undefined,
      videoUrl: row!.video_url,
      thumbnailUrl: row!.thumbnail_url || undefined,
      redirectUrl: row!.redirect_url,
      createdAt: row!.created_at,
      updatedAt: row!.updated_at,
    };

    return { video };
  }
);
