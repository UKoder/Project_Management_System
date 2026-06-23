import axios from 'axios';

let API_URL = import.meta.env.VITE_API_URL || '/api';
if (API_URL.startsWith('http') && !API_URL.endsWith('/api') && !API_URL.endsWith('/api/')) {
  API_URL = API_URL.replace(/\/$/, '') + '/api';
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register') || error.config?.url?.includes('/auth/me');
    if (error.response?.status === 401 && !isAuthEndpoint) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
