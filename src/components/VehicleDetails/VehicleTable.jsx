import { Link, useParams } from "react-router-dom";
import CheckBox from "../../components/InputAndDropdown/CheckBox";
import React from "react";

const VehicleTable = ({
  allVehicles,
  maintenanceVehicleId,
  handleSelect,
  handleSelectAll,
  isAllSelected,
  isIndeterminate,
  hasSelectable,
}) => {
  const { id } = useParams();
  const vehicleId = id ? id : null;

  return (
    <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
      {/* TABLE HEAD */}
      <thead className="bg-gray-100 sticky top-0 z-10">
        <tr>
          <th scope="col" className="px-3 py-2 text-left">
            <span
              title={!hasSelectable ? "No blocked vehicle" : undefined}
              className={!hasSelectable ? "cursor-not-allowed opacity-40" : ""}
            >
              <CheckBox
                id="select-all"
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                disabled={!hasSelectable}
                handleSelect={hasSelectable ? handleSelectAll : () => {}}
              />
            </span>
          </th>
          <th className="px-3 py-2 text-left">SL</th>
          <th className="px-3 py-2 text-left">Vehicle Number</th>
          <th className="px-3 py-2 text-center">Vehicle Status</th>
          <th className="px-3 py-2 text-center">Action</th>
        </tr>
      </thead>

      {/* TABLE BODY */}
      <tbody>
        {allVehicles.map((vehicle, index) => {
          const isCurrentVehicle = vehicleId === vehicle?._id;

          return (
            <tr
              className="border-t hover:bg-gray-50 transition"
              key={vehicle.vehicleNumber}
            >
              <td
                className="px-3 py-2 whitespace-nowrap font-medium text-gray-900"
                onClick={(e) => e.stopPropagation()}
              >
                <CheckBox
                  id={vehicle._id}
                  checked={maintenanceVehicleId.includes(vehicle._id)}
                  handleSelect={() => handleSelect(vehicle._id)}
                />
              </td>
              <td className="px-3 py-2 font-medium uppercase">{index + 1}.</td>
              <td className="px-3 py-2 font-medium uppercase">
                {vehicle.vehicleNumber}
              </td>

              <td className="px-3 py-2 text-center">
                <div className="flex flex-col items-center gap-1">
                  {vehicle.isUnderMaintenance ? (
                    <span className="p-2 rounded-md text-xs font-medium text-white bg-red-500">
                      Blocked
                    </span>
                  ) : vehicle.currentBooking !== null ? (
                    <Link
                      to={
                        vehicle.currentBooking?._id
                          ? `/all-bookings/details/${vehicle.currentBooking?._id}_${vehicle.currentBooking?.bookingId}`
                          : "#"
                      }
                      className="w-full"
                    >
                      <span className="p-2 rounded-md text-xs font-medium bg-yellow-500/35 text-yellow-800">
                        {vehicle.currentBooking.bookingId}
                      </span>
                    </Link>
                  ) : (
                    <span className="p-2 rounded-md text-xs font-medium bg-green-500/30 text-green-800">
                      Available
                    </span>
                  )}
                </div>
              </td>
              <td className="px-3 py-2 text-center capitalize">
                <Link
                  to={
                    isCurrentVehicle
                      ? "#"
                      : `/all-vehicles/details/${vehicle?._id}`
                  }
                  className={`w-full underline-offset-2 text-theme ${isCurrentVehicle ? "" : "underline"}`}
                >
                  {isCurrentVehicle ? "Viewing" : "view"}
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default VehicleTable;
