/// <reference types="vite/client" />
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const BASE_URL = isLocalhost ? 'http://localhost:5000/api' : '/api';

/**
 * A tiny wrapper around native fetch to automatically
 * prepend the API base URL and always include secure cookies.
 */
const apiClientFn = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  // If uploading FormData, browser sets correct multipart/form-data with boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Extremely important: This sends our HttpOnly session cookie
  });

  if (!response.ok) {
    let errorMessage = `HTTP Error: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      // Fallback to text or generic message
    }
    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) return null;

  return response.json();
};

// Formally type the helper methods
interface ApiClient {
  (endpoint: string, options?: RequestInit): Promise<any>;
  get: (endpoint: string, options?: RequestInit) => Promise<any>;
  post: (endpoint: string, body?: any, options?: RequestInit) => Promise<any>;
  patch: (endpoint: string, body?: any, options?: RequestInit) => Promise<any>;
  delete: (endpoint: string, options?: RequestInit) => Promise<any>;
}

const api = apiClientFn as ApiClient;

api.get = (endpoint: string, options?: RequestInit) => api(endpoint, { ...options, method: 'GET' });
api.post = (endpoint: string, body?: any, options?: RequestInit) => api(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
api.patch = (endpoint: string, body?: any, options?: RequestInit) => api(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) });
api.delete = (endpoint: string, options?: RequestInit) => api(endpoint, { ...options, method: 'DELETE' });

export { api as apiClient };
