import Spinner from "../../components/Spinner/Spinner";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { tableIcons } from "../../Data/Icons";
import {
  formatFullDateAndTime,
  formatLocalTimeIntoISO,
} from "../../utils/index";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { getData, postData } from "../../Data/index";
import {
  addMaintenanceData,
  resetMaintenanceData,
  startMaintenanceLoading,
  updateMaintenanceData,
} from "../../Redux/VehicleSlice/VehicleSlice";
import DropDownComponent from "../../components/DropDown/DropDownComponent";
import Pagination from "../../components/Pagination/Pagination";
import ViewModal from "../../components/Modal/ViewModal";

const formatDateTimeIN = (timestring) => {
  if (!timestring) return { date: "NA", time: "NA" };
  const fullDateTime = formatFullDateAndTime(timestring);

  const date = `${fullDateTime.split(",")[0].trim()}, ${fullDateTime.split(",")[1].trim()}`;
  const time = `${fullDateTime.split(",")[2].trim()}`;

  return { date, time };
};

const MaintenanceTable = () => {
  const { vehicleMaster, loading, maintenanceData } = useSelector(
    (state) => state.vehicles,
  );
  const [isActive, setIsActive] = useState(false);
  const [viewData, setViewData] = useState(null);
  const { token } = useSelector((state) => state.user);
  const [modifyingVehicleId, setModifyingVehicleId] = useState(null);
  const showRecordsOptions = [25, 50, 100, 200, 500];
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const dispatch = useDispatch();

  // maintenanceData
  useEffect(() => {
    if (!loading && vehicleMaster?.length > 0) {
      (async () => {
        dispatch(startMaintenanceLoading());
        const response = await getData(
          `/maintenanceVehicle?vehicleTableId=${vehicleMaster[0]?._id}&page=${currentPage}&limit=${limit}`,
          token,
        );
        if (response?.status === 200) {
          dispatch(addMaintenanceData(response));
        } else {
          dispatch(resetMaintenanceData());
        }
      })();
    }

    return () => dispatch(resetMaintenanceData());
  }, [loading, vehicleMaster, limit, currentPage]);

  // const sortedMaintenance = [...(vehicleMaster[0]?.maintenance || [])];

  // table header
  const maintenanceHeader = [
    "Starting Date",
    "Ending Date",
    "Reason",
    // "Status",
    "Action",
  ];

  const isVehicleUnblocked = (id) => {
    const currentDateAndTime = new Date();
    const endDate = formatLocalTimeIntoISO(currentDateAndTime);

    const hasActiveMaintenance = maintenanceData?.data?.some((m) => {
      return m._id === id && m.endDate < endDate;
    });

    return hasActiveMaintenance;
  };

  // unblock maintenance
  const unblockVehicles = async (id) => {
    const currentDateAndTime = new Date();
    const endDate = formatLocalTimeIntoISO(currentDateAndTime);

    const hasActiveMaintenance = maintenanceData?.data?.some((m) => {
      return m._id === id && m.endDate > endDate;
    });

    if (!hasActiveMaintenance)
      return handleAsyncError(dispatch, "No Active Maintenance found");

    const data = {
      maintenanceId: id,
      vehicleTableId: vehicleMaster[0]?._id,
      endDate: endDate,
    };

    try {
      setModifyingVehicleId(id);
      const response = await postData("/maintenanceVehicle", data, token);
      if (response.success === true) {
        dispatch(updateMaintenanceData(endDate));
        handleAsyncError(dispatch, response?.message, "success");
      } else {
        handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      handleAsyncError(
        dispatch,
        "Unable to update maintenance records! try again.",
      );
    } finally {
      setModifyingVehicleId(null);
    }
  };

  const handleView = (id) => {
    const data = maintenanceData?.data?.filter((d) => d._id === id);
    if (data) {
      setIsActive(!isActive);
      setViewData(data[0]);
    }
  };

  return (
    <div className="flex flex-col">
      {maintenanceData?.data?.length > 0 && viewData !== null && (
        <ViewModal
          isActive={isActive}
          setIsActive={setIsActive}
          {...viewData}
        />
      )}
      <div className=" overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            {loading || maintenanceData?.loading ? (
              <div className="min-w-full rounded-xl">
                <Spinner message={"loading"} textColor="text-black" />
              </div>
            ) : (
              <table className="min-w-full shadow-md">
                <thead>
                  <tr className="bg-gray-50">
                    {maintenanceHeader?.map((item, index) => (
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
                  {maintenanceData?.data?.length > 0 ? (
                    maintenanceData?.data?.map((item, index) => {
                      const { date: StartDate, time: StartTime } =
                        (item?.startDate &&
                          formatDateTimeIN(item?.startDate)) ||
                        {};
                      const { date: EndDate, time: EndTime } =
                        (item?.endDate && formatDateTimeIN(item?.endDate)) ||
                        {};
                      return (
                        <tr
                          className="bg-white transition-all duration-500 hover:bg-gray-50"
                          key={index}
                          onClick={() => handleView(item?._id)}
                        >
                          <td className="p-2.5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 ">
                            {StartDate ?? "NA"},
                            <br />
                            {StartTime ?? "NA"}
                            {/* {item?.startDate
                              ? formatDateTimeIN(item?.startDate)
                              : // ? formatFullDateAndTime(item?.startDate)
                                "NA"} */}
                          </td>
                          <td className="p-2.5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                            {EndDate ?? "NA"},
                            <br />
                            {EndTime ?? "NA"}
                            {/* {item?.endDate
                              ? formatDateTimeIN(item?.endDate)
                              : // ? formatFullDateAndTime(item?.endDate)
                                "NA"} */}
                          </td>
                          <td className="p-2.5 max-w-24 truncate text-sm leading-6 font-medium text-gray-900 capitalize">
                            {item?.reason}
                          </td>
                          {/* <td className="p-2.5 whitespace-nowrap max-w-24 truncate text-sm leading-6 font-medium text-gray-900 capitalize">
                            <p
                              className={`flex items-center gap-1 ${
                                item?.status === "active"
                                  ? "text-green-500"
                                  : "text-red-500/90"
                              }`}
                            >
                              {item?.status}
                            </p>
                          </td> */}
                          <td className="p-2.5 whitespace-nowrap text-sm items-center">
                            <button
                              type="button"
                              className={`p-1 rounded-full bg-white group transition-all duration-500 flex item-center ${
                                isVehicleUnblocked(item?._id) ||
                                modifyingVehicleId === item?._id
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:text-white hover:bg-theme"
                              }`}
                              onClick={() => unblockVehicles(item?._id)}
                              disabled={
                                isVehicleUnblocked(item?._id) ||
                                modifyingVehicleId === item?._id
                              }
                              title={
                                item?.status === "active"
                                  ? "unblock vehicle"
                                  : ""
                              }
                            >
                              {modifyingVehicleId === item?._id ? (
                                <Spinner />
                              ) : item?.status === "active" ? (
                                tableIcons?.lock
                              ) : (
                                tableIcons?.unBlock
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="bg-white transition-all duration-500 hover:bg-gray-50">
                      <td
                        colSpan={maintenanceHeader?.length || 4}
                        className="col-span-full leading-6 text-sm text-gray-400 p-5 text-center italic"
                      >
                        No Data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {maintenanceData?.pagination?.limit >= 10 &&
              maintenanceData?.data?.length > 0 && (
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
                    totalNumberOfPages={maintenanceData?.pagination?.totalPages}
                    currentPage={currentPage}
                    setPageChanger={setCurrentPage}
                  />
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceTable;
