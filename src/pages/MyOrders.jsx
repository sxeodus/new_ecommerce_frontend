import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrderStore } from '../stores/orderStore';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

function MyOrders() {
  const { myOrders, loading, fetchMyOrders } = useOrderStore();

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  if (loading && myOrders.length === 0) {
    return <div className="container mx-auto p-6 text-center text-white">Loading your orders...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">My Orders</h1>
      {myOrders.length === 0 ? (
        <div className="text-center rounded-lg bg-white p-8 shadow-md">
          <p className="text-xl text-gray-500">You have no orders.</p>
          <Link
            to="/products"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-md">
          <table className="min-w-full table-auto text-left text-sm text-gray-800">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">DATE</th>
                <th className="px-6 py-3">TOTAL</th>
                <th className="px-6 py-3">PAID</th>
                <th className="px-6 py-3">DELIVERED</th>
                <th className="px-6 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {myOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">#{order.id}</td>
                  <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">${parseFloat(order.total_price).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {order.is_paid ? (
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <CheckCircleIcon className="h-5 w-5" />
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-yellow-600">
                        <XCircleIcon className="h-5 w-5" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {order.is_delivered ? (
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <CheckCircleIcon className="h-5 w-5" />
                        Delivered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-yellow-600">
                        <XCircleIcon className="h-5 w-5" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/order/${order.id}`}
                      className="rounded bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                    >
                      Details
                    </Link>
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

export default MyOrders;
