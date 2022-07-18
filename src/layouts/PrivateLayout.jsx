import { Outlet } from 'react-router-dom';

const PrivateLayout = () => {
  return (
    <main className="container mx-auto mt-10">
      <Outlet />
    </main>
  );
};

export default PrivateLayout;
