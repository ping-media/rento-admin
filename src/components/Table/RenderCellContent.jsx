import React from "react";
import {
  formatFullDateAndTime,
  formatNumber,
  formatPrice,
  formatTimeStampToDateNew,
} from "../../utils/index";

const RenderCellContent = (column, value, item, location) => {
  if (!value && value !== 0) return "";

  if (
    column.includes("Charges") ||
    column.includes("Deposit") ||
    column.includes("Cost") ||
    column.includes("Price")
  ) {
    return `₹ ${formatPrice(value)}`;
  }

  if (column.includes("amount")) {
    return `₹ ${formatNumber(value)}`;
  }

  if (column.includes("kmLimit")) {
    return `${value} KM` || "--";
  }

  if (column.includes("Duration")) {
    return `${value} Days`;
  }

  if (column.includes("email")) {
    return (
      <div title={value} className="truncate">
        {value}
      </div>
    );
  }

  if (location.pathname === "/all-bookings" && column.includes("DateAndTime")) {
    let newValue = value;
    if (column === "BookingEndDateAndTime") {
      const bookingPrice = item.bookingPrice ?? null;
      const preCloseData = item?.extendBooking ?? null;
      const bookingStatus = item?.bookingStatus;

      const isExtended = bookingStatus === "extended";

      if (bookingPrice === null) return "--";

      const extension =
        bookingPrice?.extendAmount?.length > 0
          ? bookingPrice?.extendAmount
          : null;

      const isLastExtensionPaid = extension
        ? extension[extension.length - 1]?.status === "paid"
        : false;

      const extendBookingDate = isLastExtensionPaid
        ? extension[extension?.length - 1]?.bookingEndDateAndTime
        : null;
      // extension !== null
      //   ? extension[extension?.length - 1]?.bookingEndDateAndTime
      //   : null;

      if (
        isExtended &&
        extendBookingDate !== null &&
        extendBookingDate !== undefined
      ) {
        newValue = extendBookingDate;
      } else if (preCloseData !== null && preCloseData?.originalEndDate) {
        newValue = preCloseData.originalEndDate;
      }
    }
    const full = formatFullDateAndTime(newValue);
    const parts = full.split(",");
    const date = `${parts[0]},${parts[1]}`.trim();
    const time = parts[2]?.trim() || "";
    return (
      <>
        <div>{date}</div>
        <div>{time}</div>
      </>
    );
  } else if (column.includes("DateAndTime")) {
    return formatFullDateAndTime(value);
  }

  if (column?.includes("InitiatedDate")) {
    return value !== "NA" ? formatTimeStampToDateNew(value) : "--";
  }

  if (column?.includes("bookingId")) {
    return `#${value}`;
  }

  if (column?.includes("paymentMethod")) {
    return value === "partiallyPay" ? "online" : value;
  }

  if (
    column?.includes("vehicleName") &&
    location.pathname === "/all-bookings"
  ) {
    return (
      <>
        <p className="w-full truncate">{value}</p>
        <p className="text-xs">
          (
          {item?.vehicleBasic?.vehicleNumber !== "unassigned"
            ? item?.vehicleBasic?.vehicleNumber
            : "--"}
          )
        </p>
      </>
    );
  }

  return value;
};

export default RenderCellContent;
