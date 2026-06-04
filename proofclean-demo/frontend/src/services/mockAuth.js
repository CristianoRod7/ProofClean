import { getItem, removeItem, setItem } from './storage.js';

export const AUTH_USER_KEY = 'proofclean_user';
export const AUTH_TOKEN_KEY = 'proofclean_token';
export const MOCK_USER = { id: 'demo-user', email: 'demo@proofclean.com', name: 'Demo User' };
const USERS_KEY = 'proofclean_mock_users';

function persistSession(user) {
  const token = user.email === MOCK_USER.email ? 'mock-token-demo-user' : `mock-token-${user.id}`;
  setItem(AUTH_USER_KEY, user);
  setItem(AUTH_TOKEN_KEY, token);
  return { user, token };
}

export async function login(email, password) {
  if (email === MOCK_USER.email && password === 'password1234') return persistSession(MOCK_USER);
  const users = getItem(USERS_KEY, []);
  const user = users.find((item) => item.email === email && item.password === password);
  if (!user) throw new Error('이메일 또는 비밀번호를 확인하세요. 데모 계정도 사용할 수 있습니다.');
  return persistSession({ id: user.id, email: user.email, name: user.name });
}

export async function register(name, email, password) {
  const users = getItem(USERS_KEY, []);
  if (users.some((user) => user.email === email) || email === MOCK_USER.email) throw new Error('이미 가입된 이메일입니다.');
  const user = { id: crypto.randomUUID?.() || `user-${Date.now()}`, name, email, password };
  setItem(USERS_KEY, [...users, user]);
  return persistSession({ id: user.id, email: user.email, name: user.name });
}

export async function demoLogin() {
  return persistSession(MOCK_USER);
}

export function logout() {
  removeItem(AUTH_USER_KEY);
  removeItem(AUTH_TOKEN_KEY);
}
