import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useAlert, useForm } from '../hooks';
import { fetchWithoutToken } from '../helpers/fetch';
import { Alert } from '../components';

export const NewPassword = () => {
  const { token } = useParams();
  const [formValues, handleInputChange, reset] = useForm({ newPassword: '' });
  const [alerta, setAlerta] = useAlert({});
  const [isValidToken, setIsValidToken] = useState(false);
  const [updatedPassword, setUpdatedPassword] = useState(false);

  const { newPassword } = formValues;
  const { msg } = alerta;

  useEffect(() => {
    (async () => {
      try {
        await fetchWithoutToken(`/users/password-recovery/${token}`);

        setAlerta({ msg: 'Coloca tu Nuevo Password', error: false });
        setIsValidToken(true);
      } catch (error) {
        setAlerta({ msg: error.response.data.msg, error: true });
      }
    })();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (newPassword.length < 6) {
      return setAlerta({
        msg: 'El Password debe ser mínimo de 6 caracteres',
        error: true,
      });
    }

    try {
      const { data } = await fetchWithoutToken(
        `/users/password-recovery/${token}`,
        { password: newPassword },
        'POST'
      );

      setAlerta({ msg: data.msg, error: false });
      setUpdatedPassword(true);
    } catch (error) {
      setAlerta({ msg: error.response.data.msg, error: true });
    }

    reset();
  };

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Reestablece tu password y no pierdas acceso a tus {''}
        <span className="text-slate-700">proyectos</span>
      </h1>

      <div className="mt-20 mb-10 bg-white shadow rounded-lg p-10">
        {msg && <Alert alerta={alerta} />}

        {isValidToken && !updatedPassword && (
          <form onSubmit={handleSubmit}>
            <div className="my-5">
              <label
                className="uppercase text-gray-600 block text-xl font-bold"
                htmlFor="newPassword"
              >
                Nuevo Password
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="Escribe tu Nuevo Password"
                className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                name="newPassword"
                value={newPassword}
                onChange={handleInputChange}
              />
            </div>

            <input
              type="submit"
              value="Guardar Nuevo Password"
              className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
            />
          </form>
        )}

        {updatedPassword && (
          <Link className="block text-center my-5 text-gray-500" to="/">
            Log In
          </Link>
        )}
      </div>
    </>
  );
};
