import React from "react";

const MaintenanceTableSkeleton = ({ rows = 6 }) => {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full shadow-md">
              {/* HEADER */}
              <thead>
                <tr className="bg-gray-50">
                  {["Starting Date", "Ending Date", "Reason", "Action"].map(
                    (item, index) => (
                      <th
                        key={index}
                        className="p-2.5 text-left text-sm font-semibold text-gray-400"
                      >
                        <div className="h-4 w-24 bg-gray-200 rounded" />
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-gray-200">
                {Array.from({ length: rows }).map((_, index) => (
                  <tr key={index} className="bg-white">
                    {/* Starting Date */}
                    <td className="p-2.5">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                    </td>

                    {/* Ending Date */}
                    <td className="p-2.5">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                    </td>

                    {/* Reason */}
                    <td className="p-2.5">
                      <div className="h-4 w-40 bg-gray-200 rounded" />
                    </td>

                    {/* Action */}
                    <td className="p-2.5">
                      <div className="h-6 w-6 bg-gray-200 rounded-full" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Skeleton */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-5">
              <div className="flex items-center gap-2">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-8 w-20 bg-gray-200 rounded" />
              </div>

              <div className="flex gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded" />
                <div className="h-8 w-8 bg-gray-200 rounded" />
                <div className="h-8 w-8 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MaintenanceTableSkeleton);
