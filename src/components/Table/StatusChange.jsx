const StatusChange = ({ item, column }) => {
  return (
    <div
      className={`py-1.5 px-2.5 ${
        item[column] == "active" ||
        item[column] == "available" ||
        item[column] == "done" ||
        item[column] == "paid" ||
        item[column] == "partially_paid" ||
        item[column] == "partiallyPay" ||
        item[column] == "completed"
          ? "bg-emerald-50"
          : item[column] == "ongoing"
          ? "bg-orange-50"
          : "bg-red-50"
      } rounded-full flex justify-center w-24 items-center gap-1`}
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
            item[column] === "completed"
              ? "#059669"
              : item[column] == "ongoing"
              ? "#FFA500"
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
          item[column] === "completed"
            ? "text-emerald-600"
            : item[column] == "ongoing"
            ? "text-orange-600"
            : "text-red-600"
        }`}
      >
        {item[column] === "partially_paid"
          ? item[column].replace("_", " ")
          : item[column]}
      </span>
    </div>
  );
};

export default StatusChange;
