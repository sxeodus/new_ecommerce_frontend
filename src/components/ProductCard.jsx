import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import toast from 'react-hot-toast';

function ProductCard({ product }) {
  const { addToCart } = useCartStore();

  const handleAddToCart = (e) => {
    // Prevent the Link's navigation when the button is clicked
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
          />
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {/* This span makes the entire card clickable via the parent Link */}
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{product.category}</p>
          </div>
          <div className="mt-4 flex flex-1 items-end justify-between">
            <p className="text-xl font-bold text-gray-900">
              ${parseFloat(product.price).toFixed(2)}
            </p>
            <button
              onClick={handleAddToCart}
              className="relative z-10 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
