import axios from 'axios';
import { clearAuthStorage, getStoredToken } from './authStorage.js';

function normalizeApiBaseUrl(value) {
  const fallback = 'http://localhost:8080/api';
  const raw = String(value || fallback).trim();
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `http://${raw.replace(/^\/+/, '')}`;
  return withProtocol.replace(/\/+$/, '').replace(/\/api$/i, '') + '/api';
}

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/i, '');

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthStorage();
      if (window.location.pathname !== '/login') window.location.assign('/login');
    }
    return Promise.reject(error);
  },
);

export default api;
