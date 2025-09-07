import React, { useEffect } from 'react';
import { useUserStore } from '../../stores/userStore';
import { useAuthStore } from '../../stores/authStore';
import { TrashIcon } from '@heroicons/react/24/outline';

function UserManagement() {
  const { users, loading, error, fetchUsers, deleteUser } = useUserStore();
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">User Management</h1>

      {loading && <p className="text-center text-gray-800">Loading users...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-lg bg-white shadow-md">
          <table className="min-w-full text-left text-sm text-gray-800">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Username</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Admin</th>
                <th scope="col" className="px-6 py-3">Joined</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{user.id}</td>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.isAdmin ? (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">Yes</span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteUser(user.id)}
                      disabled={user.id === currentUser.id}
                      className="font-medium text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:text-gray-400"
                      title={user.id === currentUser.id ? "You can't delete yourself" : 'Delete user'}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserManagement;