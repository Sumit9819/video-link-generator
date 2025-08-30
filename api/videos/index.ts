import { VercelRequest, VercelResponse } from '@vercel/node';

// Mock video data for testing
const mockVideos = [
  {
    id: '1',
    title: 'Sample Video 1',
    description: 'This is a sample video',
    videoUrl: 'https://example.com/video1.mp4',
    thumbnailUrl: 'https://example.com/thumb1.jpg',
    redirectUrl: 'https://example.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Sample Video 2',
    description: 'Another sample video',
    videoUrl: 'https://example.com/video2.mp4',
    thumbnailUrl: 'https://example.com/thumb2.jpg',
    redirectUrl: 'https://example.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      return res.status(200).json({ videos: mockVideos });
    }
    
    if (req.method === 'POST') {
      const { title, description, redirectUrl } = req.body;
      
      const newVideo = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        description,
        videoUrl: 'https://example.com/video.mp4',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        redirectUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return res.status(201).json({
        video: newVideo,
        uploadUrls: {
          videoUploadUrl: 'https://example.com/upload-video',
          thumbnailUploadUrl: 'https://example.com/upload-thumbnail',
        }
      });
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
