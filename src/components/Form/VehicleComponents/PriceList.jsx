import React from "react";
import { camelCaseToSpaceSeparated, formatPrice } from "../../../utils/index";

const PriceList = ({
  options,
  bookingData,
  isGSTActive,
  selectedVehicle,
  extendBooking,
}) => {
  return (
    <>
      {options.map((key, index) => {
        if (!isGSTActive && key === "tax") {
          return null;
        }

        const value = selectedVehicle
          ? selectedVehicle?.bookingPrice?.[key]
          : bookingData?.bookingPrice?.[key];

        if (value !== undefined || value !== 0) {
          if (bookingData?.bookingPrice?.[key] === 0) {
            return null;
          }

          if (extendBooking?.duration > 0 && key === "totalPrice") {
            return (
              <React.Fragment key={index}>
                <li className="capitalize">
                  Extend Ride: ₹{formatPrice(extendBooking?.amount)} X{" "}
                  {extendBooking?.duration} day(s)
                </li>
                <li className="capitalize font-semibold">
                  Total Price: ₹{formatPrice(value + extendBooking?.amount)}
                </li>
              </React.Fragment>
            );
          }

          return (
            <li
              className={`capitalize ${
                key === "discountTotalPrice" || key === "totalPrice"
                  ? "font-semibold"
                  : ""
              }`}
              key={index}
            >
              {key != "extraAddonPrice"
                ? camelCaseToSpaceSeparated(key)
                : "Additional Charges"}
              : ₹
              {key === "rentAmount" || key === "extraAddonPrice"
                ? key === "rentAmount" &&
                  bookingData?.bookingPrice?.isPackageApplied
                  ? `${formatPrice(bookingData?.bookingPrice?.bookingPrice)}`
                  : formatPrice(value)
                : extendBooking && key === "totalPrice"
                ? formatPrice(value + extendBooking?.amount)
                : formatPrice(value)}
            </li>
          );
        } else {
          return null;
        }
      })}
    </>
  );
};

export default PriceList;
