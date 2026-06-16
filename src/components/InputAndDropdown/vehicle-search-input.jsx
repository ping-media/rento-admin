import { useEffect, useState } from "react";
import useAvailableVehicles from "../../hooks/use-available-vehicles";
import SelectDropDownVehicle from "./SelectDropDownVehicle";

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
  const [search, setSearch] = useState("");
  const {
    vehicles,
    initialLoading,
    searchLoading,
    fetchVehicles,
    setVehicleId,
  } = useAvailableVehicles({
    stationId: booking?.stationId,
    vehicleName: booking?.vehicleName,
    bookingStartDateTime: booking?.BookingStartDateAndTime,
    bookingEndDateTime: booking?.BookingEndDateAndTime,
    excludeBookingId: booking?._id,
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

  // const displayVehicles =
  //   initialLoading && cachedVehicles ? cachedVehicles : vehicles;

  const displayVehicles =
    vehicles.length > 0 ? vehicles : (cachedVehicles ?? []);

  if (initialLoading && !cachedVehicles) {
    return <VehicleSelectorSkeleton />;
  }

  return (
    <div className="text-left w-full">
      <SelectDropDownVehicle
        item={label}
        name={name}
        // options={vehicles}
        options={displayVehicles}
        setValueChanger={setVehicleId}
        setSelectedChanger={setSelectedVehicle}
        isModalClose={isModalClose}
        isLabel={false}
        loading={searchLoading}
        onSearch={setSearch}
        defaultSelected={selectedVehicle}
      />

      {selectedVehicle && selectedVehicle?.length === 0 && (
        <p className="italic text-gray-400 mt-1">No vehicle found.</p>
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

      <div className="space-y-2">
        <div className="h-10 w-full bg-gray-100 rounded-md" />
        <div className="h-10 w-full bg-gray-100 rounded-md" />
        <div className="h-10 w-full bg-gray-100 rounded-md" />
      </div>
    </div>
  );
};
