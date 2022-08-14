import { createContext, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

import { getJwtFromLS } from '../helpers/checkJWTInLS';
import { fetchWithToken } from '../helpers/fetch';

export const ProjectContext = createContext();

let socket;

export const ProjectsProvider = ({ children }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState({});
  const [alerta, setAlerta] = useState({});
  const [formAlerta, setFormAlerta] = useState({});
  const [modalTaskForm, setModalTaskForm] = useState(false);
  const [task, setTask] = useState({});
  const [modalDeleteTask, setModalDeleteTask] = useState(false);
  const [collaborator, setCollaborator] = useState({});
  const [modalDeleteCollaborator, setModalDeleteCollaborator] = useState(false);
  const [projectSearcher, setProjectSearcher] = useState(false);

  useEffect(() => {
    (async () => {
      const tokenJWT = getJwtFromLS();
      if (!tokenJWT) return;

      const { data } = await fetchWithToken('/projects', 'GET', tokenJWT);
      setProjects(data.projects);
    })();
  }, []);

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
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

  const setFormAlert = useCallback(
    alert => {
      setFormAlerta(alert);

      setTimeout(() => {
        setFormAlerta({});
      }, 2400);
    },
    [setFormAlerta]
  );

  const submitProject = async project => {
    project.id ? await updateProject(project) : await newProject(project);
  };

  const newProject = async project => {
    const tokenJWT = getJwtFromLS();
    if (!tokenJWT) return;

    try {
      const { data } = await fetchWithToken(
        '/projects',
        'POST',
        tokenJWT,
        project
      );
      setProjects([...projects, data.project]);

      setFormAlert({ msg: data.msg, error: false });

      setTimeout(() => {
        navigate('/projects', { replace: true });
      }, 2100);
    } catch (error) {
      console.log(error);
    }
  };

  const getProject = async id => {
    try {
      const tokenJWT = getJwtFromLS();
      if (!tokenJWT) return;

      const { data } = await fetchWithToken(`/projects/${id}`, 'GET', tokenJWT);
      setProject(data.project);
    } catch (error) {
      console.log(error.response.data.errors[0]);
      setAlert({
        msg: JSON.stringify(error.response.data.errors[0]),
        error: true,
      });

      setTimeout(() => {
        navigate('/projects', { replace: true });
      }, 2000);
    }
  };

  const updateProject = async project => {
    const tokenJWT = getJwtFromLS();
    if (!tokenJWT) return;

    try {
      const { data } = await fetchWithToken(
        `/projects/${project.id}`,
        'PUT',
        tokenJWT,
        project
      );
      const updatedProjects = projects.map(projectState =>
        projectState._id === data.project._id ? data.project : projectState
      );
      setProjects(updatedProjects);

      setFormAlert({ msg: data.msg, error: false });

      setTimeout(() => {
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
        `/projects/${id}`,
        'DELETE',
        tokenJWT
      );
      setAlert({ msg: data.msg, error: false });

      navigate('/projects', { replace: true });

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
      const { data } = await fetchWithToken('/tasks', 'POST', tokenJWT, task);
      setFormAlert({ msg: data.msg, error: false });

      // Socket.io: Send created task
      socket.emit('client:createTask', data.task);
    } catch (error) {
      console.log(error);
      setFormAlert({
        msg: JSON.stringify(error.response.data, null, 3),
        error: true,
      });
    }

    setTimeout(() => {
      setModalTaskForm(false);
    }, 2400);
  };

  const editTask = async task => {
    const tokenJWT = getJwtFromLS();
    if (!tokenJWT) return;

    try {
      const { data } = await fetchWithToken(
        `/tasks/${task.taskId}`,
        'PUT',
        tokenJWT,
        task
      );
      setFormAlert({ msg: data.msg, error: false });

      // Socket.io: edit event
      socket.emit('client:editTask', data.task);
    } catch (error) {
      console.log(error);
      setFormAlert({
        msg: JSON.stringify(error.response.data, null, 3),
        error: true,
      });
    }

    setTimeout(() => {
      setModalTaskForm(false);
    }, 2400);
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
        `/tasks/${task._id}`,
        'DELETE',
        tokenJWT,
        task
      );
      setAlert({ msg: data.msg, error: false });

      // Socket.io: Delete event
      socket.emit('client:deleteTask', task);
    } catch (error) {
      console.log(error);
      setAlert({
        msg: JSON.stringify(error.response.data, null, 3),
        error: true,
      });
    }

    setModalDeleteTask(false);
    setTask({});
  };

  // Collaborators
  const getUser = async email => {
    const tokenJWT = getJwtFromLS();
    if (!tokenJWT) return;

    try {
      const { data } = await fetchWithToken('/users', 'POST', tokenJWT, {
        email,
      });

      setCollaborator(data.user);
      setAlert({});
    } catch (error) {
      setAlert({
        msg: error.response.data.errors[0].msg,
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
        `/projects/collaborator/${project._id}`,
        'POST',
        tokenJWT,
        { email }
      );
      setAlert({ msg: data.msg });
      setTimeout(() => {
        navigate(`/projects/${project._id}`, { replace: true });
      }, 2100);
    } catch (error) {
      setAlert({
        msg:
          error.response.data.msg ||
          JSON.stringify(error.response.data.errors[0], null, 3),
        error: true,
      });
    } finally {
      setCollaborator({});
    }
  };

  const handleModalDeletePartner = collaborator => {
    setModalDeleteCollaborator(!modalDeleteCollaborator);
    setCollaborator(collaborator);
  };

  const deleteCollaborator = async () => {
    const tokenJWT = getJwtFromLS();
    if (!tokenJWT) return;

    try {
      const { data } = await fetchWithToken(
        `/projects/collaborator/${project._id}`,
        'PUT',
        tokenJWT,
        { partnerId: collaborator.uid }
      );
      setAlert({ msg: data.msg });

      // Update state
      const updatedProject = { ...project };
      updatedProject.collaborators = updatedProject.collaborators.filter(
        partnerState => partnerState.uid !== collaborator.uid
      );
      setProject(updatedProject);
    } catch (error) {
      setAlert({
        msg:
          error.response.data.msg ||
          JSON.stringify(error.response.data.errors[0], null, 3),
        error: true,
      });
    } finally {
      setCollaborator({});
      setModalDeleteCollaborator(false);
    }
  };

  const completeTask = async id => {
    const tokenJWT = getJwtFromLS();
    if (!tokenJWT) return;

    try {
      const { data } = await fetchWithToken(
        `/tasks/state/${id}`,
        'PATCH',
        tokenJWT
      );

      // Socket.io: toggle task state event
      socket.emit('client:toggleTaskState', data.task);
    } catch (error) {
      setAlert({
        msg:
          error.response.data.msg ||
          JSON.stringify(error.response.data.errors[0], null, 3),
        error: true,
      });
    }

    setTask({});
    setAlert({});
  };

  // Project sercher
  const handleSearcher = () => {
    setProjectSearcher(!projectSearcher);
  };

  // Socket.io
  const addAddedTaskState = addedTask => {
    const tokenJWT = getJwtFromLS();
    if (!tokenJWT) return;

    // Add added task to state
    const updatedProject = { ...project };
    updatedProject.tasks = [...updatedProject.tasks, addedTask];
    setProject(updatedProject);
  };

  const removeDeletedTaskState = deletedTask => {
    const tokenJWT = getJwtFromLS();
    if (!tokenJWT) return;

    // Update state
    const updatedProject = { ...project };
    updatedProject.tasks = project.tasks.filter(
      taskState => taskState._id !== deletedTask._id
    );
    setProject(updatedProject);
  };

  const updateTaskState = updatedTask => {
    const tokenJWT = getJwtFromLS();
    if (!tokenJWT) return;

    // Update state
    const updatedProject = { ...project };
    updatedProject.tasks = project.tasks.map(taskState =>
      taskState._id === updatedTask._id ? updatedTask : taskState
    );
    setProject(updatedProject);
  };

  const updateTaskStatus = updatedTaskState => {
    const tokenJWT = getJwtFromLS();
    if (!tokenJWT) return;

    // Update state
    const updatedProject = { ...project };
    updatedProject.tasks = project.tasks.map(taskState =>
      taskState._id === updatedTaskState._id ? updatedTaskState : taskState
    );

    setProject(updatedProject);
  };

  // Logout
  const logoutProjects = () => {
    setProjects([]);
    setProject({});
    setAlert({});
    setTask({});
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        alerta,
        project,
        modalTaskForm,
        task,
        formAlerta,
        modalDeleteTask,
        collaborator,
        modalDeleteCollaborator,
        projectSearcher,
        setAlert,
        setFormAlert,
        submitProject,
        getProject,
        deleteProject,
        toggleTaskModal,
        submitTask,
        handleEditTask,
        handleModalDeleteTask,
        deleteTask,
        getUser,
        addCollaborator,
        handleModalDeletePartner,
        deleteCollaborator,
        completeTask,
        handleSearcher,
        addAddedTaskState,
        removeDeletedTaskState,
        updateTaskState,
        updateTaskStatus,
        logoutProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
