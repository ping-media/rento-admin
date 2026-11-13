import React from "react";
import { formatNumber } from "../../utils";
import StatusChange from "../Table/StatusChange";
import CopyButton from "../Buttons/CopyButton";
import { format } from "date-fns";

const fmt = (d) => (d ? format(new Date(d), "dd MMM, yyyy") : "--");

const VEHICLE_FIELD_CONFIG = [
  { key: "vehicleNumber", label: "Vehicle Number", isCopy: true },
  { key: "vehicleName", label: "Vehicle Name" },
  { key: "vehicleModel", label: "Vehicle Model" },
  { key: "stationName", label: "Station Name" },
  { key: "vehicleStatus", label: "Vehicle Status", isStatus: true },
  { key: "refundableDeposit", label: "Security Deposit", isPrice: true },
  { key: "lateFee", label: "Late Fee", isPrice: true },
  { key: "speedLimit", label: "Speed Limit" },
  { key: "freeKms", label: "Free Kms", isRange: true },
  { key: "extraKmsCharges", label: "Extra Kms", isPrice: true },
  { key: "lastServiceDate", label: "Last Service Date", isDate: true },
  { key: "kmsRun", label: "Last Metre Reading", isRange: true },
];

const VehicleDetailList = ({ vehicle }) => {
  if (Object.keys(vehicle) === 0) return null;

  const visibleFields = VEHICLE_FIELD_CONFIG.filter(
    ({ key }) => vehicle[key] !== undefined && vehicle[key] !== null,
  );

  return (
    <div className="border-2 p-2 border-gray-300 rounded-lg">
      {visibleFields.map(
        ({ key, label, isPrice, isRange, isStatus, isCopy, isDate }, index) => {
          const value = vehicle[key];
          let displayValue = value;
          if (isDate) displayValue = fmt(value);
          else if (isRange)
            displayValue = `${formatNumber(Number(displayValue))} Km`;
          else if (isPrice) displayValue = `₹${formatNumber(Number(value))}`;

          return (
            <div
              key={key}
              className={`flex justify-between items-center text-sm py-1.5 ${
                index !== visibleFields.length - 1 ? "border-b-2" : ""
              } border-gray-300`}
            >
              <span className="font-normal capitalize">{label}</span>
              <span className="text-gray-500 font-semibold capitalize">
                {isStatus ? (
                  <StatusChange rawValue={displayValue} />
                ) : isCopy ? (
                  <div className="flex items-center">
                    {String(displayValue)}
                    <CopyButton textToCopy={displayValue} />
                  </div>
                ) : (
                  String(displayValue)
                )}
              </span>
            </div>
          );
        },
      )}
    </div>
  );
};

export default VehicleDetailList;
