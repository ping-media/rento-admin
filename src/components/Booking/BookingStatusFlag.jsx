const BookingStatusFlag = ({ title, rides, flag }) => {
  return (
    <>
      <p className="text-md text-semibold">
        <span className="hidden lg:inline font-semibold text-gray-500">
          {title}:
        </span>
        <span
          className={`${
            (rides[flag] === "partially_paid" && "bg-orange-400") ||
            (rides[flag] === "pending" && "bg-theme") ||
            (rides[flag] === "failed" && "bg-theme") ||
            (rides[flag] === "canceled" && "bg-theme") ||
            (rides[flag] === "paid" && "bg-green-500 bg-opacity-80") ||
            (rides[flag] === "done" && "bg-green-500 bg-opacity-80") ||
            (rides[flag] === "ongoing" && "bg-orange-600 bg-opacity-80")
          } text-gray-100 px-4 py-1 rounded-full cursor-pointer capitalize ml-2`}
        >
          {rides[flag].replace("_", " ")}
        </span>
      </p>
    </>
  );
};

export default BookingStatusFlag;
