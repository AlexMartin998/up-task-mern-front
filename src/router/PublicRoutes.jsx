import { Navigate } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';

export const PublicRoutes = ({ children }) => {
  const { auth } = useAuth();

  const lastPath = localStorage.getItem('lastPath') || '/projects';

  return !auth?.uid ? children : <Navigate to={`${lastPath}`} replace />;
};
