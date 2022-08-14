import { createContext, useCallback, useEffect, useState } from 'react';

import { getJwtFromLS } from '../helpers/checkJWTInLS';
import { fetchWithToken } from '../helpers/fetch';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const tokenJWT = getJwtFromLS();
      if (!tokenJWT) return setAuthLoading(false);

      try {
        // Check token
        const { data } = await fetchWithToken(
          '/users/profile',
          'GET',
          tokenJWT
        );

        setAuth(data.user);
      } catch (error) {
        setAuth({});
        console.log(error.response.data);
        logOut();
      }

      // Private Routes
      setAuthLoading(false);
    })();
  }, []);

  const setAuthCb = useCallback(
    user => {
      const tokenJWT = getJwtFromLS();
      if (!tokenJWT) return;

      setAuth(user);
    },
    [setAuth]
  );

  const logOut = () => {
    setAuth({});
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ auth, authLoading, setAuthCb, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
