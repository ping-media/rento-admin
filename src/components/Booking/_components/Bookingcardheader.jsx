import React from "react";
import BookingStatusFlag from "../BookingStatusFlag";

const BookingCardHeader = ({ title, flag_title, booking, booking_flag }) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-base lg:text-lg font-semibold text-gray-500 hidden md:flex items-center">
        {title}
      </h2>
      <h2 className="text-base lg:text-lg font-semibold text-gray-500 flex md:hidden items-center">
        {flag_title}
      </h2>
      <BookingStatusFlag
        title={flag_title}
        rides={booking}
        flag={booking_flag}
      />
    </div>
  );
};

export default BookingCardHeader;
