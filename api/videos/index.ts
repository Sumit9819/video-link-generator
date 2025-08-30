import { VercelRequest, VercelResponse } from '@vercel/node';
import { video } from '../../backend/video';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const result = await video.list();
      return res.json(result);
    }
    
    if (req.method === 'POST') {
      const result = await video.create(req.body);
      return res.json(result);
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
