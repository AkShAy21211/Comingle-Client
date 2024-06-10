import React from 'react';

const people = () => {
  return (
    <div className="w-full h-36 md:h-52 rounded-lg flex flex-col items-center animate-pulse">
      <div className="w-20 h-20 rounded-full bg-gray-300 mt-5"></div>
      <div className="w-3/4 h-4 bg-gray-300 mt-3 rounded"></div>
    </div>
  );
};

export default people;
