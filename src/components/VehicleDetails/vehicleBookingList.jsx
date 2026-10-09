import React from "react";
import { formatFullDateAndTime } from "../../utils";

const VehicleBookingList = ({ currentBooking }) => {
  if (currentBooking === null) return null;

  const bookingData = [
    {
      label: "Booking Id",
      value: `#${currentBooking.bookingId}`,
    },
    {
      label: "Pickup Date",
      value: formatFullDateAndTime(currentBooking.BookingStartDateAndTime),
    },
    {
      label: "Dropoff Date",
      value: formatFullDateAndTime(currentBooking.BookingEndDateAndTime),
    },
  ];

  return (
    <>
      <div className="border-2 p-2 border-gray-300 rounded-lg">
        {bookingData.map((data, index) => (
          <div
            key={data.label}
            className={`flex justify-between items-center text-sm py-1.5 ${
              index !== bookingData.length - 1 ? "border-b-2" : ""
            } border-gray-300`}
          >
            <span className="font-medium capitalize">{data.label}</span>

            <span className="text-gray-500 capitalize">{data.value}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default VehicleBookingList;
