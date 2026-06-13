import api from './api.js';
import { demoLogin, login, register } from './mockAuth.js';

export async function loginApi(payload) {
  try {
    const { data } = await api.post('/api/auth/login', payload);
    return data;
  } catch (error) {
    if (error.response) throw new Error(error.response.data?.detail || '로그인에 실패했습니다.');
    return login(payload.email, payload.password);
  }
}

export async function registerApi(payload) {
  try {
    const { data } = await api.post('/api/auth/register', payload);
    return data;
  } catch (error) {
    if (error.response) throw new Error(error.response.data?.detail || '회원가입에 실패했습니다.');
    return register(payload.name, payload.email, payload.password);
  }
}

export async function demoLoginApi() {
  try {
    const { data } = await api.post('/api/auth/login', { email: 'demo@proofclean.com', password: 'password1234' });
    return data;
  } catch (error) {
    if (error.response) throw new Error(error.response.data?.detail || '데모 로그인에 실패했습니다.');
    return demoLogin();
  }
}

export async function getCurrentUserApi(token, fallbackUser = null) {
  try {
    const { data } = await api.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
    return data;
  } catch (error) {
    if (!error.response && token?.startsWith('mock-token-') && fallbackUser) return fallbackUser;
    throw error;
  }
}

export { login, register };
