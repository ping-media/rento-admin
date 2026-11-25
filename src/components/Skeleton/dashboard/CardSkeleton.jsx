import React from "react";

const CardsLoader = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-xl p-4 animate-pulse"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="h-5 bg-gray-300 rounded w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardsLoader;
