// Configuration for the frontend application

// The base URL for API calls
// In production on Vercel, this will be the same domain
// In development, this should point to your local Encore backend
export const apiBaseUrl = process.env.NODE_ENV === 'production' 
  ? '' // Use relative URLs in production
  : 'http://localhost:4000'; // Default Encore dev server port

// Other configuration values can be added here as needed
