import React from "react";

const formatDateTime = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const formatted = `${year}-${month}-${day}T${hour}:${minutes}:${seconds}Z`;

  return formatted;
};

const MaintenanceStatusBadge = ({ maintenanceList = [] }) => {
  const currentDateTimeISO = formatDateTime();

  // Find active maintenance
  const activeMaintenance = maintenanceList.find((item) => {
    const startDate = new Date(item.startDate)
      .toISOString()
      .replace(".000Z", "Z");
    const endDate = new Date(item.endDate).toISOString().replace(".000Z", "Z");

    return (
      (startDate <= currentDateTimeISO && endDate >= currentDateTimeISO) ||
      startDate === currentDateTimeISO ||
      endDate === currentDateTimeISO
    );
  });

  // Find upcoming maintenance
  const upcomingMaintenance = maintenanceList
    .filter((item) => {
      const startDate = new Date(item.startDate).toISOString();
      const endDate = new Date(item.endDate).toISOString();
      return startDate > currentDateTimeISO && endDate > currentDateTimeISO;
    })
    .sort((a, b) => {
      const dateA = new Date(a.startDate).toISOString();
      const dateB = new Date(b.startDate).toISOString();
      return dateA.localeCompare(dateB);
    })[0];

  const isActive = !!activeMaintenance;
  const isUpcoming = !isActive && !!upcomingMaintenance;

  let reason = "No Schedule";
  if (isActive) {
    reason = activeMaintenance.reason;
  } else if (isUpcoming) {
    reason = upcomingMaintenance.reason;
  }

  let bgClass = "bg-gray-400/90";
  if (isActive) bgClass = "bg-red-500/90";
  else if (isUpcoming) bgClass = "bg-theme/90";

  return (
    <>
      {isUpcoming && (
        <div className="mb-3">
          <span className="text-xs italic p-1 bg-gray-400/60 text-gray-100 rounded-md">
            Maintenance: upcoming
          </span>
        </div>
      )}
      <span
        className={`p-1 lg:px-2 lg:py-1 ${bgClass} text-gray-100 rounded-md`}
      >
        {reason}
      </span>
    </>
  );
};

export default MaintenanceStatusBadge;
