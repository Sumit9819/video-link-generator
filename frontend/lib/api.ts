import { apiBaseUrl } from '../config';

// Create a custom backend client that works with Vercel deployment
class BackendClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = apiBaseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    // For non-JSON responses (like HTML), return as text
    const text = await response.text();
    return text as unknown as T;
  }

  video = {
    list: () => this.request<{ videos: any[] }>('/videos'),
    
    get: (params: { id: string }) => 
      this.request<{ video: any }>(`/videos/${params.id}`),
    
    create: (data: any) => 
      this.request<any>('/videos', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: (data: any) => 
      this.request<{ video: any }>(`/videos/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    deleteVideo: (params: { id: string }) => 
      this.request<void>(`/videos/${params.id}`, {
        method: 'DELETE',
      }),
  };

  share = {
    preview: (params: { id: string }) => 
      this.request<{ html: string }>(`/share/${params.id}`),
    
    player: (params: { id: string }) => 
      this.request<{ html: string }>(`/share/${params.id}/player`),
  };
}

const backend = new BackendClient();
export default backend;
