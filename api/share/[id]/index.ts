import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid video ID' });
  }

  try {
    if (req.method === 'GET') {
      // Mock video data
      const video = {
        id,
        title: 'Sample Video',
        description: 'This is a sample video',
        videoUrl: 'https://example.com/video.mp4',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        redirectUrl: 'https://example.com',
      };

      const domain = req.headers.host ? `https://${req.headers.host}` : 'https://localhost:3000';

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${video.title}</title>
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="video.other">
    <meta property="og:url" content="${domain}/share/${id}">
    <meta property="og:title" content="${video.title}">
    <meta property="og:description" content="${video.description}">
    <meta property="og:image" content="${video.thumbnailUrl}">
    <meta property="og:video" content="${video.videoUrl}">
    <meta property="og:video:url" content="${video.videoUrl}">
    <meta property="og:video:secure_url" content="${video.videoUrl}">
    <meta property="og:video:type" content="video/mp4">
    <meta property="og:video:width" content="1280">
    <meta property="og:video:height" content="720">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="player">
    <meta name="twitter:url" content="${domain}/share/${id}">
    <meta name="twitter:title" content="${video.title}">
    <meta name="twitter:description" content="${video.description}">
    <meta name="twitter:image" content="${video.thumbnailUrl}">
    <meta name="twitter:player" content="${domain}/share/${id}/player">
    <meta name="twitter:player:width" content="1280">
    <meta name="twitter:player:height" content="720">
    
    <script>
        // Redirect to the custom URL when the page loads
        window.location.href = "${video.redirectUrl}";
    </script>
</head>
<body>
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: Arial, sans-serif;">
        <h1>${video.title}</h1>
        <p>${video.description}</p>
        <p>Redirecting to <a href="${video.redirectUrl}">${video.redirectUrl}</a>...</p>
        <p>If you are not redirected automatically, <a href="${video.redirectUrl}">click here</a>.</p>
    </div>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
