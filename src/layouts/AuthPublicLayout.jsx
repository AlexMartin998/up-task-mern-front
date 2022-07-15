import { Outlet } from 'react-router-dom';

const AuthPublicLayout = () => {
  return (
    <div>
      <h1>Layout</h1>
      <Outlet />
    </div>
  );
};

export default AuthPublicLayout;
