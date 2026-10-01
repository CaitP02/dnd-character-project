import axios from 'axios';

// The API is reached as same-origin /api: through the Vite dev proxy locally,
// nginx in Docker, and a Vercel rewrite in production. VITE_API_URL overrides it.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60_000,
});

export const errorMessage = (error) => {
  if (error?.response?.data?.error?.message) return error.response.data.error.message;
  if (error?.code === 'ECONNABORTED') return 'The server took too long to answer. Please try again.';
  if (error?.request && !error?.response) return 'Cannot reach the server. Check your connection or try again shortly.';
  return error?.message ?? 'Something went wrong.';
};

export const errorDetails = (error) => error?.response?.data?.error?.details ?? [];

export const isCancel = axios.isCancel;
