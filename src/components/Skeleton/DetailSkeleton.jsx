import React from "react";

export const DetailsSkeleton = ({ rows = 4, showStatusRow = true }) => {
  return (
    <div className="w-full p-2.5 space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between border-b border-gray-200 pb-2 last:border-b-0"
        >
          {/* Label */}
          <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />

          {/* Value */}
          <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
        </div>
      ))}

      {showStatusRow && <DetailsStatusRow />}
    </div>
  );
};

export const DetailsStatusRow = () => {
  return (
    <div className="pt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
      </div>

      {/* Sub text */}
      <div className="h-3 w-48 rounded bg-gray-200 animate-pulse" />
    </div>
  );
};
