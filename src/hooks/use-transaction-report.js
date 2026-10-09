import { useState } from "react";
import { useSelector } from "react-redux";
import { getData } from "../Data";
import { exportToExcel } from "../utils/ExportFile";

const transformReportRows = (rows) => {
  return rows.map((row) => ({
    "Booking ID": row.bookingId,
    "Transaction Type": row.transactionType,
    "Transaction Date": row.transactionDate,
    "Amount (₹)": row.amount,
    "Late Fee (₹)": row.lateFee || 0,
    "Additional Fee (₹)": row.additionalFee || 0,
    "Payment Method": row.paymentMethod,
    "Payment Status": row.paymentStatus,
    "Pay Success ID": row.paySuccessId || "",
    // "Order ID": row.orderId || "",
    "RRN Number": row.rrnNumber || "",
    "Customer Name": row.customerName || "",
    "Customer Email": row.customerEmail || "",
    "Customer Phone": row.customerPhone || "",
    "Station Name": row.stationName || "",
    "Vehicle Name": row.vehicleName || "",
    "Vehicle Brand": row.vehicleBrand || "",
    "Vehicle Number": row.vehicleNumber || "",
    "Booking Start": row.bookingStartDate || "",
    "Booking End": row.bookingEndDate || "",
  }));
};

const useTransactionReport = () => {
  const [loading, setLoading] = useState(false);
  const { loggedInRole, userStation, token } = useSelector(
    (state) => state.user,
  );

  const downloadReport = async ({ date, startDate, endDate }) => {
    try {
      setLoading(true);

      const stationParam =
        loggedInRole === "manager"
          ? `&stationId=${userStation?.stationId}`
          : "";
      const params = date
        ? `date=${date}`
        : `startDate=${startDate}&endDate=${endDate}`;

      const res = await getData(
        `/getTransactionReport?${params}${stationParam}`,
        token,
      );

      if (res?.status !== 200 || !res?.data?.rows?.length) {
        return { success: false, message: "No data found for this period" };
      }

      const exportData = transformReportRows(res.data.rows);

      const label = date ? date : `${startDate}_to_${endDate}`;

      exportToExcel(exportData, `RentoBikes_Transactions_${label}`);

      return { success: true };
    } catch (error) {
      return { success: false, message: error?.message };
    } finally {
      setLoading(false);
    }
  };

  return { downloadReport, loading };
};

export default useTransactionReport;
