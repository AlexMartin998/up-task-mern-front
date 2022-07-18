import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { useAuth } from '../hook/useAuth';
import AuthPublicLayout from '../layouts/AuthPublicLayout';
import PrivateLayout from './../layouts/PrivateLayout';

import {
  ConfirmAccount,
  Login,
  NewPassword,
  NewProject,
  PasswordRecovery,
  Project,
  Projects,
  Register,
} from '../pages';
import { PrivateRoutes } from './PrivateRoutes';
import { PublicRoutes } from './PublicRoutes';
import { ProjectsProvider } from '../context/ProjectsProvider';

export const AppRouter = () => {
  const { authLoading } = useAuth();
  if (authLoading) return;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoutes>
              <AuthPublicLayout />
            </PublicRoutes>
          }
        >
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="confirm-account/:token" element={<ConfirmAccount />} />
          <Route path="forgot-password" element={<PasswordRecovery />} />
          <Route path="forgot-password/:token" element={<NewPassword />} />
        </Route>

        <Route
          path="/projects"
          element={
            <PrivateRoutes>
              <ProjectsProvider>
                <PrivateLayout />
              </ProjectsProvider>
            </PrivateRoutes>
          }
        >
          <Route index element={<Projects />} />
          <Route path="new" element={<NewProject />} />
          <Route path=":id" element={<Project />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
