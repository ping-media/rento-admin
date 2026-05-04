import { useDispatch, useSelector } from "react-redux";
import { getData, postData } from "../../Data/index";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import MaintenanceTableSkeleton from "../../components/Skeleton/MaintenanceTableSkeleton";
import ChangeBulkVehicle from "../../components/Modal/ChangeBulkVehicle";
import VehicleTable from "./VehicleTable";
import { formatLocalTimeIntoISO } from "../../utils";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";

const VehicleGroupUpdate = ({
  vehicleName,
  stationId,
  vehicle,
  maintenanceVehicleId,
  setMaintenanceVehicleId,
  isMaintenanceAdd,
}) => {
  const { token } = useSelector((state) => state.user);
  const [allVehicles, setAllVehicles] = useState([]);
  // for vehicle price update in bulk
  const [vehicleIds, setVehicleIds] = useState([]);
  // for adding maintenance records in bulk
  const [bulkUnblockConfirm, setBulkUnblockConfirm] = useState(false);
  const [unblocking, setUnblocking] = useState(false);
  // const [maintenanceVehicleId, setMaintenanceVehicleId] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const FetchVehiclesId = useCallback(async () => {
    if (!vehicleName && !stationId) return null;

    setLoading(true);
    try {
      // Using URLSearchParams to handle special characters like +, (, ), spaces etc.
      const params = new URLSearchParams();
      if (vehicleName) params.append("vehicleName", vehicleName);
      if (stationId) params.append("stationId", stationId);

      const endpoint = `/getAllVehiclesIdsData?${params.toString()}`;

      const response = await getData(endpoint, token);
      if (response.status == 200) {
        const data = response?.data ?? [];
        const ids = data.length
          ? response?.data?.map((vehicle) => vehicle._id)
          : [];
        setVehicleIds(ids);
        setAllVehicles(data);
      }
    } catch (error) {
      console.log("Unable to fetch vehicle data", error);
    } finally {
      setLoading(false);
    }
  }, [token, vehicleName, stationId]);

  useEffect(() => {
    if (!vehicleName && !stationId) return;

    FetchVehiclesId();
  }, [vehicleName, stationId, isMaintenanceAdd]);

  const isAllSelected =
    allVehicles.length > 0 &&
    maintenanceVehicleId.length === allVehicles.length;

  const isIndeterminate =
    maintenanceVehicleId.length > 0 &&
    maintenanceVehicleId.length < allVehicles.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setMaintenanceVehicleId([]);
    } else {
      const allIds = allVehicles.map((v) => v._id);
      setMaintenanceVehicleId(allIds);
    }
  };

  const handleSelect = (id) => {
    setMaintenanceVehicleId((prev) => {
      if (prev.includes(id)) {
        return prev.filter((vehicleId) => vehicleId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Add this handler before return:
  const handleBulkUnblock = async () => {
    const currentDateAndTime = new Date();
    const endDate = formatLocalTimeIntoISO(currentDateAndTime);

    const maintenanceIds = allVehicles
      .filter(
        (v) => maintenanceVehicleId.includes(v._id) && v.isUnderMaintenance,
      )
      .map((v) => v.maintenanceInfo?._id)
      .filter(Boolean);

    if (maintenanceIds.length === 0) {
      setBulkUnblockConfirm(false);
      return handleAsyncError(dispatch, "No Active Maintenance found");
    }

    try {
      setUnblocking(true);
      const response = await postData(
        "/maintenanceVehicle",
        { maintenanceIds, endDate },
        token,
      );
      if (response?.success === true) {
        await FetchVehiclesId();
        setMaintenanceVehicleId([]);
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
      setUnblocking(false);
      setBulkUnblockConfirm(false);
    }
  };

  if (loading) return <MaintenanceTableSkeleton rows={2} />;

  return (
    <>
      <Suspense fallback={null}>
        <ChangeBulkVehicle
          selectedVehicleIds={vehicleIds}
          vehicle={vehicle}
          isRest={false}
        />
      </Suspense>

      {/* Bulk Unblock Confirm Modal */}
      {bulkUnblockConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80 flex flex-col gap-4">
            <h2 className="text-base font-semibold text-gray-800">
              Bulk Unblock Vehicles
            </h2>
            <p className="text-sm text-gray-500">
              Are you sure you want to unblock maintenance for{" "}
              <span className="font-semibold">
                {maintenanceVehicleId.length}
              </span>{" "}
              selected vehicle(s)?
            </p>
            <div className="flex justify-end gap-3 mt-2">
              <button
                className="px-4 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
                onClick={() => setBulkUnblockConfirm(false)}
                disabled={unblocking}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1.5 rounded-lg bg-theme text-white text-sm hover:opacity-90 disabled:opacity-50"
                onClick={handleBulkUnblock}
                disabled={unblocking}
              >
                {unblocking ? "Unblocking..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Unblock Button — only shows when 1+ vehicles selected */}
      {maintenanceVehicleId.length > 0 &&
        allVehicles.some(
          (v) => maintenanceVehicleId.includes(v._id) && v.isUnderMaintenance,
        ) && (
          <div className="flex justify-end mb-2">
            <button
              className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-sm hover:opacity-90"
              onClick={() => setBulkUnblockConfirm(true)}
            >
              Unblock Selected (
              {
                allVehicles.filter(
                  (v) =>
                    maintenanceVehicleId.includes(v._id) &&
                    v.isUnderMaintenance,
                ).length
              }
              )
            </button>
          </div>
        )}
      {/* {maintenanceVehicleId.length > 0 && (
        <div className="flex justify-end mb-2">
          <button
            className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-sm hover:opacity-90"
            onClick={() => setBulkUnblockConfirm(true)}
          >
            Unblock Selected ({maintenanceVehicleId.length})
          </button>
        </div>
      )} */}

      {allVehicles?.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          No Vehicle Data Found.
        </p>
      ) : (
        <div className="overflow-x-auto h-full md:h-[30rem] md:overflow-y-auto">
          <VehicleTable
            allVehicles={allVehicles}
            maintenanceVehicleId={maintenanceVehicleId}
            handleSelect={handleSelect}
            handleSelectAll={handleSelectAll}
            isAllSelected={isAllSelected}
            isIndeterminate={isIndeterminate}
          />
        </div>
      )}
    </>
  );
};

export default VehicleGroupUpdate;
