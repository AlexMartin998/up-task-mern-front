import { createContext, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getJwtFromLS } from '../helper/validateJwt';
import { fetchWithToken } from '../helper/fetch';

export const ProjectContext = createContext();

export const ProjectsProvider = ({ children }) => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState({});
  const [alerta, setAlerta] = useState({});

  useEffect(() => {
    (async () => {
      const tokenJWT = getJwtFromLS();
      if (!tokenJWT) return;

      const { data } = await fetchWithToken('/project', 'GET', tokenJWT);
      setProjects(data.projects);
    })();
  }, []);

  const setAlert = useCallback(
    alert => {
      setAlerta(alert);

      setTimeout(() => {
        setAlerta({});
      }, 2000);
    },
    [setAlerta]
  );

  const submitProject = async project => {
    project.id ? await updateProject(project) : await newProject(project);
  };

  const getProject = async id => {
    try {
      const tokenJWT = getJwtFromLS();
      if (!tokenJWT) return;

      const { data } = await fetchWithToken(`/project/${id}`, 'GET', tokenJWT);
      setProject(data.project);
    } catch (error) {
      console.log(error);
    }
  };

  const newProject = async project => {
    const tokenJWT = getJwtFromLS();
    if (!tokenJWT) return;

    try {
      const { data } = await fetchWithToken(
        '/project',
        'POST',
        tokenJWT,
        project
      );
      setProjects([...projects, data.project]);

      setAlerta({ msg: data.msg, error: false });

      setTimeout(() => {
        setAlert({});
        navigate('/projects', { replace: true });
      }, 2100);
    } catch (error) {
      console.log(error);
    }
  };

  const updateProject = async project => {
    const tokenJWT = getJwtFromLS();
    if (!tokenJWT) return;

    try {
      const { data } = await fetchWithToken(
        `/project/${project.id}`,
        'PUT',
        tokenJWT,
        project
      );
      const updatedProjects = projects.map(projectState =>
        projectState._id === data.project._id ? data.project : projectState
      );
      setProjects(updatedProjects);

      setAlerta({ msg: data.msg, error: false });

      setTimeout(() => {
        setAlert({});
        navigate('/projects', { replace: true });
      }, 2100);
    } catch (error) {
      console.log(error);
    }
  };

  // TODO: Verificar q sirva pa algo
  const setProjectCb = useCallback(
    project => {
      setProject(project);
    },
    [setProject]
  );

  return (
    <ProjectContext.Provider
      value={{
        projects,
        alerta,
        project,
        setAlert,
        submitProject,
        getProject,
        setProjectCb,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
