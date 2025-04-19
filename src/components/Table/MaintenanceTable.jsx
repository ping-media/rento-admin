// import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
// import { postData } from "../../Data/index";
import Spinner from "../../components/Spinner/Spinner";
import React from "react";
import { useSelector } from "react-redux";
// import { tableIcons } from "../../Data/Icons";
import { formatFullDateAndTime } from "../../utils/index";

const MaintenanceTable = () => {
  const { vehicleMaster, loading } = useSelector((state) => state.vehicles);
  // const token = useSelector((state) => state.user);
  // const [dataLoading, setDataLoading] = useState(false);
  // const dispatch = useDispatch();

  const sortedMaintenance = [...(vehicleMaster[0]?.maintenance || [])];

  //   const handleDeleteSpecialDays = async () => {
  //     try {
  //       setDataLoading(true);
  //       const response = await postData(
  //         "/updateGeneral",
  //         {
  //           clearSpecialDays: true,
  //         },
  //         token
  //       );
  //       if (response?.success === true) {
  //         const newData = {
  //           ...general,
  //           specialDays: [],
  //         };
  //         dispatch(addGeneral(newData));
  //         handleAsyncError(dispatch, response?.message, "success");
  //         return;
  //       } else if (response?.success === false) {
  //         handleAsyncError(
  //           dispatch,
  //           "Error while deleting from server! try again after sometime."
  //         );
  //       }
  //     } catch (error) {
  //       handleAsyncError(
  //         dispatch,
  //         "Error while deleting special days! try again."
  //       );
  //     } finally {
  //       setDataLoading(false);
  //     }
  //   };

  // const handleDeleteRecord = async () => {
  //   try {
  //     const response = await postData("/");
  //   } catch (error) {}
  // };

  return (
    <div className="flex flex-col">
      <div className=" overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            {loading ? (
              <div className="min-w-full rounded-xl">
                <Spinner />
              </div>
            ) : (
              <table className="min-w-full shadow-md">
                <thead>
                  <tr className="bg-gray-50">
                    <th
                      scope="col"
                      className="p-2.5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl"
                    >
                      Starting Date
                    </th>
                    <th
                      scope="col"
                      className="p-2.5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
                    >
                      Ending Date
                    </th>
                    <th
                      scope="col"
                      className="p-2.5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
                    >
                      Reason
                    </th>
                    {/* <th
                      scope="col"
                      className="p-2.5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
                    >
                      Action
                    </th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 ">
                  {sortedMaintenance?.length > 0 ? (
                    sortedMaintenance?.map((item, index) => (
                      <tr
                        className="bg-white transition-all duration-500 hover:bg-gray-50"
                        key={index}
                      >
                        <td className="p-2.5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 ">
                          {formatFullDateAndTime(item?.startDate)}
                        </td>
                        <td className="p-2.5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {formatFullDateAndTime(item?.endDate)}
                        </td>
                        <td className="p-2.5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 capitalize">
                          {item?.reason}
                        </td>
                        {/* <td className="p-2.5 whitespace-nowrap text-sm items-center">
                          <button
                            type="button"
                            className="p-1 rounded-full bg-white group transition-all duration-500 hover:text-white hover:bg-theme flex item-center"
                          >
                            {tableIcons?.delete}
                          </button>
                        </td> */}
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white transition-all duration-500 hover:bg-gray-50">
                      <td
                        colSpan={3}
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

export default MaintenanceTable;
