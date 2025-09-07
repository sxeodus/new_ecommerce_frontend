import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrderStore } from '../../stores/orderStore';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

function ManageOrders() {
  const { orders, loading, fetchOrders, markAsDelivered } = useOrderStore(
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading && orders.length === 0) { 
    return <div className="container mx-auto p-6 text-center text-gray-800">Loading orders...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Order Management</h1>
      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="min-w-full table-auto text-left text-sm text-gray-800"> 
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500"> 
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">USER</th>
              <th className="px-6 py-3">DATE</th>
              <th className="px-6 py-3">TOTAL</th>
              <th className="px-6 py-3">DELIVERED</th>
              <th className="px-6 py-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200"> 
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50"> 
                  <td className="px-6 py-4 font-medium">#{order.id}</td>
                  <td className="px-6 py-4">{order.username}</td>
                  <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">${parseFloat(order.total_price).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {order.is_delivered ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800"> 
                        <CheckCircleIcon className="h-4 w-4" />
                        Delivered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800"> 
                        <XCircleIcon className="h-4 w-4" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-700"
                      >
                        Details
                      </Link>
                      {!order.is_delivered && (
                        <button
                          onClick={() => markAsDelivered(order.id)}
                          disabled={loading} 
                          className="rounded bg-green-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageOrders;
