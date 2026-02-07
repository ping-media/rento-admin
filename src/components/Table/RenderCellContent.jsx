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
      const extendData =
        item.bookingPrice?.extendAmount?.length > 0
          ? item.bookingPrice?.extendAmount
          : null;
      const extendBookingDate =
        extendData != null
          ? extendData[extendData?.length - 1]?.bookingEndDateAndTime
          : null;

      if (extendBookingDate !== null && extendBookingDate !== undefined) {
        newValue = extendBookingDate;
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
    // return value !== "NA" ? formatTimeStampToDate(value) : "--";
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
        <p className="text-xs">({item?.vehicleBasic?.vehicleNumber})</p>
      </>
    );
  }

  return value;
};

export default RenderCellContent;
