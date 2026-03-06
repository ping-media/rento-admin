import React from "react";
import { formatNumber } from "../../utils";
import { useMemo } from "react";

const HEADERS = [
  { key: "planName", label: "Plan Name" },
  { key: "planPrice", label: "Price" },
  { key: "kmLimit", label: "KM Limit" },
  { key: "planDuration", label: "Duration (Days)" },
];

const VehiclePlanModal = ({
  isPlanModalActive = false,
  onClose,
  planData = [],
  title = "Vehicle Package List",
  image = "",
}) => {
  if (!isPlanModalActive) return null;

  const hasData = planData.length > 0;

  // sorting based on duration in ascending order
  const sortedPlans = useMemo(() => {
    return [...planData].sort(
      (a, b) => Number(a.planDuration) - Number(b.planDuration),
    );
  }, [planData]);

  return (
    <div className="fixed z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4">
      <div className="relative top-20 mx-auto shadow-xl rounded-md bg-white max-w-xl flex flex-col max-h-[85vh]">
        <div className="flex justify-between border-b p-2">
          <h2 className="text-theme font-semibold text-lg uppercase">
            {title}
          </h2>
          <button
            onClick={() => onClose(false)}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 pt-2">
          {image?.trim() !== "" && (
            <div className="w-full h-32 md:h-40 border mb-3.5 md:mb-5">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          )}
          {!hasData ? (
            <p className="text-center text-gray-500 italic">
              No plans available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
                {/* TABLE HEAD */}
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    {HEADERS.map((col) => (
                      <th
                        key={col.key}
                        className="px-2.5 py-2 text-center truncate max-w-24 md:max-w-auto"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* TABLE BODY */}
                <tbody>
                  {sortedPlans.map((plan) => (
                    <tr
                      key={plan._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      {HEADERS.map((col) => {
                        const value = plan[col.key];

                        return (
                          <td
                            className={`px-2.5 py-2 font-normal capitalize text-center ${col.key === "planPrice" ? "text-theme font-medium" : ""}`}
                            key={col.key}
                          >
                            {col.key === "planPrice" && "₹"}
                            {typeof value === "number"
                              ? formatNumber(value)
                              : (value ?? "--")}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehiclePlanModal;
