import { VercelRequest, VercelResponse } from '@vercel/node';

// Mock video data
const mockVideo = {
  id: '1',
  title: 'Sample Video',
  description: 'This is a sample video',
  videoUrl: 'https://example.com/video.mp4',
  thumbnailUrl: 'https://example.com/thumb.jpg',
  redirectUrl: 'https://example.com',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid video ID' });
  }

  try {
    if (req.method === 'GET') {
      return res.status(200).json({ video: mockVideo });
    }
    
    if (req.method === 'PUT') {
      const updatedVideo = { ...mockVideo, ...req.body, updatedAt: new Date().toISOString() };
      return res.status(200).json({ video: updatedVideo });
    }
    
    if (req.method === 'DELETE') {
      return res.status(204).end();
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
