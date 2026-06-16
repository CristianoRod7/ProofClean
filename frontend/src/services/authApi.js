import api from './api.js';
import { demoLogin, login, register } from './mockAuth.js';

function normalizeAuthResponse(data) {
  const token = data?.token || data?.access_token || data?.accessToken;
  const user = data?.user || data?.profile || null;
  if (!token) throw new Error('로그인 응답에 인증 토큰이 없습니다.');
  if (!user) throw new Error('로그인 응답에 사용자 정보가 없습니다.');
  return { user, token };
}

function authErrorMessage(error, fallback) {
  if (error.response?.status === 404) {
    return '인증 서버 경로를 찾을 수 없습니다. API 서버 주소를 확인해 주세요.';
  }
  return error.response?.data?.detail || fallback;
}

export async function loginApi(payload) {
  try {
    const { data } = await api.post('/auth/login', payload);
    return normalizeAuthResponse(data);
  } catch (error) {
    if (error.response) throw new Error(authErrorMessage(error, '로그인에 실패했습니다.'));
    return login(payload.email, payload.password);
  }
}

export async function registerApi(payload) {
  try {
    const { data } = await api.post('/auth/register', payload);
    return normalizeAuthResponse(data);
  } catch (error) {
    if (error.response) throw new Error(authErrorMessage(error, '회원가입에 실패했습니다.'));
    return register(payload.name, payload.email, payload.password);
  }
}

export async function demoLoginApi() {
  try {
    const { data } = await api.post('/auth/login', { email: 'demo@proofclean.com', password: 'password1234' });
    return normalizeAuthResponse(data);
  } catch (error) {
    if (error.response) throw new Error(authErrorMessage(error, '데모 로그인에 실패했습니다.'));
    return demoLogin();
  }
}

export async function getCurrentUserApi(token, fallbackUser = null) {
  try {
    const { data } = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
    return data;
  } catch (error) {
    if (!error.response && token?.startsWith('mock-token-') && fallbackUser) return fallbackUser;
    throw error;
  }
}

export { login, register };
