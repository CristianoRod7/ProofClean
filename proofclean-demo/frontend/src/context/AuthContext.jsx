import { createContext, useContext, useMemo, useState } from 'react';
import * as mockAuth from '../services/mockAuth.js';
import { getItem } from '../services/storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getItem(mockAuth.AUTH_USER_KEY, null));
  const [token, setToken] = useState(() => getItem(mockAuth.AUTH_TOKEN_KEY, null));

  const applySession = ({ user: nextUser, token: nextToken }) => {
    setUser(nextUser);
    setToken(nextToken);
    return { user: nextUser, token: nextToken };
  };

  const login = async ({ email, password }) => applySession(await mockAuth.login(email, password));
  const register = async ({ name, email, password }) => applySession(await mockAuth.register(name, email, password));
  const demoLogin = async () => applySession(await mockAuth.demoLogin());
  const logout = () => { mockAuth.logout(); setUser(null); setToken(null); };

  const value = useMemo(() => ({ user, token, login, register, demoLogin, logout, isAuthenticated: Boolean(user && token) }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
