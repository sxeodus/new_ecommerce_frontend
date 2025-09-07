import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

function Profile() {
  const {
    user,
    loading,
    updateUserProfile,
    fetchUserProfile,
  } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  useEffect(() => {
    if (!user?.username) {
      // Fetch profile if not already loaded
      fetchUserProfile();
    }
    if (user) {
      setValue('username', user.username);
      setValue('email', user.email);
    }
  }, [user, setValue, fetchUserProfile]);

  const onSubmit = async (data) => {
    const profileData = {
      username: data.username,
      email: data.email,
    };

    if (data.password) {
      profileData.password = data.password;
    }

    const success = await updateUserProfile(profileData);
    if (success) {
      toast.success('Profile updated successfully!');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">User Profile</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-lg bg-white p-8 shadow-md"
        >
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register('username', { required: 'Username is required' })}
              className="block w-full rounded-md border-0 bg-gray-100 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
            {errors.username && (
              <p className="mt-2 text-sm text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
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

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              New Password (leave blank to keep current)
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="block w-full rounded-md border-0 bg-gray-100 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', {
                validate: (value) =>
                  value === password || 'The passwords do not match',
              })}
              className="block w-full rounded-md border-0 bg-gray-100 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
