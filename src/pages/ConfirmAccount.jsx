import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import { Alert } from '../components/Alert';
import { fetchWithoutToken } from '../helper/fetch';

export const ConfirmAccount = () => {
  const { token } = useParams();

  const [confirmedAccount, setConfirmedAccount] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alerta, setAlerta] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetchWithoutToken(`/user/confirm/${token}`);

        setConfirmedAccount(true);
        setAlerta({
          msg: data.msg,
          error: false,
        });
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true,
        });
      }

      setLoading(false);
    })();
  }, []);

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Confirma tu cuenta y Comienza a crear tus {''}
        <span className="text-slate-700">proyectos</span>
      </h1>

      <div className="mt-20 md:mt-5 shadow-lg px-7 py-10 rounded-xl bg-white">
        {loading && (
          <p className="block text-center my-5 font-bold text-2xl text-gray-900">
            Loading...
          </p>
        )}

        {!loading && <Alert alerta={alerta} />}

        {confirmedAccount && (
          <Link to="/" className="block text-center my-5 text-gray-500">
            Log In
          </Link>
        )}
      </div>
    </>
  );
};
