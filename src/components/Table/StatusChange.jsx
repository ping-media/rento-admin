const STATUS_STYLES = {
  active: "emerald",
  available: "emerald",
  done: "emerald",
  paid: "emerald",
  partially_paid: "emerald",
  partiallyPay: "emerald",
  completed: "emerald",
  extended: "emerald",
  ongoing: "orange",
  pending: "orange",
  refunded: "gray",
  failed: "red",
};

const STATUS_COLORS = {
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    text: "text-emerald-800",
    dot: "#059669",
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-100",
    text: "text-orange-800",
    dot: "#FFA500",
  },
  gray: {
    bg: "bg-gray-400/50",
    border: "border-gray-400/90",
    text: "text-white",
    dot: "#808080",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-100",
    text: "text-red-700",
    dot: "#E23844",
  },
};

const StatusChange = ({ item, column, width = "", rawValue }) => {
  const status = (item && column && item[column]) ?? rawValue;
  const color = STATUS_COLORS[STATUS_STYLES[status] || "red"];

  const displayStatus =
    status === "partially_paid"
      ? status.replace("_", " ")
      : location.pathname === "/all-bookings" && status === "done"
        ? "Booked"
        : location.pathname === "/all-bookings" &&
            column === "rideStatus" &&
            status === "pending"
          ? "Not Started"
          : status;
  return (
    <div
      className={`p-1 lg:py-1.5 lg:px-2.5 border ${width} ${color.bg} ${color.border} rounded-md flex justify-center min-w-24 items-center uppercase gap-1`}
    >
      <svg
        width="5"
        height="6"
        viewBox="0 0 5 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="2.5" cy="3" r="2.5" fill={color.dot}></circle>
      </svg>
      <span className={`font-medium text-sm md:text-xs ${color.text}`}>
        {displayStatus}
      </span>
    </div>
  );
};

export default StatusChange;
