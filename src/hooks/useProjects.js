'use strict';

import { useContext } from 'react';

import { ProjectContext } from '../context/ProjectsProvider';

export const useProjects = () => useContext(ProjectContext);
