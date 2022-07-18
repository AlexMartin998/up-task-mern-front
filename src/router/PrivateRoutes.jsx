import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../hook/useAuth';

export const PrivateRoutes = ({ children }) => {
  const { auth } = useAuth();
  const { pathname } = useLocation();

  localStorage.setItem('lastPath', pathname);

  return !auth?.uid ? <Navigate to="/" replace /> : children;
};
