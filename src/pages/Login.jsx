import { Link } from 'react-router-dom';

import { useAlert, useAuth, useForm } from '../hooks';
import { fetchWithoutToken } from '../helpers/fetch';
import { Alert } from '../components';

export const Login = () => {
  const { setAuthCb } = useAuth();
  const [formValues, handleInputChange, reset] = useForm({
    email: '',
    password: '',
  });
  const [alerta, setAlerta] = useAlert({});

  const { email, password } = formValues;
  const { msg } = alerta;

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email || !password)
      return setAlerta({
        msg: 'Todos los campos son obligatorios!',
        error: true,
      });
    if (password.length < 6)
      return setAlerta({
        msg: 'El password debe tener almenos 6 caracteres!',
        error: true,
      });
    setAlerta({});

    // Authentication:
    try {
      const { data } = await fetchWithoutToken(
        '/auth/login',
        { email, password },
        'POST'
      );
      localStorage.setItem('token', data.token);
      setAuthCb(data.user);
    } catch (error) {
      setAlerta({ msg: error.response.data.msg, error: true });
    }

    reset();
  };

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Inicia sesión y administra tus{' '}
        <span className="text-slate-700">proyectos</span>
      </h1>

      <form
        onSubmit={handleSubmit}
        className="my-10 bg-white shadow rounded-lg p-10"
      >
        {msg && <Alert alerta={alerta} />}

        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            autoFocus={true}
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            name="email"
            value={email}
            onChange={handleInputChange}
          />
        </div>
        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            name="password"
            value={password}
            onChange={handleInputChange}
          />
        </div>

        <input
          type="submit"
          value="Iniciar Sesión"
          className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/register"
        >
          ¿No tienes una cuenta? Regístrate
        </Link>

        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/forgot-password"
        >
          Olvide Mi Password
        </Link>
      </nav>
    </>
  );
};
