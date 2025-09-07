import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrderStore } from '../../stores/orderStore';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

function OrderDetailAdmin() {
  const { id } = useParams();
  const {
    currentOrder: order,
    loading,
    error,
    fetchOrderById,
    markAsDelivered,
  } = useOrderStore();

  useEffect(() => {
    if (id) {
      fetchOrderById(id);
    }
  }, [id, fetchOrderById]);

  if (loading && !order) {
    return <div className="p-6 text-center text-gray-800">Loading order details...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  if (!order) {
    return <div className="p-6 text-center text-gray-800">No order found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Order #{order.id}</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column: Order Items & Summary */}
        <div className="md:col-span-2">
          <div className="space-y-6 rounded-lg bg-white p-6 shadow-md">
            <h2 className="border-b border-gray-200 pb-2 text-xl font-semibold text-gray-900">
              Order Items
            </h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="flex-grow">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x ${parseFloat(item.price).toFixed(2)} = ${ (item.quantity * parseFloat(item.price)).toFixed(2) }
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 text-right">
              <p className="text-lg font-bold text-gray-900">
                Total: ${parseFloat(order.total_price).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Customer, Shipping, Status */}
        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="border-b border-gray-200 pb-2 text-xl font-semibold text-gray-900">
              Customer
            </h2>
            <p className="mt-2 text-gray-700">
              <strong>Name:</strong> {order.username}
            </p>
            <p className="mt-1 text-gray-700">
              <strong>Email:</strong> <a href={`mailto:${order.email}`} className="text-blue-600 hover:underline">{order.email}</a>
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="border-b border-gray-200 pb-2 text-xl font-semibold text-gray-900">
              Shipping Address
            </h2>
            <p className="mt-2 text-gray-700">{order.shipping_address}</p>
            <p className="text-gray-700">{order.shipping_city}, {order.shipping_postal_code}</p>
            <p className="text-gray-700">{order.shipping_country}</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="border-b border-gray-200 pb-2 text-xl font-semibold text-gray-900">
              Order Status
            </h2>
            <div className="mt-2">
              {order.is_delivered ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircleIcon className="h-6 w-6" />
                  <div>
                    <p>Delivered</p>
                    <p className="text-xs text-gray-500">on {new Date(order.delivered_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-yellow-600">
                  <XCircleIcon className="h-6 w-6" />
                  <p>Not Delivered</p>
                </div>
              )}
            </div>
            {!order.is_delivered && (
              <button
                onClick={() => markAsDelivered(order.id)}
                disabled={loading}
                className="mt-4 w-full rounded-lg bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Mark as Delivered'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailAdmin;
