import { useForm } from '../hook/useForm';
import { useProjects } from '../hook/useProjects';
import { Alert } from './Alert';

const initState = {
  name: '',
  description: '',
  deliveryDate: '',
  client: '',
};

export const ProjectForm = () => {
  const { alerta, setAlert, submitProject } = useProjects();
  const [formValues, handleInputChange, reset] = useForm(initState);

  const { name, description, deliveryDate, client } = formValues;
  const { msg } = alerta;

  const handleSubmit = async e => {
    e.preventDefault();
    if (Object.values(formValues).some(field => !field))
      return setAlert({
        msg: 'Todos los campos son obligatorios',
        error: true,
      });

    // Add new project
    await submitProject({ name, description, deliveryDate, client });

    reset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow"
    >
      {msg && <Alert alerta={alerta} />}

      <div className="mb-5">
        <label
          htmlFor="name"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Nombre Proyecto
        </label>
        <input
          id="name"
          type="text"
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Nombre del Proyecto"
          name="name"
          value={name}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="description"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Descripción
        </label>
        <textarea
          id="description"
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Descripción del Proyecto"
          name="description"
          value={description}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="deliveryDate"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Fecha Entrega
        </label>
        <input
          id="deliveryDate"
          type="date"
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          name="deliveryDate"
          value={deliveryDate}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="client"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Nombre Cliente
        </label>
        <input
          id="client"
          type="text"
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Nombre del Cliente"
          name="client"
          value={client}
          onChange={handleInputChange}
        />
      </div>

      <input
        type="submit"
        // value={id ? 'Actualizar Proyecto' : 'Crear Proyecto'}
        value="Enviar"
        className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors"
      />
      <input
        type="button"
        value="Reset Form"
        className="bg-red-500 w-full mt-4 p-3 text-white uppercase font-bold hover:bg-red-700 cursor-pointer transition-colors"
        // onClick={handleResetForm}
        onClick={() => reset()}
      />
    </form>
  );
};
