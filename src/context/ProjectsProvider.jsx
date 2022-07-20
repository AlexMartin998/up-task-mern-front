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
  const [modalTaskForm, setModalTaskForm] = useState(false);
  const [task, setTask] = useState({});
  const [modalDeleteTask, setModalDeleteTask] = useState(false);
  const [collaborator, setCollaborator] = useState({});

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
      }, 3000);
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
      console.log(error.response.data.errors);
      setAlert({
        msg: JSON.stringify(error.response.data.errors[0]),
        error: true,
      });
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

  const deleteProject = async id => {
    const tokenJWT = getJwtFromLS();
    if (!tokenJWT) return;

    try {
      const { data } = await fetchWithToken(
        `/project/${id}`,
        'DELETE',
        tokenJWT
      );
      setAlerta({ msg: data.msg, error: false });

      setTimeout(() => {
        setAlert({});
        navigate('/projects', { replace: true });
      }, 2100);

      const updatedProjects = projects.filter(
        projectState => projectState._id !== id
      );
      setProjects(updatedProjects);
    } catch (error) {
      console.log(error);
    }
  };

  // Tasks
  const toggleTaskModal = () => {
    setModalTaskForm(!modalTaskForm);
    setTask({});
  };

  const submitTask = async task => {
    task.taskId ? await editTask(task) : await createTask(task);
  };

  const createTask = async task => {
    const tokenJWT = getJwtFromLS();
    if (!tokenJWT) return;

    try {
      const { data } = await fetchWithToken('/task', 'POST', tokenJWT, task);
      setAlert({ msg: data.msg, error: false });

      // Add task added to state
      const updatedProject = { ...project };
      updatedProject.tasks = [...project.tasks, data.task];

      setProject(updatedProject);
      setAlert({});
      setModalTaskForm(false);
    } catch (error) {
      console.log(error);
      setAlert({
        msg: JSON.stringify(error.response.data, null, 3),
        error: true,
      });
    }
  };

  const editTask = async task => {
    const tokenJWT = getJwtFromLS();
    if (!tokenJWT) return;

    try {
      const { data } = await fetchWithToken(
        `/task/${task.taskId}`,
        'PUT',
        tokenJWT,
        task
      );
      setAlert({ msg: data.msg, error: false });

      // Add task added to state
      const updatedProject = { ...project };
      updatedProject.tasks = project.tasks.map(taskState =>
        taskState._id === data.task._id ? data.task : taskState
      );
      setProject(updatedProject);

      setAlert({});
      setModalTaskForm(false);
    } catch (error) {
      console.log(error);
      setAlert({
        msg: JSON.stringify(error.response.data, null, 3),
        error: true,
      });
    }
  };

  const handleEditTask = task => {
    setTask(task);
    setModalTaskForm(true);
  };

  const handleModalDeleteTask = task => {
    setTask(task);
    setModalDeleteTask(!modalDeleteTask);
  };

  const deleteTask = async () => {
    const tokenJWT = getJwtFromLS();
    if (!tokenJWT) return;

    try {
      const { data } = await fetchWithToken(
        `/task/${task._id}`,
        'DELETE',
        tokenJWT,
        task
      );
      setAlert({ msg: data.msg, error: false });

      // Update state
      const updatedProject = { ...project };
      updatedProject.tasks = project.tasks.filter(
        taskState => taskState._id !== task._id
      );
      setProject(updatedProject);

      setModalDeleteTask(false);
      setTask({});
      setTimeout(() => {
        setAlert({});
      }, 2500);
    } catch (error) {
      console.log(error);
      setAlert({
        msg: JSON.stringify(error.response.data, null, 3),
        error: true,
      });
    }
  };

  // Collaborators
  const submitCollaborator = async email => {
    const tokenJWT = getJwtFromLS();
    if (!tokenJWT) return;

    try {
      const { data } = await fetchWithToken(
        '/project/collaborator',
        'POST',
        tokenJWT,
        { email }
      );
      setCollaborator(data.user);
      setAlert({});
    } catch (error) {
      setAlert({
        msg: error.response.data.msg,
        error: true,
      });
      setCollaborator({});
    }
  };

  const addCollaborator = async email => {
    const tokenJWT = getJwtFromLS();
    if (!tokenJWT) return;

    try {
      const { data } = await fetchWithToken(
        `/project/collaborator/${project._id}`,
        'POST',
        tokenJWT,
        { email }
      );
      setAlert({ msg: data.msg });
      setCollaborator({});
      setAlert({}); // ???? xq setAlert ya lo hace con un setTimeout
    } catch (error) {
      setAlert({
        msg:
          error.response.data.msg ||
          JSON.stringify(error.response.data.errors[0], null, 3),
        error: true,
      });
      setCollaborator({});
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        alerta,
        project,
        modalTaskForm,
        task,
        modalDeleteTask,
        collaborator,
        setAlert,
        submitProject,
        getProject,
        deleteProject,
        toggleTaskModal,
        submitTask,
        handleEditTask,
        handleModalDeleteTask,
        deleteTask,
        submitCollaborator,
        addCollaborator,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
