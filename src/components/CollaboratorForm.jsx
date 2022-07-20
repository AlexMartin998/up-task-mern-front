import { useForm } from '../hook/useForm';
import { useProjects } from '../hook/useProjects';
import { Alert } from './Alert';

export const CollaboratorForm = () => {
  const { alerta, setAlert, submitCollaborator, project } = useProjects();
  const [formValues, handleInputChange, reset] = useForm({ email: '' });
  const { email } = formValues;
  const { msg } = alerta;

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email)
      return setAlert({ msg: 'El email es Obligatorio', error: true });

    if (email === project.owner.email)
      return setAlert({
        msg: 'El Creador del Proyecto no puede ser un Colaborador!',
        error: true,
      });

    await submitCollaborator(email);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow"
    >
      {msg && <Alert alerta={alerta} />}

      <div className="mb-5">
        <label
          htmlFor="email"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Email Colaborador
        </label>
        <input
          name="email"
          id="email"
          type="email"
          placeholder="Email del Usuario"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          value={email}
          onChange={handleInputChange}
        />
      </div>

      <input
        type="submit"
        className="bg-sky-600 hover:bg-sky-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded text-sm"
        value="Buscar Colaborador"
      />
    </form>
  );
};
