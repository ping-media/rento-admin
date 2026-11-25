import { tableIcons } from "../../Data/Icons";
import Spinner from "../../components/Spinner/Spinner";
import React from "react";

const CommonTable = ({
  coloumn,
  data,
  loading,
  action = false,
  showSlNo = false,
  handleEdit,
  rowId,
  handleDelete,
}) => {
  return (
    <div className="flex flex-col">
      <div className=" overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            {loading ? (
              <div className="min-w-full rounded-xl">
                <Spinner message={"loading"} textColor="text-black" />
              </div>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    {showSlNo && (
                      <th
                        scope="col"
                        className={`p-2.5 text-left text-sm leading-6 font-semibold text-gray-900 rounded-t-xl capitalize`}
                      >
                        SL No.
                      </th>
                    )}
                    {coloumn?.length > 0 &&
                      coloumn?.map((item, index) => (
                        <th
                          scope="col"
                          className={`p-2.5 text-left text-sm leading-6 font-semibold text-gray-900 rounded-t-xl capitalize`}
                          key={index}
                        >
                          {item}
                        </th>
                      ))}
                    {action && (
                      <th
                        scope="col"
                        className={`p-2.5 text-left text-sm leading-6 font-semibold text-gray-900 rounded-t-xl capitalize`}
                      >
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {data?.length > 0 ? (
                    data.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="bg-white transition-all duration-500 hover:bg-gray-50"
                      >
                        {showSlNo && (
                          <td className="p-2.5 whitespace-nowrap max-w-24 truncate text-sm leading-6 font-medium text-gray-900">
                            {rowIndex + 1}
                          </td>
                        )}
                        {coloumn.map((col, colIndex) => (
                          <td
                            key={colIndex}
                            className="p-2.5 whitespace-nowrap max-w-24 truncate text-sm leading-6 font-medium text-gray-900"
                          >
                            {row[col] ?? "-"}
                          </td>
                        ))}
                        {action && (
                          <td
                            className="p-2.5 whitespace-nowrap max-w-24 truncate text-sm leading-6 font-medium text-gray-900"
                            key={`AD_${rowIndex}`}
                          >
                            <div className="flex items-center gap-1">
                              {handleEdit && (
                                <button
                                  type="button"
                                  className={`p-1 rounded-full bg-white group transition-all duration-500 flex item-center hover:text-white hover:bg-blue-500`}
                                  onClick={() => handleEdit(row?._id)}
                                >
                                  {tableIcons?.edit}
                                </button>
                              )}
                              {handleDelete && (
                                <button
                                  type="button"
                                  className={`p-1 rounded-full bg-white group transition-all duration-500 flex item-center hover:text-white hover:bg-theme`}
                                  onClick={() => handleDelete(row?._id)}
                                >
                                  {rowId !== data?._id ? (
                                    tableIcons?.delete
                                  ) : (
                                    <Spinner />
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={coloumn.length}
                        className="p-5 text-center text-sm italic text-gray-400"
                      >
                        No data found.
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

export default CommonTable;
