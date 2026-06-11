import { createContext, useContext, useMemo, useState } from 'react';
import * as mockAuth from '../services/mockAuth.js';
import { demoLoginApi, loginApi, registerApi } from '../services/authApi.js';
import { getItem, setItem } from '../services/storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getItem(mockAuth.AUTH_USER_KEY, null));
  const [token, setToken] = useState(() => getItem(mockAuth.AUTH_TOKEN_KEY, null));

  const applySession = ({ user: nextUser, token: nextToken }) => {
    setItem(mockAuth.AUTH_USER_KEY, nextUser);
    setItem(mockAuth.AUTH_TOKEN_KEY, nextToken);
    setUser(nextUser);
    setToken(nextToken);
    return { user: nextUser, token: nextToken };
  };

  const login = async ({ email, password }) => applySession(await loginApi({ email, password }));
  const register = async ({ name, email, password }) => applySession(await registerApi({ name, email, password }));
  const demoLogin = async () => applySession(await demoLoginApi());
  const logout = () => { mockAuth.logout(); setUser(null); setToken(null); };

  const value = useMemo(() => ({ user, token, login, register, demoLogin, logout, isAuthenticated: Boolean(user && token) }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
