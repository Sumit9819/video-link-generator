import { VercelRequest, VercelResponse } from '@vercel/node';
import { video } from '../../backend/video';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid video ID' });
  }

  try {
    if (req.method === 'GET') {
      const result = await video.get({ id });
      return res.json(result);
    }
    
    if (req.method === 'PUT') {
      const result = await video.update({ id, ...req.body });
      return res.json(result);
    }
    
    if (req.method === 'DELETE') {
      await video.deleteVideo({ id });
      return res.status(204).end();
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
