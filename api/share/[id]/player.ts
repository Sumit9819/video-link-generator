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
        videoUrl: 'https://example.com/video.mp4',
        redirectUrl: 'https://example.com',
      };

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${video.title}</title>
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
    <div class="video-container" onclick="window.open('${video.redirectUrl}', '_blank')">
        <video autoplay muted loop>
            <source src="${video.videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        <div class="overlay"></div>
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
