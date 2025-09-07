import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className="container mx-auto p-6 text-gray-900">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card for Managing Products */}
        <Link to="/admin/products" className="block rounded-lg bg-white p-6 shadow-md transition hover:bg-gray-50">
          <h2 className="mb-2 text-xl font-semibold">Manage Products</h2>
          <p className="text-gray-400">
            Add, edit, or remove products from the store.
          </p>
        </Link>

        {/* Card for Managing Users */}
        <Link to="/admin/users" className="block rounded-lg bg-white p-6 shadow-md transition hover:bg-gray-50">
          <h2 className="mb-2 text-xl font-semibold">Manage Users</h2>
          <p className="text-gray-400">View and manage user accounts.</p>
        </Link>

        {/* Card for Managing Orders */}
        <Link
          to="/admin/orders"
          className="block rounded-lg bg-white p-6 shadow-md transition hover:bg-gray-50">
          <h2 className="mb-2 text-xl font-semibold">Manage Orders</h2>
          <p className="text-gray-400">
            Review and manage customer orders.
          </p>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
