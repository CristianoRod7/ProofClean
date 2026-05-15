import { createContext, useContext, useMemo, useState } from 'react';
import { login as loginApi, register as registerApi } from '../services/authApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('proofclean_token'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('proofclean_user') || 'null'));

  const persist = (data) => {
    setToken(data.token); setUser(data.user);
    localStorage.setItem('proofclean_token', data.token);
    localStorage.setItem('proofclean_user', JSON.stringify(data.user));
  };
  const login = async (payload) => persist(await loginApi(payload));
  const register = async (payload) => persist(await registerApi(payload));
  const logout = () => { setToken(null); setUser(null); localStorage.removeItem('proofclean_token'); localStorage.removeItem('proofclean_user'); };
  const value = useMemo(() => ({ token, user, login, register, logout, isAuthenticated: Boolean(token) }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuthContext = () => useContext(AuthContext);
