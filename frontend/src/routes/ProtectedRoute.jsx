import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export default function ProtectedRoute() {
  const { authReady, isAuthenticated } = useAuth();
  const location = useLocation();
  if (!authReady) return null;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
