import { useState } from "react";
import MaintenanceTable from "../Table/MaintenanceTable";
import ServiceHistory from "./ServiceHistory";

const TABS = [
  ["schedule", "Maintenance Schedule"],
  ["history", "Service History"],
];

const VehicleMaintenanceSection = ({ isMaintenanceAdd }) => {
  const [tab, setTab] = useState("schedule");

  return (
    <div>
      <div role="tablist" className="flex border-b mb-3">
        {TABS.map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            onClick={() => setTab(value)}
            className={`flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition ${
              tab === value
                ? "border-theme text-theme"
                : "border-transparent text-gray-500 hover:text-theme"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* schedule stays mounted so its data and modals are not reloaded on every tab switch */}
      <div className={tab === "schedule" ? "" : "hidden"}>
        <MaintenanceTable isMaintenanceAdd={isMaintenanceAdd} />
      </div>

      {tab === "history" && <ServiceHistory />}
    </div>
  );
};

export default VehicleMaintenanceSection;
