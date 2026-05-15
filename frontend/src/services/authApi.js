import api from './api.js';
export const login = async (payload) => (await api.post('/api/auth/login', payload)).data;
export const register = async (payload) => (await api.post('/api/auth/register', payload)).data;
