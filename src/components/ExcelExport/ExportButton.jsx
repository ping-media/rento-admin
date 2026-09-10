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
    endpoint: "/admin/getAllUsers?userType=customer&page=1&limit=1000",
    reportName: "Customers",
    transform: transformUsers,
  },
  "/all-bookings": {
    endpoint: "/getBooking?page=1&limit=1000",
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
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const dispatch = useDispatch();

  const config = EXPORT_CONFIG[pathname];

  if (!config) return null;

  const handleExport = async () => {
    try {
      setLoading(true);

      const baseUrl = config.endpoint.split("?")[0];
      const existingParams = new URLSearchParams(
        config.endpoint.split("?")[1] || "",
      );

      const limit = 500;
      const concurrency = 3; // safe parallel requests
      let allData = [];

      // First call (to get totalPages)
      const firstParams = new URLSearchParams(existingParams);
      firstParams.set("page", 1);
      firstParams.set("limit", limit);

      const firstRes = await getFullData(`${baseUrl}?${firstParams}`, token);

      if (firstRes?.status !== 200) {
        handleAsyncError(dispatch, "Unable to get data! try again");
        return;
      }

      const totalPages = firstRes?.data?.pagination?.totalPages || 1;
      allData = [...(firstRes?.data?.data || [])];
      setProgress({ current: 0, total: totalPages * limit });

      // Prepare remaining pages
      const remainingPages = Array.from(
        { length: totalPages - 1 },
        (_, i) => i + 2,
      );

      // Process in batches (avoids API overload)
      for (let i = 0; i < remainingPages.length; i += concurrency) {
        const batch = remainingPages.slice(i, i + concurrency);

        const requests = batch.map((page) => {
          const params = new URLSearchParams(existingParams);
          params.set("page", page);
          params.set("limit", limit);

          return getFullData(`${baseUrl}?${params}`, token);
        });

        const responses = await Promise.all(requests);

        let tempCount = 0;

        responses.forEach((res) => {
          if (res?.status === 200) {
            const data = res?.data?.data || [];
            allData.push(...data);
            tempCount += data?.length;
          }
        });

        setProgress((prev) => ({
          ...prev,
          current: prev.current + tempCount,
        }));
      }

      // const response = await getFullData(config.endpoint, token);

      // if (response?.status !== 200) {
      //   handleAsyncError(dispatch, "Unable to get data! try again");
      //   return;
      // }

      // const rawData = response?.data?.data || [];
      const rawData = allData;
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

  // const percent = progress.total
  //   ? Math.floor((progress.current / progress.total) * 100)
  //   : 0;

  return (
    <button
      onClick={handleExport}
      className="border hover:border-theme hover:text-theme bg-white rounded-md shadow-md p-2 lg:p-2.5 flex items-center transition-all duration-200 ease-in disabled:bg-gray-200"
      disabled={loading}
    >
      {!loading ? <>{tableIcons?.download} CSV</> : <Spinner />}
      {/* {!loading ? (
        <>{tableIcons?.download} CSV</>
      ) : (
        <CircularProgress progress={percent} />
      )} */}
    </button>
  );
};

export default ExportButton;

// const CircularProgress = ({ progress = 0, size = 18, stroke = 2 }) => {
//   const radius = (size - stroke) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const offset = circumference - (progress / 100) * circumference;

//   return (
//     <svg width={size} height={size}>
//       <circle
//         cx={size / 2}
//         cy={size / 2}
//         r={radius}
//         stroke="#e5e7eb"
//         strokeWidth={stroke}
//         fill="none"
//       />
//       <circle
//         cx={size / 2}
//         cy={size / 2}
//         r={radius}
//         stroke="#DE2A1B"
//         strokeWidth={stroke}
//         fill="none"
//         strokeDasharray={circumference}
//         strokeDashoffset={offset}
//         strokeLinecap="round"
//         style={{ transition: "stroke-dashoffset 0.3s ease" }}
//       />
//     </svg>
//   );
// };
