import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";

const useVehicleChangeData = () => {
  const { vehicleMaster, vehiclePickupImage } = useSelector(
    (state) => state.vehicles,
  );

  const booking = useMemo(() => vehicleMaster?.[0] ?? null, [vehicleMaster]);

  const [oldMeterReading] = useState(
    booking?.pickupImage !== null ? booking?.pickupImage?.startMeterReading : 0,
  );
  const [EndMeterReading] = useState(
    booking?.pickupImage !== null ? booking?.pickupImage?.endMeterReading : 0,
  );

  const pickupData = useMemo(() => {
    const vehiclePickupImageData =
      vehiclePickupImage?.[0]?.data?.updatedData ?? [];
    const vehicleMasterPickupImageData =
      booking?.pickupImage?.data?.updatedData ?? [];

    return vehiclePickupImageData.length > 0
      ? vehiclePickupImageData
      : vehicleMasterPickupImageData.length > 0
        ? vehicleMasterPickupImageData
        : [];
  }, [vehiclePickupImage, booking]);

  const previousVehiclesKm = useMemo(() => {
    return pickupData.reduce((sum, entry) => {
      const ran = Math.max(
        0,
        Number(entry.oldVehicleEndMeterReading || 0) -
          Number(entry.startMeterReading || 0),
      );
      return sum + ran;
    }, 0);
  }, [pickupData]);

  const hasVehicleChanges = pickupData.length > 0;

  return {
    pickupData,
    previousVehiclesKm,
    hasVehicleChanges,
    booking,
    oldMeterReading,
    EndMeterReading,
  };
};

export default useVehicleChangeData;
