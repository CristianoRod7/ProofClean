import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export default function PublicOnlyRoute() {
  const { authReady, isAuthenticated } = useAuth();
  if (!authReady) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
