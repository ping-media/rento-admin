import { useDispatch, useSelector } from "react-redux";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import {
  changeTempLoadingFalse,
  changeTempLoadingTrue,
  handleBlockLoading,
  handleIsHeaderChecked,
  removemaintenanceIds,
  removeTempIds,
  restvehicleMaster,
} from "../../Redux/VehicleSlice/VehicleSlice";
import Spinner from "../../components/Spinner/Spinner";
import { handleDeleteAndEditAllData } from "../../Data/Function";
import { toggleVehicleUpdateModal } from "../../Redux/SideBarSlice/SideBarSlice";
import ChangeBulkVehicle from "../../components/Modal/ChangeBulkVehicle";
import { formatLocalTimeIntoISO } from "../../utils/index";
import { postData } from "../../Data/index";
// import { useState } from "react";
import { setMaintenanceType } from "../../Redux/PaginationSlice/PaginationSlice";

const BulkActionButtons = () => {
  const {
    isHeaderChecked,
    isOneOrMoreHeaderChecked,
    tempIds,
    tempLoading,
    maintenanceIds,
  } = useSelector((state) => state.vehicles);
  const { token } = useSelector((state) => state.user);
  const { vehicleMaster, blockLoading } = useSelector(
    (state) => state.vehicles
  );
  const dispatch = useDispatch();

  const toggleOptions = () => {
    dispatch(toggleVehicleUpdateModal());
  };

  const unblockVehicles = async () => {
    const currentDateAndTime = new Date();
    const endDate = formatLocalTimeIntoISO(currentDateAndTime);
    const userMills = new Date(endDate)?.getTime();

    if (!maintenanceIds) {
      return handleAsyncError(
        dispatch,
        "Unable to get Vehicles Ids! try again"
      );
    }

    const hasActiveMaintenance = vehicleMaster?.data?.some((vehicle) => {
      return vehicle?.maintenance?.some((m) => {
        console.log(
          maintenanceIds.includes(m._id) && m.endDate,
          endDate,
          m?._id
        );
        return (
          maintenanceIds.includes(m._id) &&
          new Date(m.endDate)?.getTime() > userMills
        );
      });
    });

    if (!hasActiveMaintenance)
      return handleAsyncError(dispatch, "No Active Maintenance found");

    const data = {
      maintenanceIds: maintenanceIds,
      endDate: endDate,
    };

    try {
      dispatch(handleBlockLoading(true));
      const response = await postData("/maintenanceVehicle", data, token);
      if (response.success === true) {
        dispatch(setMaintenanceType(""));
        dispatch(removeTempIds());
        dispatch(removemaintenanceIds());
        handleAsyncError(dispatch, response?.message, "success");
      } else {
        handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      handleAsyncError(
        dispatch,
        "Unable to update maintenance records! try again."
      );
    } finally {
      dispatch(handleBlockLoading(false));
    }
  };

  //   delete data in bulk
  const handleDeleteAll = () => {
    if (!tempIds)
      return handleAsyncError(dispatch, "unable to get Ids! try again.");
    const data = {
      vehicleIds: tempIds,
      deleteRec: true,
    };
    return handleDeleteAndEditAllData(
      data,
      "delete",
      handleAsyncError,
      changeTempLoadingTrue,
      changeTempLoadingFalse,
      dispatch,
      removeTempIds,
      restvehicleMaster,
      token,
      handleIsHeaderChecked
    );
  };

  return (
    <>
      {/* modal for updating vehicle data  */}
      <ChangeBulkVehicle />

      {location.pathname == "/all-vehicles" &&
        ((isHeaderChecked &&
          isHeaderChecked === true &&
          tempIds &&
          tempIds?.length > 0) ||
          (isOneOrMoreHeaderChecked &&
            isOneOrMoreHeaderChecked === true &&
            tempIds &&
            tempIds?.length > 0)) && (
          <>
            <button
              className="bg-theme font-semibold text-gray-100 px-2.5 py-1.5 rounded-md shadow-lg hover:bg-theme-light hover:shadow-md inline-flex items-center gap-1 whitespace-nowrap relative"
              onClick={toggleOptions}
            >
              {isHeaderChecked && isHeaderChecked === true
                ? "Edit All"
                : "Edit"}
            </button>
            {/* <button
              className="bg-theme font-semibold text-gray-100 px-2.5 py-1.5 rounded-md shadow-lg hover:bg-theme-light hover:shadow-md inline-flex items-center gap-1 whitespace-nowrap relative disabled:bg-gray-400"
              onClick={unblockVehicles}
              disabled={maintenanceIds?.length === 0 || blockLoading}
            >
              {blockLoading ? (
                <Spinner />
              ) : isHeaderChecked && isHeaderChecked === true ? (
                "Unblock All"
              ) : (
                "Unblock"
              )}
            </button> */}
            <button
              className="bg-theme font-semibold text-gray-100 px-2.5 py-1.5 rounded-md shadow-lg hover:bg-theme-light hover:shadow-md inline-flex items-center gap-1 whitespace-nowrap disabled:bg-gray-400"
              onClick={handleDeleteAll}
              disabled={
                !tempLoading?.loading && tempLoading?.operation === "delete"
              }
            >
              {!tempLoading?.loading && tempLoading?.operation === "delete" ? (
                <Spinner message={"deleting..."} />
              ) : isHeaderChecked && isHeaderChecked === true ? (
                "Delete All"
              ) : (
                "Delete"
              )}
            </button>
          </>
        )}
    </>
  );
};

export default BulkActionButtons;
