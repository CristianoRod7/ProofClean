import api from './api.js';
import { demoLogin, login, register } from './mockAuth.js';

export async function loginApi(payload) {
  try {
    const { data } = await api.post('/api/auth/login', payload);
    return data;
  } catch {
    return login(payload.email, payload.password);
  }
}

export async function registerApi(payload) {
  try {
    const { data } = await api.post('/api/auth/register', payload);
    return data;
  } catch {
    return register(payload.name, payload.email, payload.password);
  }
}

export async function demoLoginApi() {
  try {
    const { data } = await api.post('/api/auth/login', { email: 'demo@proofclean.com', password: 'password1234' });
    return data;
  } catch {
    return demoLogin();
  }
}

export { login, register };
