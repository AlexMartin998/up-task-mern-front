export const formatDate = date => {
  // TODO: Mejorar lo de la fecha xq NO toma la fecha del picker

  const newFormat = new Date(date.split('T')[0].split('-'));

  const opts = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return newFormat.toLocaleDateString('es-ES', opts);
};
