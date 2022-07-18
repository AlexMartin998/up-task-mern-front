import { ProjectPreview } from '../components';
import { useProjects } from '../hook/useProjects';

export const Projects = () => {
  const { projects } = useProjects();

  return (
    <>
      <h1 className="text-4xl font-black">Proyectos</h1>

      <div className="bg-white shadow mt-10 rounded-lg">
        {projects.length ? (
          projects.map(project => (
            <ProjectPreview key={project._id} project={project} />
          ))
        ) : (
          <p className="text-center text-gray-600 uppercase p-5">
            Aún no tienes proyectos
          </p>
        )}
      </div>
    </>
  );
};
