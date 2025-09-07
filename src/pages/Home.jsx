import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../stores/productStore';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

function Home() {
  const { featuredProducts, loading, fetchFeaturedProducts } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-6xl">
          Welcome to E-Store
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Discover our latest collection and top-rated products.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/products"
            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Shop All Products
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
        {loading && featuredProducts.length === 0 ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
