import React from 'react';
import { Link } from 'react-router-dom';

function Pagination({
  pages,
  page,
  keyword = '',
  category = '',
  baseUrl = '/products', // Default to public products page
}) {
  if (pages <= 1) {
    return null;
  }

  const createUrl = (pageNumber) => {
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (category) params.append('category', category);
    params.append('pageNumber', pageNumber);
    return `${baseUrl}?${params.toString()}`; // Use the dynamic baseUrl
  };

  return (
    <div className="mt-8 flex justify-center">
      <nav
        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
        aria-label="Pagination"
      >
        {[...Array(pages).keys()].map((x) => (
          <Link
            key={x + 1}
            to={createUrl(x + 1)}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
              x + 1 === page
                ? 'z-10 bg-sky-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600'
                : 'text-gray-300 ring-1 ring-inset ring-gray-700 hover:bg-gray-800'
            } ${x === 0 ? 'rounded-l-md' : ''} ${
              x === pages - 1 ? 'rounded-r-md' : ''
            }`}
          >
            {x + 1}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Pagination;
