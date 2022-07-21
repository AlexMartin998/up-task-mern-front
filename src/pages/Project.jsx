import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

import { useProjects } from '../hook/useProjects';
import { ModalTaskForm } from '../components/ModalTaskForm';
import {
  Alert,
  Collaborator,
  ModalDeleteCollaborator,
  ModalDeleteTask,
  Task,
} from '../components';
import { useAdmin } from '../hook/useAdmin';

let socket;

export const Project = () => {
  const { id } = useParams();
  const { project, getProject, toggleTaskModal, alerta, addAddedTaskState } =
    useProjects();
  const isAdmin = useAdmin();

  const { msg } = alerta;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await getProject(id);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);

    socket.emit('client:openProject', id);

    // return () => {
    //   socket.off('client:openProject');
    // };
  }, []);

  useEffect(() => {
    socket.on('server:addedTask', addedTask => {
      // Identificar a q project quiere actualizar las tasks en el state
      addedTask.project === project._id && addAddedTaskState(addedTask);
    });

    return () => {
      socket.off('server:addedTask');
    };
  });

  return (
    <>
      {project._id && !loading ? (
        <>
          <div className="flex justify-between">
            <h1 className="font-black text-4xl">{project.name}</h1>

            {isAdmin && (
              <div className="flex items-center gap-2 text-gray-400 hover:text-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>

                <Link
                  to={`/projects/edit/${project._id}`}
                  className="uppercase font-bold"
                >
                  Editar
                </Link>
              </div>
            )}
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={toggleTaskModal}
              className="text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-9 flex gap-2 items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              Nueva Tarea
            </button>
          )}

          <p className="font-bold text-xl mt-10">Tareas del Proyecto</p>

          <div className="flex justify-center mt-5 mb-2">
            {msg && (
              <div className="w-full md:w-1/3 lg:w-1/4">
                <Alert alerta={alerta} />
              </div>
            )}
          </div>

          <div className="bg-white shadow mt-10 rounded-lg">
            {project.tasks?.length ? (
              project.tasks.map(task => <Task key={task._id} task={task} />)
            ) : (
              <p className="text-center my-5 p-10">
                No hay tareas en este proyecto
              </p>
            )}
          </div>

          {isAdmin && (
            <>
              <div className="flex items-center justify-between mt-10">
                <p className="font-bold text-xl">Colaboradores</p>

                <Link
                  to={`/projects/new-collaborator/${project._id}`}
                  className="text-gray-400 hover:text-black uppercase font-bold"
                >
                  Añadir
                </Link>
              </div>

              <div className="bg-white shadow mt-10 rounded-lg">
                {project.collaborators?.length ? (
                  project.collaborators.map(partner => (
                    <Collaborator key={partner.uid} collaborator={partner} />
                  ))
                ) : (
                  <p className="text-center my-5 p-10">
                    Este proyecto no tiene Colaboradores
                  </p>
                )}
              </div>
            </>
          )}

          <ModalTaskForm />
          <ModalDeleteTask />
          <ModalDeleteCollaborator />
        </>
      ) : (
        <div className="flex justify-center mt-5 mb-2">
          {msg && (
            <div className="w-full md:w-full lg:w-1/2">
              <Alert alerta={alerta} />
            </div>
          )}
        </div>
      )}
    </>
  );
};
