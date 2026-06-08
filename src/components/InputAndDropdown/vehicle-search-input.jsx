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
}) => {
  const [search, setSearch] = useState(booking?.vehicleName || "");
  const {
    vehicles,
    initialLoading,
    searchLoading,
    fetchVehicles,
    vehicleId,
    setVehicleId,
  } = useAvailableVehicles({
    stationId: booking?.stationId,
    bookingStartDateTime: booking?.BookingStartDateAndTime,
    bookingEndDateTime: booking?.BookingEndDateAndTime,
    excludeBookingId: booking?._id,
    initialSearch: booking?.vehicleName,
    limit: 10,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVehicles(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  if (initialLoading) {
    return <VehicleSelectorSkeleton />;
  }

  return (
    <div className="text-left w-full">
      <SelectDropDownVehicle
        item={label}
        name={name}
        options={vehicles}
        setValueChanger={setVehicleId}
        setSelectedChanger={setSelectedVehicle}
        isModalClose={isModalClose}
        isLabel={false}
        loading={searchLoading}
        onSearch={setSearch}
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
