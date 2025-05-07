import Spinner from "../../components/Spinner/Spinner";
import React from "react";
import { useSelector } from "react-redux";
import InputSwitchForAddOn from "../../components/InputAndDropdown/InputSwitchForAddOn";

const GSTTable = () => {
  const { general } = useSelector((state) => state.general);

  // table header
  const addOnHeader = ["GST Percentage", "Status"];

  return (
    <div className="flex flex-col">
      <div className=" overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            {general?.loading ? (
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
                  {general?.GST ? (
                    <tr className="bg-white transition-all duration-500 hover:bg-gray-50">
                      <td className="p-2.5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                        GST {general?.GST?.percentage}%
                      </td>
                      <td className="p-2.5 max-w-24 break-words whitespace-wrap text-sm leading-6 font-medium text-gray-900 capitalize">
                        <InputSwitchForAddOn
                          value={general?.GST?.status}
                          endpoint="/updateGeneral"
                        />
                      </td>
                    </tr>
                  ) : (
                    <tr className="bg-white transition-all duration-500 hover:bg-gray-50">
                      <td
                        colSpan={addOnHeader?.length || 2}
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

export default GSTTable;
