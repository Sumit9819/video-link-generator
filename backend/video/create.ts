import { api } from "encore.dev/api";
import { videoDB } from "./db";
import { videoBucket, thumbnailBucket } from "./storage";
import type { CreateVideoRequest, CreateVideoResponse } from "./types";
import { randomBytes } from "crypto";

// Creates a new video entry and returns upload URLs for the video file and optional thumbnail.
export const create = api<CreateVideoRequest, CreateVideoResponse>(
  { expose: true, method: "POST", path: "/videos" },
  async (req) => {
    const id = randomBytes(16).toString("hex");
    const videoFileName = `${id}.mp4`;
    const thumbnailFileName = `${id}.jpg`;

    // Generate signed upload URLs
    const videoUploadUrl = await videoBucket.signedUploadUrl(videoFileName, {
      ttl: 3600, // 1 hour
    });

    const thumbnailUploadUrl = await thumbnailBucket.signedUploadUrl(thumbnailFileName, {
      ttl: 3600, // 1 hour
    });

    const videoUrl = videoBucket.publicUrl(videoFileName);
    const thumbnailUrl = thumbnailBucket.publicUrl(thumbnailFileName);

    const now = new Date();

    await videoDB.exec`
      INSERT INTO videos (id, title, description, video_url, thumbnail_url, redirect_url, created_at, updated_at)
      VALUES (${id}, ${req.title}, ${req.description || null}, ${videoUrl}, ${thumbnailUrl}, ${req.redirectUrl}, ${now}, ${now})
    `;

    const video = {
      id,
      title: req.title,
      description: req.description,
      videoUrl,
      thumbnailUrl,
      redirectUrl: req.redirectUrl,
      createdAt: now,
      updatedAt: now,
    };

    return {
      video,
      uploadUrls: {
        videoUploadUrl: videoUploadUrl.url,
        thumbnailUploadUrl: thumbnailUploadUrl.url,
      },
    };
  }
);
