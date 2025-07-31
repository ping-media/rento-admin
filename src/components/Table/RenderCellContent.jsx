import React from "react";
import {
  formatFullDateAndTime,
  formatPrice,
  formatTimeStampToDate,
} from "../../utils/index";

const RenderCellContent = (column, value) => {
  if (!value && value !== 0) return "";

  if (
    column.includes("Charges") ||
    column.includes("Deposit") ||
    column.includes("Cost") ||
    column.includes("Price")
  ) {
    return `₹ ${formatPrice(value)}`;
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
    const full = formatFullDateAndTime(value);
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
    return value !== "NA" ? formatTimeStampToDate(value) : "--";
  }

  if (column?.includes("bookingId")) {
    return `#${value}`;
  }

  if (column?.includes("paymentMethod")) {
    return value === "partiallyPay" ? "online" : value;
  }

  return value;
};

export default RenderCellContent;
