import { api, APIError } from "encore.dev/api";
import { videoDB } from "../video/db";
import type { HtmlResponse } from "./types";

// Serves the Twitter preview page with Open Graph meta tags.
export const preview = api<{ id: string }, HtmlResponse>(
  { expose: true, method: "GET", path: "/share/:id" },
  async ({ id }) => {
    const video = await videoDB.queryRow<{
      id: string;
      title: string;
      description: string | null;
      video_url: string;
      thumbnail_url: string | null;
      redirect_url: string;
    }>`
      SELECT id, title, description, video_url, thumbnail_url, redirect_url
      FROM videos
      WHERE id = ${id}
    `;

    if (!video) {
      throw APIError.notFound("video not found");
    }

    const title = video.title;
    const description = video.description || "Watch this video";
    const videoUrl = video.video_url;
    const thumbnailUrl = video.thumbnail_url || "";
    const redirectUrl = video.redirect_url;

    // Get the current domain from environment or use a default
    const domain = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : "https://your-domain.com";

    // Generate HTML with Open Graph meta tags for Twitter
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="video.other">
    <meta property="og:url" content="${domain}/share/${id}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${thumbnailUrl}">
    <meta property="og:video" content="${videoUrl}">
    <meta property="og:video:url" content="${videoUrl}">
    <meta property="og:video:secure_url" content="${videoUrl}">
    <meta property="og:video:type" content="video/mp4">
    <meta property="og:video:width" content="1280">
    <meta property="og:video:height" content="720">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="player">
    <meta name="twitter:url" content="${domain}/share/${id}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${thumbnailUrl}">
    <meta name="twitter:player" content="${domain}/share/${id}/player">
    <meta name="twitter:player:width" content="1280">
    <meta name="twitter:player:height" content="720">
    
    <script>
        // Redirect to the custom URL when the page loads
        window.location.href = "${redirectUrl}";
    </script>
</head>
<body>
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: Arial, sans-serif;">
        <h1>${title}</h1>
        <p>${description}</p>
        <p>Redirecting to <a href="${redirectUrl}">${redirectUrl}</a>...</p>
        <p>If you are not redirected automatically, <a href="${redirectUrl}">click here</a>.</p>
    </div>
</body>
</html>`;

    return { html };
  }
);
