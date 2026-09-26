import TableDataLoading from "../Skeleton/TableDataLoading";
import React from "react";

const TableSkeleton = ({ LENGTH = 7 }) => {
  return (
    <table className="table-auto min-w-full rounded-xl">
      <thead>
        <tr className="bg-gray-50">
          {/* Show generic loading headers */}
          {Array.from({ length: LENGTH }).map((_, i) => (
            <th key={i} className="px-2 py-3 text-left">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-300">
        <TableDataLoading />
      </tbody>
    </table>
  );
};

export default TableSkeleton;
