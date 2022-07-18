import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useProjects } from '../hook/useProjects';
import { ProjectForm } from '../components';

export const EditProject = () => {
  const { id } = useParams();
  const { getProject, project } = useProjects();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await getProject(id);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h1 className="font-black text-4xl">Editar Proyecto: {project.name}</h1>

      <div className="mt-10">
        <ProjectForm />
      </div>
    </>
  );
};
