import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCartStore } from '../stores/cartStore';
import { useOrderStore } from '../stores/orderStore';

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { createOrder, loading: orderLoading } = useOrderStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const subtotal = items.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0
  );

  const onSubmit = async (data) => {
    const shippingAddress = {
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      country: data.country,
    };

    const orderData = {
      orderItems: items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: parseFloat(item.price),
        image: item.image,
      })),
      totalPrice: subtotal,
      shippingAddress,
    };

    const newOrder = await createOrder(orderData);
    if (newOrder) {
      clearCart();
      navigate(`/order/${newOrder.id}`); // Redirect to the new order screen
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-6 text-white text-center">
        <h1 className="mb-6 text-3xl font-bold">Your cart is empty.</h1>
        <Link
          to="/products"
          className="mt-4 inline-block rounded-lg bg-sky-600 px-6 py-2 font-semibold text-white transition duration-200 hover:bg-sky-700"
        >
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="mb-6 text-3xl font-bold">Shipping Details</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-gray-900 p-6 shadow-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-300">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  {...register('address', { required: 'Address is required' })}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                />
                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-300">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  {...register('city', { required: 'City is required' })}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                />
                {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>}
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-300">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  {...register('postalCode', { required: 'Postal Code is required' })}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                />
                {errors.postalCode && <p className="mt-1 text-sm text-red-500">{errors.postalCode.message}</p>}
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-300">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  {...register('country', { required: 'Country is required' })}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                />
                {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>}
              </div>
              <button
                type="submit"
                disabled={orderLoading}
                className="mt-6 w-full rounded-lg bg-sky-600 py-3 font-semibold text-white transition duration-200 hover:bg-sky-700 disabled:opacity-50"
              >
                {orderLoading ? 'Processing...' : 'Continue to Payment'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg bg-gray-900 p-6 shadow-xl">
            <h2 className="mb-4 text-2xl font-bold">Order Summary</h2>
            <div className="space-y-2 border-b border-gray-700 pb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
