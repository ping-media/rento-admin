const StatusChange = ({ item, column }) => {
  return (
    <div
      className={`p-1 lg:py-1.5 lg:px-2.5 border ${
        item[column] === "active" ||
        item[column] === "available" ||
        item[column] == "done" ||
        item[column] === "paid" ||
        item[column] === "partially_paid" ||
        item[column] === "partiallyPay" ||
        item[column] === "completed" ||
        item[column] === "extended"
          ? "bg-emerald-50 border-emerald-100"
          : item[column] === "ongoing" || item[column] === "pending"
          ? "bg-orange-50 border-orange-100"
          : item[column] === "refunded"
          ? "bg-gray-400/50 border-gray-400/90"
          : item[column] === "failed"
          ? "bg-red-100 border-red-200"
          : "bg-red-50 border-red-100"
      } rounded-md flex justify-center w-24 items-center uppercase gap-1`}
    >
      <svg
        width="5"
        height="6"
        viewBox="0 0 5 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="2.5"
          cy="3"
          r="2.5"
          fill={`${
            item[column] === "active" ||
            item[column] === "available" ||
            item[column] === "done" ||
            item[column] === "paid" ||
            item[column] === "partially_paid" ||
            item[column] === "partiallyPay" ||
            item[column] === "completed" ||
            item[column] === "extended"
              ? "#059669"
              : item[column] == "ongoing" || item[column] === "pending"
              ? "#FFA500"
              : item[column] === "refunded"
              ? // ? "#FFC145"
                "#808080"
              : item[column] === "failed"
              ? "#C62300"
              : "#E23844"
          }`}
        ></circle>
      </svg>
      <span
        className={`font-medium text-xs ${
          item[column] === "active" ||
          item[column] === "available" ||
          item[column] === "done" ||
          item[column] === "paid" ||
          item[column] === "partially_paid" ||
          item[column] === "partiallyPay" ||
          item[column] === "completed" ||
          item[column] === "extended"
            ? "text-emerald-600"
            : item[column] === "ongoing" || item[column] === "pending"
            ? "text-orange-600"
            : item[column] === "refunded"
            ? "text-white"
            : item[column] === "failed"
            ? "text-red-700"
            : "text-red-600"
        }`}
      >
        {item[column] === "partially_paid"
          ? item[column].replace("_", " ")
          : location.pathname === "/all-bookings" && item[column] === "done"
          ? "Booked"
          : item[column]}
      </span>
    </div>
  );
};

export default StatusChange;
