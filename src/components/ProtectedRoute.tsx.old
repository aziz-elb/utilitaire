import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Chargement...</div>; // Ou un spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};