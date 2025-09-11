import Spinner from "../../components/Spinner/Spinner";
import React from "react";
import { useSelector } from "react-redux";
import { tableIcons } from "../../Data/Icons";
import { camelCaseToSpaceSeparated } from "../../utils/index";

const AddOnTable = ({
  addOnId,
  setAddOnId,
  setModalValue,
  deleteFn,
  loading,
}) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);

  const extraAddOn = vehicleMaster && vehicleMaster?.[0]?.extraAddOn;

  // table header
  const addOnHeader = [
    "Add-On Name",
    "Per Day Cost",
    "Max Cost",
    "Status",
    "Action",
  ];

  const handleEditAddOn = (id) => {
    setAddOnId && setAddOnId(id);
    setModalValue && setModalValue(true);
  };

  return (
    <div className="flex flex-col">
      <div className=" overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            {extraAddOn?.loading ? (
              <div className="min-w-full rounded-xl">
                <Spinner message={"loading"} textColor="text-black" />
              </div>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    {addOnHeader?.map((item, index) => (
                      <th
                        scope="col"
                        className={`p-2.5 text-left text-sm leading-6 font-semibold text-gray-900 rounded-t-xl`}
                        key={index}
                      >
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 ">
                  {extraAddOn?.length > 0 ? (
                    extraAddOn?.map((item, index) => (
                      <tr
                        className="bg-white transition-all duration-500 hover:bg-gray-50"
                        key={index}
                      >
                        <td className="p-2.5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 capitalize">
                          {camelCaseToSpaceSeparated(item?.name)}
                        </td>
                        <td className="p-2.5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {item?.amount}
                        </td>
                        <td className="p-2.5 max-w-24 break-words whitespace-wrap text-sm leading-6 font-medium text-gray-900 capitalize">
                          {item?.maxAmount}
                        </td>
                        <td className="p-2.5 max-w-24 break-words whitespace-wrap text-sm leading-6 font-medium text-gray-900 capitalize">
                          <div
                            className={`p-1 lg:py-1.5 lg:px-2.5 border ${
                              item.status === "active"
                                ? "bg-emerald-50 border-emerald-100"
                                : "bg-red-100 border-red-200"
                            } rounded-md flex justify-center min-w-24 items-center uppercase gap-1`}
                          >
                            <svg
                              width="5"
                              height="6"
                              viewBox="0 0 5 6"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="2.5"
                                cy="3"
                                r="2.5"
                                fill={`${
                                  item.status === "active"
                                    ? "#059669"
                                    : "#C62300"
                                }`}
                              ></circle>
                            </svg>
                            <span
                              className={`font-medium text-xs ${
                                item.status === "active"
                                  ? "text-emerald-600"
                                  : "text-red-700"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                        </td>
                        <td className="p-2.5 whitespace-nowrap text-sm items-center">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              className={`p-1 rounded-full bg-white group transition-all duration-500 flex item-center hover:text-white hover:bg-blue-500`}
                              onClick={() => handleEditAddOn(item?._id)}
                              disabled={addOnId === item?._id}
                            >
                              {tableIcons?.edit}
                            </button>
                            <button
                              type="button"
                              className={`p-1 rounded-full bg-white group transition-all duration-500 flex item-center hover:text-white hover:bg-theme`}
                              onClick={() => deleteFn(item?._id)}
                              disabled={loading}
                            >
                              {!loading ? tableIcons?.delete : <Spinner />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white transition-all duration-500 hover:bg-gray-50">
                      <td
                        colSpan={addOnHeader?.length || 4}
                        className="col-span-full leading-6 text-sm text-gray-400 p-5 text-center italic"
                      >
                        No Data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOnTable;
