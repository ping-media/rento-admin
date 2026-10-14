import React from "react";

const ChartLoader = () => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mt-6 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-4 bg-gray-300 rounded w-1/4" />
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-gray-200 rounded-md" />
          <div className="h-8 w-20 bg-gray-200 rounded-md" />
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-80 bg-gray-100 rounded-lg flex items-end justify-between px-4 py-6">
        {Array.from({ length: 14 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-300 rounded w-4"
            style={{
              height: `${Math.random() * 70 + 20}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ChartLoader;
