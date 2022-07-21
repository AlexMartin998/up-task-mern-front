import { useProjects } from '../hook/useProjects';
import { formatDate } from '../helper/formatDate';
import { useAdmin } from '../hook/useAdmin';

export const Task = ({ task }) => {
  const { handleEditTask, handleModalDeleteTask, completeTask } = useProjects();
  const { name, description, deliveryDate, priority, state, _id } = task;
  const isAdmin = useAdmin();

  return (
    <div className="border-b p-5 flex justify-between items-center">
      <div className="flex flex-col  items-start">
        <p className="mb-1 text-xl">{name}</p>
        <p className="mb-1 text-sm text-gray-500 uppercase">{description}</p>
        <p className="mb-1 text-sm">{formatDate(deliveryDate)}</p>
        <p className="mb-1 text-gray-600 ">Prioridad: {priority}</p>
        {state && (
          <p className="text-xs bg-green-600 uppercase p-1 rounded-lg text-white">
            Completada por: {task?.completedBy?.name}
          </p>
        )}
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

        <button
          className={`${
            state ? 'bg-sky-600' : 'bg-gray-600'
          } px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}
          onClick={() => completeTask(_id)}
        >
          {state ? 'Completa' : 'Incompleta'}
        </button>

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
