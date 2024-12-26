const StatusChange = ({ item, column }) => {
  // console.log(item[column], item, column);
  return (
    <div
      className={`py-1.5 px-2.5 ${
        item[column] == "active" ||
        item[column] == "available" ||
        item[column] == "done" ||
        item[column] == "paid" ||
        item[column] == "partiallyPay" ||
        item[column] == "partially_paid"
          ? "bg-emerald-50"
          : "bg-red-50"
      } rounded-full flex justify-center w-20 items-center gap-1`}
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
            item[column] == "active" ||
            item[column] == "available" ||
            item[column] == "done" ||
            item[column] == "paid" ||
            item[column] == "partiallyPay" ||
            item[column] == "partially_paid"
              ? "#059669"
              : "#E23844"
          }`}
        ></circle>
      </svg>
      <span
        className={`font-medium text-xs ${
          item[column] == "active" ||
          item[column] == "available" ||
          item[column] == "done" ||
          item[column] == "paid" ||
          item[column] == "partiallyPay" ||
          item[column] == "partially_paid"
            ? "text-emerald-600"
            : "text-red-600"
        }`}
      >
        {item[column]}
      </span>
    </div>
  );
};

export default StatusChange;
