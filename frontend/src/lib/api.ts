import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
}

// Initialize from saved token
const saved = localStorage.getItem('token');
if (saved) setAuthToken(saved);

// Response interceptor to catch 401s (optional navigation will be done by caller)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      // token invalid/expired
      // you can dispatch logout from a central place if needed
    }
    return Promise.reject(error);
  }
);