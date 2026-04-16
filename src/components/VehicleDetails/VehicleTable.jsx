import { Link } from "react-router-dom";
import CheckBox from "../../components/InputAndDropdown/CheckBox";
import React from "react";

const VehicleTable = ({
  allVehicles,
  maintenanceVehicleId,
  handleSelect,
  handleSelectAll,
  isAllSelected,
  isIndeterminate,
}) => {
  return (
    <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
      {/* TABLE HEAD */}
      <thead className="bg-gray-100 sticky top-0 z-10">
        <tr>
          <th scope="col" className="px-3 py-2 text-left cursor-pointer">
            <CheckBox
              id="select-all"
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              handleSelect={handleSelectAll}
            />
          </th>
          <th className="px-3 py-2 text-left">SL</th>
          <th className="px-3 py-2 text-left">Vehicle Number</th>
          <th className="px-3 py-2 text-center">Station Name</th>
          <th className="px-3 py-2 text-center">Under Maintenance</th>
          <th className="px-3 py-2 text-center">Action</th>
        </tr>
      </thead>

      {/* TABLE BODY */}
      <tbody>
        {allVehicles.map((vehicle, index) => (
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

            <td className="px-3 py-2 text-center capitalize">
              {vehicle.stationName}
            </td>
            <td className="px-3 py-2 text-center capitalize">
              <span
                className={`px-2 py-1 rounded-full ${vehicle.isUnderMaintenance ? "text-theme bg-theme/10 border-theme" : "text-gray-500 bg-gray-200 border-gray-300"}`}
              >
                {vehicle.isUnderMaintenance ? "Yes" : "No"}
              </span>
            </td>
            <td className="px-3 py-2 text-center capitalize">
              <Link
                to={`/all-vehicles/details/${vehicle?._id}`}
                className="w-full underline underline-offset-2 text-theme"
              >
                view
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default VehicleTable;
