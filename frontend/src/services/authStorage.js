export const AUTH_TOKEN_KEY = 'proofclean_token';
export const AUTH_USER_KEY = 'proofclean_user';
export const REMEMBER_ME_KEY = 'proofclean_remember_me';

function parseUser(value) {
  if (!value) return null;
  try { return JSON.parse(value); } catch { return null; }
}

function parseToken(value) {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === 'string' ? parsed : value;
  } catch {
    return value;
  }
}

export function clearAuthStorage() {
  [AUTH_TOKEN_KEY, AUTH_USER_KEY, REMEMBER_ME_KEY].forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}

export function purgeLegacyLocalSession() {
  if (localStorage.getItem(REMEMBER_ME_KEY) === 'true') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(REMEMBER_ME_KEY);
}

export function getStoredSession() {
  purgeLegacyLocalSession();
  const remembered = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
  const storage = remembered ? localStorage : sessionStorage;
  const token = parseToken(storage.getItem(AUTH_TOKEN_KEY));
  const user = parseUser(storage.getItem(AUTH_USER_KEY));
  return { token, user, rememberMe: remembered };
}

export function getStoredToken() {
  return getStoredSession().token;
}

export function persistAuthSession({ user, token }, rememberMe = false) {
  clearAuthStorage();
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(AUTH_TOKEN_KEY, token);
  storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  storage.setItem(REMEMBER_ME_KEY, String(Boolean(rememberMe)));
  return { user, token, rememberMe: Boolean(rememberMe) };
}
