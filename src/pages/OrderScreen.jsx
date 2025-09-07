import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useOrderStore } from '../stores/orderStore';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

function OrderScreen() {
  const { id: orderId } = useParams();
  const {
    currentOrder: order,
    loading,
    error,
    fetchOrderDetails,
    payOrder,
  } = useOrderStore();

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId, fetchOrderDetails]);

  const handlePayment = () => {
    payOrder(orderId);
  };

  if (loading && !order) {
    return <div className="p-6 text-center text-white">Loading order...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  if (!order) {
    return <div className="p-6 text-center text-white">Order not found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold text-white">Order #{order.id}</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column: Order Items & Shipping */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-lg bg-gray-900 p-6 shadow-xl">
            <h2 className="border-b border-gray-700 pb-2 text-xl font-semibold text-white">
              Shipping
            </h2>
            <p className="mt-2 text-gray-300">
              <strong>Address:</strong> {order.shipping_address}, {order.shipping_city},{' '}
              {order.shipping_postal_code}, {order.shipping_country}
            </p>
            <div className="mt-2">
              {order.is_delivered ? (
                <div className="flex items-center gap-2 rounded-md bg-green-900 p-2 text-green-300">
                  <CheckCircleIcon className="h-5 w-5" />
                  Delivered on {new Date(order.delivered_at).toLocaleDateString()}
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-md bg-red-900 p-2 text-red-300">
                  <XCircleIcon className="h-5 w-5" />
                  Not Delivered
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg bg-gray-900 p-6 shadow-xl">
            <h2 className="border-b border-gray-700 pb-2 text-xl font-semibold text-white">
              Order Items
            </h2>
            <div className="space-y-4 mt-4">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="flex-grow">
                    <p className="font-medium text-white">{item.name}</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {item.quantity} x ${parseFloat(item.price).toFixed(2)} = ${' '}
                    {(item.quantity * parseFloat(item.price)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="md:col-span-1">
          <div className="rounded-lg bg-gray-900 p-6 shadow-xl">
            <h2 className="border-b border-gray-700 pb-2 text-xl font-semibold text-white">
              Order Summary
            </h2>
            <div className="mt-4 flex justify-between">
              <span className="text-gray-300">Total</span>
              <span className="font-bold">${parseFloat(order.total_price).toFixed(2)}</span>
            </div>
            <div className="mt-4">
              {order.is_paid ? (
                <div className="flex items-center justify-center gap-2 rounded-md bg-green-900 p-2 text-green-300">
                  <CheckCircleIcon className="h-5 w-5" />
                  Paid on {new Date(order.paid_at).toLocaleDateString()}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-md bg-red-900 p-2 text-red-300">
                  <XCircleIcon className="h-5 w-5" />
                  Not Paid
                </div>
              )}
            </div>
            {!order.is_paid && (
              <button
                onClick={handlePayment}
                disabled={loading}
                className="mt-4 w-full rounded-lg bg-sky-600 py-2 font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Pay with Mock Gateway'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderScreen;