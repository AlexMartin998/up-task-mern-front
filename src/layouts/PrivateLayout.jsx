import { Outlet } from 'react-router-dom';

import { Header, Sidebar } from '../components';

const PrivateLayout = () => {
  return (
    <div className="bg-gray-100">
      <Header />

      <div className="md:flex md:min-h-screen">
        <Sidebar />
        <main className="p-10 flex-1 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PrivateLayout;
