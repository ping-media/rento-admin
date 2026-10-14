import React from "react";
import { formatFullDateAndTime } from "../../utils";
import { Link } from "react-router-dom";

const VehicleBookingList = ({ currentBooking }) => {
  if (currentBooking === null) return null;

  const bookingData = [
    {
      label: "Booking Id",
      value: `#${currentBooking.bookingId}`,
      isLink: true,
    },
    {
      label: "Pickup Date",
      value: formatFullDateAndTime(currentBooking.BookingStartDateAndTime),
      isLink: false,
    },
    {
      label: "Dropoff Date",
      value: formatFullDateAndTime(currentBooking.BookingEndDateAndTime),
      isLink: false,
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

            {data.isLink ? (
              <Link
                className="text-gray-500 font-semibold sm:hover:underline hover:no-underline underline-offset-4 capitalize"
                to={`/all-bookings/details/${currentBooking?._id}_${currentBooking?.bookingId}`}
              >
                {data.value}
              </Link>
            ) : (
              <span className="text-gray-500 font-semibold capitalize">
                {data.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default VehicleBookingList;
