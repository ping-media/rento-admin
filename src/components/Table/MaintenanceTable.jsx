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

const MaintenanceTable = ({ isMaintenanceAdd }) => {
  const { vehicleMaster, loading, maintenanceData } = useSelector(
    (state) => state.vehicles,
  );
  const [isActive, setIsActive] = useState(false);
  const [viewData, setViewData] = useState(null);
  const { token } = useSelector((state) => state.user);
  const [modifyingVehicleId, setModifyingVehicleId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null });
  const showRecordsOptions = [25, 50, 100, 200, 500];
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const dispatch = useDispatch();

  const fetchMaintenanceData = async () => {
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
  };

  // maintenanceData
  useEffect(() => {
    if (!loading && vehicleMaster?.length > 0) {
      (async () => {
        await fetchMaintenanceData();
        // dispatch(startMaintenanceLoading());
        // const response = await getData(
        //   `/maintenanceVehicle?vehicleTableId=${vehicleMaster[0]?._id}&page=${currentPage}&limit=${limit}`,
        //   token,
        // );
        // if (response?.status === 200) {
        //   dispatch(addMaintenanceData(response));
        // } else {
        //   dispatch(resetMaintenanceData());
        // }
      })();
    }

    return () => dispatch(resetMaintenanceData());
  }, [loading, vehicleMaster, limit, currentPage, isMaintenanceAdd]);

  // const sortedMaintenance = [...(vehicleMaster[0]?.maintenance || [])];

  // table header
  const maintenanceHeader = [
    "Starting Date",
    "Ending Date",
    "Reason",
    "Action",
  ];

  // const isVehicleUnblocked = (id) => {
  //   const currentDateAndTime = new Date();
  //   const endDate = formatLocalTimeIntoISO(currentDateAndTime);

  //   console.log(endDate);

  //   const hasActiveMaintenance = maintenanceData?.data?.some((m) => {
  //     return m._id === id && m.endDate < endDate;
  //   });

  //   return hasActiveMaintenance;
  // };

  // unblock maintenance

  const unblockVehicles = async (id) => {
    const currentDateAndTime = new Date();
    const endDate = formatLocalTimeIntoISO(currentDateAndTime);

    const hasActiveMaintenance = maintenanceData?.data?.some((m) => {
      return m._id === id && m.isActive === true; // use backend flag
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
        // dispatch(updateMaintenanceData(endDate));
        handleAsyncError(dispatch, response?.message, "success");
        await fetchMaintenanceData();
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
  // const unblockVehicles = async (id) => {
  //   const currentDateAndTime = new Date();
  //   const endDate = formatLocalTimeIntoISO(currentDateAndTime);

  //   const hasActiveMaintenance = maintenanceData?.data?.some((m) => {
  //     return m._id === id && m.endDate > endDate;
  //   });

  //   if (!hasActiveMaintenance)
  //     return handleAsyncError(dispatch, "No Active Maintenance found");

  //   const data = {
  //     maintenanceId: id,
  //     vehicleTableId: vehicleMaster[0]?._id,
  //     endDate: endDate,
  //   };

  //   try {
  //     setModifyingVehicleId(id);
  //     const response = await postData("/maintenanceVehicle", data, token);
  //     if (response.success === true) {
  //       dispatch(updateMaintenanceData(endDate));
  //       handleAsyncError(dispatch, response?.message, "success");
  //     } else {
  //       handleAsyncError(dispatch, response?.message);
  //     }
  //   } catch (error) {
  //     handleAsyncError(
  //       dispatch,
  //       "Unable to update maintenance records! try again.",
  //     );
  //   } finally {
  //     setModifyingVehicleId(null);
  //   }
  // };

  const handleView = (id) => {
    const data = maintenanceData?.data?.find((d) => d._id === id);
    if (data) {
      // setIsActive(!isActive);
      setIsActive(true);
      setViewData(data);
    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={isActive && viewData !== null}
        onClose={() => setIsActive(false)}
        title="Maintenance Details"
        className="p-4 w-full max-w-xl"
      >
        <div className="flex flex-col gap-2">
          <p className="text-sm">
            <span className="font-semibold">Start:</span>{" "}
            {viewData?.startDate && formatFullDateAndTime(viewData.startDate)}
          </p>
          <p className="text-sm">
            <span className="font-semibold">End:</span>{" "}
            {viewData?.endDate && formatFullDateAndTime(viewData.endDate)}
          </p>
          <div className="text-sm">
            <span className="font-semibold">Reason:</span>

            <div className="mt-1 max-h-40 overflow-y-auto rounded-md border bg-gray-50 p-2">
              <span className="capitalize break-all whitespace-pre-wrap">
                {viewData?.reason}
              </span>
            </div>
          </div>
        </div>
      </ConfirmModal>

      {/* Confirm Unblock Modal */}
      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, id: null })}
        title="Unblock Vehicle"
      >
        <p className="text-sm text-gray-500">
          Are you sure you want to unblock this vehicle from maintenance?
        </p>
        <div className="flex justify-end gap-3 mt-2">
          <button
            className="px-4 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
            onClick={() => setConfirmModal({ open: false, id: null })}
          >
            Cancel
          </button>
          <button
            className="px-4 py-1.5 rounded-lg bg-theme text-white text-sm hover:opacity-90"
            onClick={() => {
              unblockVehicles(confirmModal.id);
              setConfirmModal({ open: false, id: null });
            }}
          >
            Confirm
          </button>
        </div>
      </ConfirmModal>

      {/* {maintenanceData?.data?.length > 0 && viewData !== null && ( */}
      {/* {viewData !== null && (
        <ViewModal
          isActive={isActive}
          setIsActive={setIsActive}
          {...viewData}
        />
      )}

      confirmation modal 
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-md shadow-xl p-6 w-80 flex flex-col gap-4">
            <h2 className="text-base font-semibold text-gray-800">
              Unblock Vehicle
            </h2>
            <p className="text-sm text-gray-500">
              Are you sure you want to unblock this vehicle from maintenance?
            </p>
            <div className="flex justify-end gap-3 mt-2">
              <button
                className="px-4 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
                onClick={() => setConfirmModal({ open: false, id: null })}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1.5 rounded-lg bg-theme text-white text-sm hover:opacity-90"
                onClick={() => {
                  unblockVehicles(confirmModal.id);
                  setConfirmModal({ open: false, id: null });
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )} */}

      <div className="flex flex-col">
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
                            // onClick={() => handleView(item?._id)}
                          >
                            <td className="p-2.5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 ">
                              {StartDate ?? "NA"},
                              <br />
                              {StartTime ?? "NA"}
                            </td>
                            <td className="p-2.5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                              {EndDate ?? "NA"},
                              <br />
                              {EndTime ?? "NA"}
                            </td>
                            <td className="p-2.5 max-w-24 truncate text-sm leading-6 font-medium text-gray-900 capitalize">
                              {item?.reason}
                            </td>
                            <td className="p-2.5 whitespace-nowrap text-sm items-center">
                              <div className="flex items-center gap-1">
                                {/* View button */}
                                <button
                                  type="button"
                                  className="p-1 rounded-full bg-white hover:text-white hover:bg-theme transition-all duration-500 flex items-center"
                                  onClick={() => handleView(item?._id)}
                                  title="View details"
                                >
                                  {tableIcons?.eyeOpen}
                                </button>

                                {/* Lock/Unlock button */}
                                <button
                                  type="button"
                                  className={`p-1 rounded-full bg-white group transition-all duration-500 flex items-center ${
                                    !item?.isActive ||
                                    modifyingVehicleId === item?._id
                                      ? "opacity-50 cursor-not-allowed"
                                      : "hover:text-white hover:bg-theme"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (
                                      !item?.isActive ||
                                      modifyingVehicleId === item?._id
                                    )
                                      return;
                                    setConfirmModal({
                                      open: true,
                                      id: item?._id,
                                    });
                                  }}
                                  disabled={
                                    !item?.isActive ||
                                    modifyingVehicleId === item?._id
                                  }
                                  title={
                                    item?.isActive
                                      ? "Vehicle currently under maintenance"
                                      : "Unblock vehicle"
                                  }
                                >
                                  {modifyingVehicleId === item?._id ? (
                                    <Spinner />
                                  ) : item?.isActive ? (
                                    tableIcons?.lock
                                  ) : (
                                    tableIcons?.unBlock
                                  )}
                                </button>
                              </div>
                            </td>
                            {/* <td className="p-2.5 whitespace-nowrap text-sm items-center" >
                            <button
                              type="button"
                              className={`p-1 rounded-full bg-white group transition-all duration-500 flex item-center ${
                                !item?.isActive ||
                                modifyingVehicleId === item?._id
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:text-white hover:bg-theme"
                              }`}
                              // className={`p-1 rounded-full bg-white group transition-all duration-500 flex item-center ${
                              //   isVehicleUnblocked(item?._id) ||
                              //   modifyingVehicleId === item?._id
                              //     ? "opacity-50 cursor-not-allowed"
                              //     : "hover:text-white hover:bg-theme"
                              // }`}
                              // onClick={() => unblockVehicles(item?._id)}
                              onClick={(e) => {
                                e.stopPropagation(); // prevent row click (handleView) from firing
                                if (
                                  !item?.isActive ||
                                  modifyingVehicleId === item?._id
                                )
                                  return;
                                setConfirmModal({ open: true, id: item?._id });
                              }}
                              disabled={
                                !item?.isActive ||
                                modifyingVehicleId === item?._id
                              }
                              title={
                                item?.isActive
                                  ? "Vehicle currently under maintenance"
                                  : "Unblock vehicle"
                              }
                              // disabled={
                              //   isVehicleUnblocked(item?._id) ||
                              //   modifyingVehicleId === item?._id
                              // }
                              // title={
                              //   item?.status === "active"
                              //     ? "unblock vehicle"
                              //     : ""
                              // }
                            >
                              {modifyingVehicleId === item?._id ? (
                                <Spinner />
                              ) : item?.status === "active" ? (
                                tableIcons?.lock
                              ) : (
                                tableIcons?.unBlock
                              )}
                              {modifyingVehicleId === item?._id ? (
                                <Spinner />
                              ) : item?.isActive ? (
                                tableIcons?.lock
                              ) : (
                                tableIcons?.unBlock
                              )}
                            </button>
                          </td> */}
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
                      totalNumberOfPages={
                        maintenanceData?.pagination?.totalPages
                      }
                      currentPage={currentPage}
                      setPageChanger={setCurrentPage}
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MaintenanceTable;

const ConfirmModal = ({
  isOpen,
  onClose,
  title,
  children,
  className = "p-6 max-w-sm",
}) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-md shadow-xl overflow-hidden ${className} flex flex-col gap-4`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-lg p-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
