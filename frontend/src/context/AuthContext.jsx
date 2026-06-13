import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { demoLoginApi, getCurrentUserApi, loginApi, registerApi } from '../services/authApi.js';
import { clearAuthStorage, getStoredSession, persistAuthSession } from '../services/authStorage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let active = true;
    const restoreSession = async () => {
      const stored = getStoredSession();
      if (!stored.token) {
        clearAuthStorage();
        if (active) setAuthReady(true);
        return;
      }
      try {
        const verifiedUser = await getCurrentUserApi(stored.token, stored.user);
        if (!active) return;
        persistAuthSession({ user: verifiedUser, token: stored.token }, stored.rememberMe);
        setUser(verifiedUser);
        setToken(stored.token);
      } catch {
        clearAuthStorage();
        if (active) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (active) setAuthReady(true);
      }
    };
    restoreSession();
    return () => { active = false; };
  }, []);

  const applySession = ({ user: nextUser, token: nextToken }, rememberMe = false) => {
    persistAuthSession({ user: nextUser, token: nextToken }, rememberMe);
    setUser(nextUser);
    setToken(nextToken);
    return { user: nextUser, token: nextToken };
  };

  const login = async ({ email, password, rememberMe = false }) => applySession(await loginApi({ email, password }), rememberMe);
  const register = async ({ name, email, password, rememberMe = false }) => applySession(await registerApi({ name, email, password }), rememberMe);
  const demoLogin = async ({ rememberMe = false } = {}) => applySession(await demoLoginApi(), rememberMe);
  const logout = () => {
    clearAuthStorage();
    setUser(null);
    setToken(null);
    if (window.location.pathname !== '/login') window.location.assign('/login');
  };

  const value = useMemo(() => ({
    user,
    token,
    authReady,
    login,
    register,
    demoLogin,
    logout,
    isAuthenticated: authReady && Boolean(user && token),
  }), [user, token, authReady]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
