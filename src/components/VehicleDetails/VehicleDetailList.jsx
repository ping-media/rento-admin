import React from "react";
import { formatPrice } from "../../utils";

const VEHICLE_FIELD_CONFIG = [
  { key: "vehicleNumber", label: "Vehicle Number" },
  { key: "vehicleName", label: "Vehicle Name" },
  { key: "vehicleModel", label: "Vehicle Model" },
  { key: "stationName", label: "Station Name" },
  { key: "vehicleStatus", label: "Vehicle Status" },
  { key: "refundableDeposit", label: "Security Deposit", isPrice: true },
  { key: "lateFee", label: "Late Fee", isPrice: true },
  { key: "speedLimit", label: "Speed Limit" },
  { key: "freeKms", label: "Free Kms" },
  { key: "extraKmsCharges", label: "Extra Kms", isPrice: true },
  { key: "lastServiceDate", label: "Last Service Date", isDate: true },
  { key: "lastMeterReading", label: "Last Metre Reading" },
];

const formatDate = (dateStr) => {
  if (!dateStr) return "--";
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const VehicleDetailList = ({ vehicle }) => {
  if (Object.keys(vehicle) === 0) return null;

  const visibleFields = VEHICLE_FIELD_CONFIG.filter(
    ({ key }) => vehicle[key] !== undefined && vehicle[key] !== null,
  );

  return (
    <div className="border-2 p-2 border-gray-300 rounded-lg">
      {visibleFields.map(({ key, label, isPrice, isDate }, index) => {
        const value = vehicle[key];
        let displayValue = value;
        if (isDate) displayValue = formatDate(value);
        else if (isPrice) displayValue = `₹${formatPrice(Number(value))}`;

        return (
          <div
            key={key}
            className={`flex justify-between items-center text-sm py-1.5 ${
              index !== visibleFields.length - 1 ? "border-b-2" : ""
            } border-gray-300`}
          >
            <span className="font-medium capitalize">{label}</span>
            <span className="text-gray-500 capitalize">
              {String(displayValue)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default VehicleDetailList;
