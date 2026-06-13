import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export default function RootRedirect() {
  const { authReady, isAuthenticated } = useAuth();
  if (!authReady) return null;
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}
