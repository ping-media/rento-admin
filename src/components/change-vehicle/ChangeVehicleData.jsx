import useVehicleChangeData from "../../hooks/use-vehicle-change-data";
import React from "react";

const ChangeVehicleData = () => {
  const {
    pickupData,
    booking,
    oldMeterReading,
    EndMeterReading,
    previousVehiclesKm,
  } = useVehicleChangeData();

  return (
    <>
      <div className="text-left">
        <h3 className="font-semibold text-lg text-gray-600 mb-2">
          Distance Breakdown:
        </h3>

        {/* Previous vehicles from updatedData */}
        {(pickupData ?? [])?.map((entry, index) => {
          const driven = Math.max(
            0,
            Number(entry.oldVehicleEndMeterReading || 0) -
              Number(entry.startMeterReading || 0),
          );
          return (
            <div key={index} className="mb-3 border-b pb-2">
              <p className="font-semibold text-medium text-gray-700">
                {entry.vehicleNumber}:
              </p>
              <p className="text-base text-gray-500">
                Start reading: {entry.startMeterReading} Km
              </p>
              <p className="text-base text-gray-500">
                End reading: {entry.oldVehicleEndMeterReading} Km
              </p>
              <p className="text-base text-gray-500">
                Distance driven: {driven} Km
              </p>
            </div>
          );
        })}

        {/* Current vehicle */}
        <div className="mb-3 border-b pb-2">
          <p className="font-semibold text-medium text-gray-700">
            {booking?.vehicleBasic?.vehicleNumber}:
          </p>
          <p className="text-base text-gray-500">
            Start reading: {oldMeterReading} Km
          </p>
          <p className="text-base text-gray-500">
            End reading: {EndMeterReading} Km
          </p>
          <p className="text-base text-gray-500">
            Distance driven:{" "}
            {Math.max(
              0,
              Number(EndMeterReading || 0) - Number(oldMeterReading),
            )}{" "}
            Km
          </p>
        </div>

        {/* Totals */}
        <div className="mt-2">
          <p className="font-bold text-base text-gray-700">
            Total Km driven:{" "}
            {Math.max(
              0,
              Number(EndMeterReading || 0) - Number(oldMeterReading),
            ) + previousVehiclesKm}{" "}
            Km
          </p>
          <p className="font-bold text-base text-gray-700">
            Km limit:{" "}
            {Number(booking?.vehicleBasic?.freeLimit || 0) +
              (
                booking?.bookingPrice?.extendAmount?.filter(
                  (e) => e.status === "paid",
                ) || []
              ).reduce((s, e) => s + Number(e?.freeLimit || 0), 0)}{" "}
            Km
          </p>
          <p className="font-bold text-base text-gray-700">
            Extra Km:{" "}
            {Math.max(
              0,
              Math.max(
                0,
                Number(EndMeterReading || 0) - Number(oldMeterReading),
              ) +
                previousVehiclesKm -
                (Number(booking?.vehicleBasic?.freeLimit || 0) +
                  (
                    booking?.bookingPrice?.extendAmount?.filter(
                      (e) => e.status === "paid",
                    ) || []
                  ).reduce((s, e) => s + Number(e?.freeLimit || 0), 0)),
            )}{" "}
            Km
          </p>
        </div>
      </div>
    </>
  );
};

export default ChangeVehicleData;
