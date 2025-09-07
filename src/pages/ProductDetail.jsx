import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useProductStore } from '../stores/productStore';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

function ProductDetail() {
  const { id } = useParams();
  // Centralize data fetching through the product store
  const {
    product,
    loading,
    error,
    fetchProductById,
  } = useProductStore();
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    // Fetch the product when the component mounts or the ID changes
    fetchProductById(id);
  }, [id, fetchProductById]);

  if (loading) {
    return <Loader />;
  }

  if (error || !product) {
    return <div className="p-6 text-center text-gray-800">{error || 'Product not found!'}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              className="h-64 w-full object-cover md:h-full"
              src={product.image}
              alt={product.name}
            />
          </div>
          <div className="flex flex-col p-8 md:w-1/2">
            <div className="mb-4 flex-grow">
              <span className="text-sm font-semibold uppercase tracking-wide text-blue-500">
                {product.category}
              </span>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="mt-4 text-gray-600">{product.description}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-blue-600">${Number(product.price).toFixed(2)}</span>
              <button
                onClick={() => {
                  addToCart(product);
                  toast.success(`${product.name} has been added to your cart!`);
                }}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition duration-200 hover:bg-blue-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
