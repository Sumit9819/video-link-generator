import { VercelRequest, VercelResponse } from '@vercel/node';
import { share } from '../../../backend/share';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid video ID' });
  }

  try {
    if (req.method === 'GET') {
      const result = await share.preview({ id });
      res.setHeader('Content-Type', 'text/html');
      return res.send(result.html);
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
