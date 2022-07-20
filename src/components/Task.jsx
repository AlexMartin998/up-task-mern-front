import { useProjects } from '../hook/useProjects';
import { formatDate } from '../helper/formatDate';
import { useAdmin } from '../hook/useAdmin';

export const Task = ({ task }) => {
  const { handleEditTask, handleModalDeleteTask } = useProjects();
  const { name, description, deliveryDate, priority, state } = task;
  const isAdmin = useAdmin();

  return (
    <div className="border-b p-5 flex justify-between items-center">
      <div>
        <p className="mb-1 text-xl">{name}</p>
        <p className="mb-1 text-sm text-gray-500 uppercase">{description}</p>
        <p className="mb-1 text-sm">{formatDate(deliveryDate)}</p>
        <p className="mb-1 text-gray-600 ">Prioridad: {priority}</p>
      </div>

      <div className="flex gap-2">
        {isAdmin && (
          <button
            onClick={() => handleEditTask(task)}
            className="bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
          >
            Editar
          </button>
        )}

        {state ? (
          <button className="bg-sky-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg">
            Completa
          </button>
        ) : (
          <button className="bg-gray-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg">
            Incompleta
          </button>
        )}

        {isAdmin && (
          <button
            onClick={() => handleModalDeleteTask(task)}
            className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
};
