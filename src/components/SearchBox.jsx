import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function SearchBox() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${keyword}`);
      setKeyword(''); // Clear the input field after search
    } else {
      navigate('/products');
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex">
      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search products..."
        className="mr-2 w-full rounded-md border-0 bg-gray-100 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
      />
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBox;
