import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Alert, CollaboratorForm } from '../components';
import { useProjects } from '../hooks';


export const NewCollaborator = () => {
  const { id } = useParams();
  const { project, getProject, collaborator, addCollaborator, alerta } =
    useProjects();

  const [loading, setLoading] = useState(true);
  const { msg } = alerta;

  useEffect(() => {
    (async () => {
      await getProject(id);
      setLoading(false);
    })();
  }, []);

  if (!project._id)
    return (
      <div className="flex justify-center mt-10">
        <div className="md:w-1/2 w-full">
          {msg && <Alert alerta={alerta} />}
        </div>
      </div>
    );

  return (
    <>
      <h1 className="text-4xl font-black">
        Añadir Colaborador(a) al Proyecto: {project.name}
      </h1>

      <div className="mt-10 flex justify-center">
        <CollaboratorForm />
      </div>

      <div className="flex justify-center mt-10">
        {loading
          ? 'loading...'
          : collaborator?.uid && (
              <div className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow w-full">
                <h2 className="text-center mb-10 text-2xl font-bold">
                  Resultado:
                </h2>

                <div className="flex justify-between items-center">
                  <p>{collaborator.name}</p>

                  <button
                    type="button"
                    onClick={() => addCollaborator(collaborator.email)}
                    className="bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm"
                  >
                    Agregar al Proyecto
                  </button>
                </div>
              </div>
            )}
      </div>
    </>
  );
};
