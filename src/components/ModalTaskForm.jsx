import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useParams } from 'react-router-dom';

import { useProjects } from '../hook/useProjects';
import { useForm } from '../hook/useForm';
import { Alert } from './Alert';

const initState = { name: '', description: '', priority: '', deliveryDate: '' };
const PRIORITY = ['Baja', 'Media', 'Alta'];

export const ModalTaskForm = () => {
  const { id } = useParams();
  const { modalTaskForm, toggleTaskModal, alerta, setAlert, submitTask, task } =
    useProjects();
  const [formValues, handleInputChange, reset, setFormValues] =
    useForm(initState);
  const { name, description, priority, deliveryDate } = formValues;
  const { msg } = alerta;

  const [taskId, setTaskId] = useState('');

  useEffect(() => {
    if (task?._id) {
      setFormValues({
        ...task,
        deliveryDate: task?.deliveryDate?.split('T')[0],
      });
      return setTaskId(task?._id);
    }

    setTaskId('');
    reset();
  }, [task]);

  const handleSubmit = e => {
    e.preventDefault();
    if ([name, description, priority, deliveryDate].includes(''))
      return setAlert({ msg: 'Todos los campos son requeridos', error: true });

    submitTask({
      name,
      description,
      priority,
      deliveryDate,
      project: id,
      taskId,
    });

    reset();
  };

  return (
    <Transition.Root show={modalTaskForm} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={toggleTaskModal}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={toggleTaskModal}
                >
                  <span className="sr-only">Cerrar</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-bold text-gray-900 mb-6"
                  >
                    {task?._id ? 'Editar Tarea' : 'Crear Tarea'}
                  </Dialog.Title>

                  {msg && <Alert alerta={alerta} />}

                  <form onSubmit={handleSubmit} className="my-10">
                    <div className="mb-5">
                      <label
                        htmlFor="name"
                        className="text-gray-700 uppercase font-bold text-sm"
                      >
                        Nombre Tarea
                      </label>
                      <input
                        name="name"
                        id="name"
                        type="text"
                        placeholder="Nombre de la Tarea"
                        className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                        value={name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-5">
                      <label
                        htmlFor="description"
                        className="text-gray-700 uppercase font-bold text-sm"
                      >
                        Descripción Tarea
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        placeholder="Descripción de la Tarea"
                        className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                        value={description}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-5">
                      <label
                        htmlFor="deliveryDate"
                        className="text-gray-700 uppercase font-bold text-sm"
                      >
                        Fecha de Entrega
                      </label>
                      <input
                        name="deliveryDate"
                        id="deliveryDate"
                        type="date"
                        className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                        value={deliveryDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-5">
                      <label
                        htmlFor="priority"
                        className="text-gray-700 uppercase font-bold text-sm"
                      >
                        Prioridad
                      </label>
                      <select
                        name="priority"
                        id="priority"
                        className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                        value={priority}
                        onChange={handleInputChange}
                      >
                        <option value="">-- Seleccionar --</option>
                        {PRIORITY.map(opt => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <input
                      type="submit"
                      className="bg-sky-600 hover:bg-sky-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded text-sm"
                      value={task?._id ? 'Guardar Cambios' : 'Crear Tarea'}
                    />
                  </form>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
