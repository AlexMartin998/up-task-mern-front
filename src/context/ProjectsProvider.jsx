import { createContext, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getJwtFromLS } from '../helper/validateJwt';
import { fetchWithToken } from '../helper/fetch';

export const ProjectContext = createContext();

export const ProjectsProvider = ({ children }) => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [alerta, setAlerta] = useState({});
  const [project, setProject] = useState({});
  const [projectLoading, setProjectLoading] = useState(false);

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

  const getProject = async id => {
    // setProjectLoading(true);

    try {
      const tokenJWT = getJwtFromLS();
      if (!tokenJWT) return;

      const { data } = await fetchWithToken(`/project/${id}`, 'GET', tokenJWT);
      setProject(data.project);
      console.log(data.project); // delete
    } catch (error) {
      console.log(error);
    } finally {
      setProjectLoading(false);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        alerta,
        project,
        projectLoading,
        setAlert,
        submitProject,
        getProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
