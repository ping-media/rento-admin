import React, { useState } from "react";
import { exportToExcel } from "../../utils/ExportFile";
import { tableIcons } from "../../Data/Icons";
import { getFullData } from "../../Data/index";
import { useDispatch, useSelector } from "react-redux";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import {
  formatFullDateAndTime,
  getDurationBetweenDates,
} from "../../utils/index";
import Spinner from "../../components/Spinner/Spinner";

const ExportButton = () => {
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleExport = async () => {
    try {
      setLoading(true);

      const response = await getFullData(
        "/getBooking?&page=1&limit=1000",
        token
      );

      if (response?.status !== 200) {
        handleAsyncError(dispatch, "Unable to get data! try again");
        return;
      }

      const data = response?.data?.data || [];

      const exportData = data.map((item) => {
        // --- handle booking end date from extend ---
        const extendAmount = item.bookingPrice?.extendAmount || [];
        let BookingEndDateAndTime = item?.BookingEndDateAndTime;

        if (extendAmount.length > 0) {
          const lastExtend = extendAmount[extendAmount.length - 1];
          if (lastExtend?.bookingEndDateAndTime) {
            BookingEndDateAndTime = lastExtend.bookingEndDateAndTime;
          }
        }

        // --- duration ---
        let Duration = "";
        if (item?.BookingStartDateAndTime && BookingEndDateAndTime) {
          const { days, hours } = getDurationBetweenDates(
            item?.BookingStartDateAndTime,
            BookingEndDateAndTime
          );
          Duration = `${days} days ${hours > 0 ? `${hours} hours` : ""}`;
        }

        // --- prices ---
        const bookingPrice =
          item?.bookingPrice?.isDiscountZero === true ||
          (item?.bookingPrice?.discountTotalPrice &&
            item?.bookingPrice?.discountTotalPrice !== 0)
            ? item?.bookingPrice?.discountTotalPrice
            : item?.bookingPrice?.totalPrice;

        const extendPrice = extendAmount.reduce((sum, extend) => {
          if (extend?.status === "paid") {
            return (
              sum +
              Number(extend?.amount || 0) +
              Number(extend?.addOnAmount || 0) +
              Number(extend?.tax || 0) +
              Number(extend?.addonTax || 0)
            );
          }
          return sum;
        }, 0);

        const diffAmount = item.bookingPrice?.diffAmount || [];
        const diffPrice = diffAmount.reduce((sum, diff) => {
          if (diff?.status === "paid") {
            const debit = Number(diff?.amount || 0);
            const credit = Number(diff?.refundAmount || 0);
            return sum + (debit - credit);
          }
          return sum;
        }, 0);

        const newBookingPrice = bookingPrice + extendPrice + diffPrice;

        // --- final row object ---
        return {
          BookingId: item?.bookingId,
          PickupDateAndTime:
            item?.BookingStartDateAndTime &&
            formatFullDateAndTime(item?.BookingStartDateAndTime),
          DropDateAndTime: formatFullDateAndTime(BookingEndDateAndTime),
          Duration,
          CustomerName: `${item?.userId?.firstName || ""} ${
            item?.userId?.lastName || ""
          }`,
          CustomerNumber: item?.contact,
          VehicleModel: `${item?.vehicleBrand || ""} ${
            item?.vehicleName || ""
          }`,
          VehicleNumber: item?.vehicleBasic?.vehicleNumber,
          TotalAmount: newBookingPrice,
          PaymentStatus: item.paymentStatus,
          BookingStatus:
            item?.bookingStatus === "done" ? "confirmed" : item?.bookingStatus,
          RideStatus: item?.rideStatus,
        };
      });

      if (exportData.length > 0) {
        const now = new Date();
        const timestamp = now
          .toISOString() // → "2025-09-18T06:12:34.567Z"
          .replace(/T/, "_") // → "2025-09-18_06:12:34.567Z"
          .replace(/\..+/, ""); // → "2025-09-18_06:12:34"

        exportToExcel(exportData, `RentoBikes_Booking_Report_${timestamp}`);
      }
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
