import React from "react";

export const TransactionRowsLoader = ({ rows = 6 }) => (
  <div className="px-4 animate-pulse">
    {Array.from({ length: rows }).map((_, index) => (
      <div
        key={index}
        className="flex items-center justify-between border-b py-3 last:border-0"
      >
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-gray-300 rounded w-3/5" />
          <div className="h-3 bg-gray-200 rounded w-2/5" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
        <div className="flex flex-col items-end space-y-2 pl-2">
          <div className="h-4 bg-gray-300 rounded w-14" />
          <div className="h-4 bg-gray-200 rounded-full w-10" />
        </div>
      </div>
    ))}
  </div>
);

const TransactionListLoader = () => {
  return (
    <div className="flex flex-col h-[420px] lg:h-0 lg:min-h-full overflow-hidden rounded-2xl bg-white shadow-lg animate-pulse">
      {/* header */}
      <div className="flex items-start justify-between gap-2 border-b px-4 py-3">
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-2/3" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="h-7 bg-gray-200 rounded-md w-16" />
      </div>

      {/* filter chips */}
      <div className="flex items-center gap-2 border-b px-4 py-3 overflow-hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-7 bg-gray-200 rounded-full w-16 shrink-0"
          />
        ))}
      </div>

      {/* rows */}
      <div className="flex-1 overflow-hidden">
        <TransactionRowsLoader />
      </div>
    </div>
  );
};

export default TransactionListLoader;
