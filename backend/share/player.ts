import { api, APIError } from "encore.dev/api";
import { videoDB } from "../video/db";
import type { HtmlResponse } from "./types";

// Serves the embedded video player for Twitter.
export const player = api<{ id: string }, HtmlResponse>(
  { expose: true, method: "GET", path: "/share/:id/player" },
  async ({ id }) => {
    const video = await videoDB.queryRow<{
      id: string;
      title: string;
      description: string | null;
      video_url: string;
      redirect_url: string;
    }>`
      SELECT id, title, description, video_url, redirect_url
      FROM videos
      WHERE id = ${id}
    `;

    if (!video) {
      throw APIError.notFound("video not found");
    }

    const title = video.title;
    const videoUrl = video.video_url;
    const redirectUrl = video.redirect_url;

    // Generate HTML for the embedded video player
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .video-container {
            position: relative;
            width: 100%;
            height: 100vh;
            cursor: pointer;
        }
        video {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            cursor: pointer;
            z-index: 10;
        }
    </style>
</head>
<body>
    <div class="video-container" onclick="window.open('${redirectUrl}', '_blank')">
        <video autoplay muted loop>
            <source src="${videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        <div class="overlay"></div>
    </div>
</body>
</html>`;

    return { html };
  }
);
