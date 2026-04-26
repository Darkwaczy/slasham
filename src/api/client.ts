/// <reference types="vite/client" />
const BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

/**
 * A tiny wrapper around native fetch to automatically
 * prepend the API base URL and always include secure cookies.
 */
export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
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
