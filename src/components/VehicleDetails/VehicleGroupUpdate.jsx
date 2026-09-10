import { useDispatch, useSelector } from "react-redux";
import { getData, postData } from "../../Data/index";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
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
  const [vehicleStats, setVehicleStats] = useState({
    freeCount: 0,
    actualFreeCount: 0,
    reservedByPendingBookings: 0,
  });
  // for vehicle price update in bulk
  const [vehicleIds, setVehicleIds] = useState([]);
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // for adding maintenance records in bulk
  const [bulkUnblockConfirm, setBulkUnblockConfirm] = useState(false);
  const [unblocking, setUnblocking] = useState(false);
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
        setVehicleStats({
          freeCount: response?.freeCount ?? 0,
          actualFreeCount: response?.actualFreeCount ?? 0,
          reservedByPendingBookings: response?.reservedByPendingBookings ?? 0,
        });
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

  const filteredVehicles = allVehicles.filter((vehicle) => {
    if (!vehicleFilter) return true;

    switch (vehicleFilter) {
      case "maintenance":
        return vehicle.isUnderMaintenance;

      case "available":
        return !vehicle.currentBooking && !vehicle.isUnderMaintenance;

      case "unavailable":
        return !!vehicle.currentBooking && !vehicle.isUnderMaintenance;

      default:
        return true;
    }
  });

  // const isAllSelected =
  //   filteredVehicles.length > 0 &&
  //   maintenanceVehicleId.length === filteredVehicles.length;

  // const isIndeterminate =
  //   maintenanceVehicleId.length > 0 &&
  //   maintenanceVehicleId.length < filteredVehicles.length;

  const selectableVehicles = filteredVehicles.filter(
    (v) => !v.currentBooking && !v.isUnderMaintenance,
  );

  const effectiveMax =
    vehicleStats.actualFreeCount > 0 &&
    vehicleStats.actualFreeCount < selectableVehicles.length
      ? vehicleStats.actualFreeCount
      : selectableVehicles.length;

  const isAllSelected =
    effectiveMax > 0 && maintenanceVehicleId.length >= effectiveMax;

  const isIndeterminate =
    maintenanceVehicleId.length > 0 &&
    maintenanceVehicleId.length < effectiveMax;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setMaintenanceVehicleId([]);
    } else {
      // const allIds = filteredVehicles.map((v) => v._id);
      // setMaintenanceVehicleId(allIds);
      const selectableVehicles = filteredVehicles.filter(
        (v) => !v.currentBooking && !v.isUnderMaintenance,
      );

      // if no filter applied, cap selection to actualFreeCount to respect pending reservations
      const capped =
        vehicleStats.actualFreeCount > 0 &&
        vehicleStats.actualFreeCount < selectableVehicles.length
          ? selectableVehicles.slice(0, vehicleStats.actualFreeCount)
          : selectableVehicles;

      setMaintenanceVehicleId(capped.map((v) => v._id));
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
      <div className="flex items-center justify-between mb-3">
        <FilterDropdown
          {...{
            isFilterOpen,
            setIsFilterOpen,
            setVehicleFilter,
            vehicleFilter,
          }}
        />

        {maintenanceVehicleId.length > 0 &&
          filteredVehicles.some(
            (v) => maintenanceVehicleId.includes(v._id) && v.isUnderMaintenance,
          ) && (
            <button
              className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-sm hover:opacity-90"
              onClick={() => setBulkUnblockConfirm(true)}
            >
              Unblock Selected (
              {
                filteredVehicles.filter(
                  (v) =>
                    maintenanceVehicleId.includes(v._id) &&
                    v.isUnderMaintenance,
                ).length
              }
              )
            </button>
          )}
      </div>

      {filteredVehicles?.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          No Vehicle Data Found.
        </p>
      ) : (
        <>
          {vehicleStats.reservedByPendingBookings > 0 && (
            <div className="mb-3 px-3 py-2 rounded-md bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm">
              ⚠️ <strong>{vehicleStats.reservedByPendingBookings}</strong>{" "}
              vehicle
              {vehicleStats.reservedByPendingBookings > 1
                ? "s are"
                : " is"}{" "}
              reserved by pending bookings. Only{" "}
              <strong>{vehicleStats.actualFreeCount}</strong> out of{" "}
              <strong>{vehicleStats.freeCount}</strong> free vehicles are safe
              to block.
            </div>
          )}
          <div className="overflow-x-auto h-full md:h-[30rem] md:overflow-y-auto">
            <VehicleTable
              // allVehicles={allVehicles}
              allVehicles={filteredVehicles}
              maintenanceVehicleId={maintenanceVehicleId}
              handleSelect={handleSelect}
              handleSelectAll={handleSelectAll}
              isAllSelected={isAllSelected}
              isIndeterminate={isIndeterminate}
            />
          </div>
        </>
      )}
    </>
  );
};

export default VehicleGroupUpdate;

const FilterDropdown = ({
  isFilterOpen,
  setIsFilterOpen,
  setVehicleFilter,
  vehicleFilter,
}) => {
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");

  useEffect(() => {
    if (!isFilterOpen || !dropdownRef.current) return;

    const rect = dropdownRef.current.getBoundingClientRect();

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Approximate dropdown height
    const dropdownHeight = 220;

    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      setDropdownPosition("top");
    } else {
      setDropdownPosition("bottom");
    }
  }, [isFilterOpen]);

  const handleVehicleFilter = (value) => {
    setVehicleFilter((prev) => (prev === value ? "" : value));
    setIsFilterOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-56">
      <button
        type="button"
        onClick={() => setIsFilterOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm"
      >
        <span>
          {vehicleFilter === ""
            ? "All Vehicles"
            : vehicleFilter === "maintenance"
              ? "Blocked"
              : vehicleFilter === "available"
                ? "Available"
                : "Booking"}
        </span>

        <svg
          className={`h-4 w-4 transition-transform duration-200 ${
            isFilterOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isFilterOpen && (
        <div
          // className="absolute z-20 mt-1 w-full rounded-md border bg-white shadow-lg"
          className={`absolute z-20 w-full rounded-md border bg-white shadow-lg ${
            dropdownPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {[
            ["maintenance", "Blocked"],
            ["available", "Available"],
            ["unavailable", "Booking"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => handleVehicleFilter(value)}
              className={`flex w-full items-center justify-between px-3 py-2 text-left hover:bg-gray-100 ${
                vehicleFilter === value ? "bg-theme/10 text-theme" : ""
              }`}
            >
              {label}

              {vehicleFilter === value && (
                <span className="text-xs font-medium">✓</span>
              )}
            </button>
          ))}

          {vehicleFilter && (
            <>
              <hr />
              <button
                type="button"
                onClick={() => {
                  setVehicleFilter("");
                  setIsFilterOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-red-500 hover:bg-red-50"
              >
                Clear Filter
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
