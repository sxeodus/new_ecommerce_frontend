import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

function Cart() {
  const { items, removeFromCart, updateQuantity } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const subtotal = items.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0
  );

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty. Add items before proceeding to checkout.');
      return;
    }
    if (!user) {
      toast.error('Please log in to proceed to checkout.');
      navigate('/login');
      return;
    }
    navigate('/checkout'); // Navigate to the new checkout page
  };

  return (
    <div className="container mx-auto p-6 text-gray-800">
      <h1 className="mb-6 text-3xl font-bold">Your Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="text-center">
          <p className="text-xl text-gray-500">Your cart is empty.</p>
          <Link
            to="/products"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700"
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md"
              >
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
                  <div>
                    <h2 className="font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-500">${parseFloat(item.price).toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="w-16 rounded-md border-gray-300 p-2 text-center text-gray-800 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                  />
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-600">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-2xl font-bold">Order Summary</h2>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="mt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button
                onClick={handleProceedToCheckout}
                disabled={items.length === 0}
                className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition duration-200 hover:bg-blue-700 disabled:opacity-50"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
