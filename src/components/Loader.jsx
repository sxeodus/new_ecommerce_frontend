import React from 'react';

function Loader() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-500"></div>
    </div>
  );
}

export default Loader;
