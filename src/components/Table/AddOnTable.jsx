import Spinner from "../../components/Spinner/Spinner";
import React from "react";
import { useSelector } from "react-redux";
import { tableIcons } from "../../Data/Icons";
import { camelCaseToSpaceSeparated } from "../../utils/index";
import InputSwitchForAddOn from "../../components/InputAndDropdown/InputSwitchForAddOn";

const AddOnTable = ({
  addOnId,
  setAddOnId,
  setModalValue,
  deleteFn,
  loading,
}) => {
  const { extraAddOn } = useSelector((state) => state.general);

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
                  {extraAddOn?.data?.length > 0 ? (
                    extraAddOn?.data?.map((item, index) => (
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
                          <InputSwitchForAddOn
                            value={item?.status}
                            id={item?._id}
                          />
                          {/* {item?.status} */}
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

            {/* {extraAddOn?.pagination !== null &&
              extraAddOn?.pagination?.limit >= 10 &&
              extraAddOn?.data?.length > 0 && (
                <div className="flex flex-wrap items-center justify-start lg:justify-between gap-4 lg:gap-2 mt-5">
                  <div className="flex items-center gap-2">
                    <h2 className="capitalize">Rows per Page</h2>
                    <DropDownComponent
                      options={showRecordsOptions}
                      customLimit={limit}
                      setLimitChanger={setLimit}
                    />
                  </div>
                  <span className="hidden lg:mx-1">|</span>
                  <Pagination
                    totalNumberOfPages={extraAddOn?.pagination?.totalPages}
                    currentPage={currentPage}
                    setPageChanger={setCurrentPage}
                  />
                </div>
              )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOnTable;
