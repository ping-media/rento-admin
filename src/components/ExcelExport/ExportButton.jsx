import React, { useState } from "react";
import { exportToExcel } from "../../utils/ExportFile";
import { tableIcons } from "../../Data/Icons";
import { getFullData } from "../../Data/index";
import { useDispatch, useSelector } from "react-redux";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import Spinner from "../../components/Spinner/Spinner";
import { useLocation } from "react-router-dom";
import { transformUsers } from "./data/user";
import { transformBookings } from "./data/booking";
import { transformVehicles } from "./data/vehicle";

const EXPORT_CONFIG = {
  "/all-users": {
    endpoint: "/getAllUsers?userType=customer&page=1&limit=1000",
    reportName: "Customers",
    transform: transformUsers,
  },
  "/all-bookings": {
    endpoint: "/getBooking?&page=1&limit=1000",
    reportName: "Booking",
    transform: transformBookings,
  },
  "/all-vehicles": {
    endpoint: "/getAllVehiclesData?page=1&limit=1000",
    reportName: "Vehicles",
    transform: transformVehicles,
  },
};

const ExportButton = () => {
  const { pathname } = useLocation();
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const config = EXPORT_CONFIG[pathname];

  if (!config) return null;

  const handleExport = async () => {
    try {
      setLoading(true);

      const response = await getFullData(config.endpoint, token);

      if (response?.status !== 200) {
        handleAsyncError(dispatch, "Unable to get data! try again");
        return;
      }

      const rawData = response?.data?.data || [];
      const exportData = config.transform(rawData);

      if (!exportData.length) return;

      const now = new Date();
      const timestamp = now
        .toISOString() // → "2025-09-18T06:12:34.567Z"
        .replace(/T/, "_") // → "2025-09-18_06:12:34.567Z"
        .replace(/\..+/, ""); // → "2025-09-18_06:12:34"

      exportToExcel(
        exportData,
        `RentoBikes_${config.reportName}_Report_${timestamp}`,
      );
    } catch (error) {
      console.error(error?.message);
      handleAsyncError(dispatch, "Unable to generate excel sheet! try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="border hover:border-theme hover:text-theme bg-white rounded-md shadow-md p-2 lg:p-2.5 flex items-center transition-all duration-200 ease-in disabled:bg-gray-200"
      disabled={loading}
    >
      {!loading ? <>{tableIcons?.download} CSV</> : <Spinner />}
    </button>
  );
};

export default ExportButton;
