import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProjects } from '../hook/useProjects';

export const Project = () => {
  const { id } = useParams();
  const { getProject, project, projectLoading } = useProjects();

  useState(() => {
    getProject(id);
  }, []);

  return (
    <div>
      {!projectLoading && (
        <h1 className="font-black text-4xl">{project.name}</h1>
      )}
      {/* {projectLoading ? (
        <p>Loading...</p>
      ) : (
        <h1 className="font-black text-4xl">{project.name}</h1>
      )} */}
    </div>
  );
};
