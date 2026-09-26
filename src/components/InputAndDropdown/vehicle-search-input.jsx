import { Suspense, useEffect, useState } from "react";
import useAvailableVehicles from "../../hooks/use-available-vehicles";
import SelectDropDownVehicle from "./SelectDropDownVehicle";
import { UnblockDialog } from "../../components/VehicleDetails/VehicleGroupUpdate";
import { formatLocalTimeIntoISO } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { postData } from "../../Data";

const VehicleSearchInput = ({
  booking,
  selectedVehicle,
  setSelectedVehicle,
  isModalClose = false,
  label = "Vehicle",
  name = "vehicleTableId",
  cachedVehicles = null,
  onVehiclesCached = null,
}) => {
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [unblockTarget, setUnblockTarget] = useState(null);
  const [unblocking, setUnblocking] = useState(false);
  const {
    vehicles,
    initialLoading,
    searchLoading,
    fetchVehicles,
    setVehicleId,
    blockedVehicles,
  } = useAvailableVehicles({
    stationId: booking?.stationId,
    vehicleName: booking?.vehicleName,
    bookingStartDateTime: booking?.BookingStartDateAndTime,
    bookingEndDateTime: booking?.BookingEndDateAndTime,
    excludeBookingId: booking?.vehicleTableId !== null ? booking?._id : null,
    limit: 10,
  });

  useEffect(() => {
    if (cachedVehicles !== null && search.trim() === "") return; // skip if we already have cached data
    const timer = setTimeout(() => {
      fetchVehicles(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (
      !initialLoading &&
      vehicles.length > 0 &&
      onVehiclesCached &&
      cachedVehicles === null
    ) {
      onVehiclesCached(vehicles);
    }
  }, [vehicles, initialLoading]);

  const displayVehicles =
    vehicles.length > 0 ? vehicles : (cachedVehicles ?? []);

  const handleUnblockVehicle = async () => {
    if (!unblockTarget) return;
    const endDate = formatLocalTimeIntoISO(new Date());

    try {
      setUnblocking(true);
      const response = await postData(
        "/maintenanceVehicle",
        { maintenanceIds: [unblockTarget.maintenanceId], endDate },
        token,
      );
      if (response?.success === true) {
        handleAsyncError(dispatch, response?.message, "success");
        await fetchVehicles(search);
      } else {
        handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      handleAsyncError(dispatch, "Unable to unblock vehicle! try again.");
    } finally {
      setUnblocking(false);
      setUnblockTarget(null);
    }
  };

  if (initialLoading && !cachedVehicles) {
    return <VehicleSelectorSkeleton />;
  }

  return (
    <div className="text-left w-full">
      <SelectDropDownVehicle
        item={label}
        name={name}
        options={displayVehicles}
        setValueChanger={setVehicleId}
        setSelectedChanger={setSelectedVehicle}
        isModalClose={isModalClose}
        isLabel={false}
        loading={searchLoading}
        onSearch={setSearch}
        defaultSelected={selectedVehicle}
        blockedOptions={blockedVehicles}
        onUnblock={setUnblockTarget}
      />

      {selectedVehicle && selectedVehicle?.length === 0 && (
        <p className="italic text-gray-400 mt-1">No vehicle found.</p>
      )}

      {unblockTarget && (
        <Suspense fallback={null}>
          <UnblockDialog
            setBulkUnblockConfirm={() => setUnblockTarget(null)}
            handleBulkUnblock={handleUnblockVehicle}
            unblocking={unblocking}
            maintenanceVehicleId={[unblockTarget.vehicleId]}
            variant="booking"
          />
        </Suspense>
      )}
    </div>
  );
};

export default VehicleSearchInput;

const VehicleSelectorSkeleton = () => {
  return (
    <div className="animate-pulse w-full">
      <div className="h-4 w-20 bg-gray-200 rounded mb-2" />

      <div className="h-12 w-full bg-gray-200 rounded-md mb-2" />
    </div>
  );
};
