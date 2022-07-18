import { createContext, useCallback, useEffect, useState } from 'react';

import { getJwtFromLS } from '../helper/validateJwt';
import { fetchWithToken } from '../helper/fetch';

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
        const { data } = await fetchWithToken('/user/profile', 'GET', tokenJWT);

        setAuth(data.user);
      } catch (error) {
        console.log(error.response.data);
        // logOut();
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

  return (
    <AuthContext.Provider value={{ auth, authLoading, setAuthCb }}>
      {children}
    </AuthContext.Provider>
  );
};
