# Video Link Generator

A full-stack application for creating shareable video links with Twitter preview and custom redirects. Built with Encore.ts backend and React frontend, deployable on Vercel.

## Features

- Upload videos and thumbnails to cloud storage
- Generate shareable links with Twitter/social media previews
- Custom redirect URLs when users click the video
- Rich Open Graph and Twitter Card meta tags
- Responsive web interface for managing videos

## Tech Stack

- **Backend**: Encore.ts with TypeScript
- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL (via Encore.ts)
- **Storage**: Object Storage (via Encore.ts)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- Encore CLI (`npm install -g @encore/cli`)

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Encore backend:
   ```bash
   encore run
   ```

4. In a new terminal, start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

5. Open http://localhost:3000 in your browser

### Deployment on Vercel

1. Connect your repository to Vercel
2. Configure the following build settings:
   - Build Command: `npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `npm install`

3. Set up environment variables in Vercel dashboard if needed

4. Deploy!

## Project Structure

```
├── backend/
│   ├── video/           # Video management service
│   └── share/           # Social sharing service
├── frontend/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   └── lib/            # Utilities and API client
├── api/                # Vercel API routes (for deployment)
└── vercel.json         # Vercel configuration
```

## API Endpoints

### Video Management
- `GET /api/videos` - List all videos
- `POST /api/videos` - Create new video
- `GET /api/videos/:id` - Get video details
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video

### Social Sharing
- `GET /share/:id` - Twitter preview page with meta tags
- `GET /share/:id/player` - Embedded video player

## License

MIT License
