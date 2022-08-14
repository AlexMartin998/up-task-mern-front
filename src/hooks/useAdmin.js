'use strict';

import { useAuth } from './useAuth';
import { useProjects } from './useProjects';

export const useAdmin = () => {
  const { project } = useProjects();
  const { auth } = useAuth();

  return project?.owner?.uid === auth?.uid;
};
