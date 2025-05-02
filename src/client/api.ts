import ApiClient from './api.client';

const baseUrl = import.meta.env.VITE_API_URL as string;

if (!baseUrl) {
  throw new Error('VITE_API_URL is required but not defined');
}

const api = new ApiClient(baseUrl);

export default api;
