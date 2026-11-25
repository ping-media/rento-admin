const BookingStatusFlag = ({ title, rides, flag }) => {
  const status = rides?.[flag] || "";

  const statusClass =
    (status === "partially_paid" && "bg-orange-400") ||
    (status === "partiallyPay" && "bg-orange-400") ||
    (status === "pending" && "bg-theme") ||
    (status === "inactive" && "bg-theme") ||
    (status === "failed" && "bg-theme") ||
    (status === "canceled" && "bg-theme") ||
    (status === "refundInt" && "bg-orange-400") ||
    (status === "refunded" && "bg-gray-400") ||
    (status === "paid" && "bg-green-500 bg-opacity-80") ||
    (status === "active" && "bg-green-500 bg-opacity-80") ||
    (status === "done" && "bg-green-500 bg-opacity-80") ||
    (status === "completed" && "bg-green-500 bg-opacity-80") ||
    (status === "extended" && "bg-green-500 bg-opacity-80") ||
    (status === "ongoing" && "bg-orange-600 bg-opacity-80");

  const formattedStatus =
    flag === "bookingStatus"
      ? status === "done"
        ? "Confirmed"
        : status.replace("_", " ")
      : flag === "rideStatus"
        ? status === "pending"
          ? "Not Started"
          : status.replace("_", " ")
        : status.replace("_", " ");

  return (
    <p className="text-md text-semibold">
      <span className="hidden font-semibold text-gray-500 lg:inline">
        {title}:
      </span>

      <span
        className={`${statusClass} ml-2 cursor-pointer rounded-full px-4 py-1 capitalize text-white`}
      >
        {formattedStatus || "N/A"}
      </span>
    </p>
  );

  // return (
  //   <>
  //     <p className="text-md text-semibold">
  //       <span className="hidden lg:inline font-semibold text-gray-500">
  //         {title}:
  //       </span>
  //       <span
  //         className={`${
  //           (status === "partially_paid" && "bg-orange-400") ||
  //           (status === "partiallyPay" && "bg-orange-400") ||
  //           (status === "pending" && "bg-theme") ||
  //           (status === "inactive" && "bg-theme") ||
  //           (status === "failed" && "bg-theme") ||
  //           (status === "canceled" && "bg-theme") ||
  //           (status === "refundInt" && "bg-orange-400") ||
  //           (status === "refunded" && "bg-gray-400") ||
  //           (status === "paid" && "bg-green-500 bg-opacity-80") ||
  //           (status === "active" && "bg-green-500 bg-opacity-80") ||
  //           (status === "done" && "bg-green-500 bg-opacity-80") ||
  //           (status === "completed" && "bg-green-500 bg-opacity-80") ||
  //           (status === "extended" && "bg-green-500 bg-opacity-80") ||
  //           (status === "ongoing" && "bg-orange-600 bg-opacity-80")
  //         } text-white px-4 py-1 rounded-full cursor-pointer capitalize ml-2`}
  //       >
  //         {flag === "bookingStatus"
  //           ? rides[flag] === "done"
  //             ? "Confirmed"
  //             : rides[flag].replace("_", " ")
  //           : flag === "rideStatus"
  //             ? rides[flag] === "pending"
  //               ? "Not Started"
  //               : rides[flag].replace("_", " ")
  //             : rides[flag].replace("_", " ")}
  //       </span>
  //     </p>
  //   </>
  // );
};

export default BookingStatusFlag;
