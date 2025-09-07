import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProductStore } from '../../stores/productStore';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Pagination from '../../components/Pagination';

function ProductManagement() {
  const { products, page, pages, loading, fetchProducts, deleteProduct } = useProductStore();
  const [searchParams] = useSearchParams();
  const pageNumber = searchParams.get('pageNumber') || 1;

  useEffect(() => {
    fetchProducts({ pageNumber });
  }, [fetchProducts, pageNumber]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Product Management</h1>
        <Link
          to="/admin/products/new"
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
        >
          Create Product
        </Link>
      </div>
      {loading ? (
        <div className="text-center text-gray-800">Loading products...</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg bg-white shadow-md">
            <table className="min-w-full table-auto text-left text-sm text-gray-800">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">NAME</th>
                  <th className="px-6 py-3">PRICE</th>
                  <th className="px-6 py-3">CATEGORY</th>
                  <th className="px-6 py-3">BRAND</th>
                  <th className="px-6 py-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{product.id}</td>
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">${parseFloat(product.price).toFixed(2)}</td>
                    <td className="px-6 py-4">{product.category}</td>
                    <td className="px-6 py-4">{product.brand}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/products/edit/${product.id}`} className="text-gray-500 hover:text-blue-600">
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button onClick={() => handleDelete(product.id)} className="text-gray-500 hover:text-red-600">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pages={pages} page={page} baseUrl="/admin/products" />
        </>
      )}
    </div>
  );
}

export default ProductManagement;
