import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export default function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
