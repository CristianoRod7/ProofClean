import api from './api.js';
export const login = async (payload) => (await api.post('/auth/login', payload)).data;
export const register = async (payload) => (await api.post('/auth/register', payload)).data;
