import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductStore } from '../stores/productStore';
import Pagination from '../components/Pagination';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

function Products() {
  const { products, page, pages, loading, fetchProducts } = useProductStore();
  const [searchParams] = useSearchParams();

  const pageNumber = searchParams.get('pageNumber') || 1;
  const category = searchParams.get('category') || '';
  const keyword = searchParams.get('keyword') || '';

  useEffect(() => {
    fetchProducts({ pageNumber, keyword, category });
  }, [fetchProducts, pageNumber, keyword, category]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        {category ? `${category}` : 'All Products'}
      </h1>
      {loading && products.length === 0 ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            pages={pages}
            page={page}
            keyword={keyword}
            category={category}
          />
        </>
      )}
    </div>
  );
}

export default Products;
