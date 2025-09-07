import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

function Login() {
  // By selecting state slices individually, we prevent re-renders when unrelated state changes.
  // This is a best practice with Zustand.
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // This "effect" will run whenever the `user` object or `navigate` function changes.
  // After a successful login, the `user` object in the store will be populated,
  // which will trigger this effect and cause the navigation.
  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  // The onSubmit function now only needs to call the login action.
  // The useEffect hook will handle the redirect automatically when the state changes.
  const onSubmit = async (data) => {
    await login(data.email, data.password);
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="rounded-lg bg-white p-8 shadow-md sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="block w-full rounded-md border-0 bg-gray-100 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password', { required: 'Password is required' })}
                className="block w-full rounded-md border-0 bg-gray-100 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{' '}
          <Link
            to="/register"
            className="font-semibold leading-6 text-blue-600 hover:text-blue-500"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
