import MonthlyReport from "../components/MaintenanceReports/MonthlyReport";
import useMaintenanceReports from "../hooks/use-maintenance-reports"; // REPORT_TABS,
// import FleetSummary from "../components/MaintenanceReports/FleetSummary";
import LifetimeModal from "../components/MaintenanceReports/LifetimeModal";
// import TitleAndButton from "../components/Header/TitleAndButton";
import ArrowSelect from "../components/InputAndDropdown/ArrowSelect";
import { useState } from "react";
import TablePageHeader from "../components/Table/TablePageHeader";

const MaintenanceReports = () => {
  const r = useMaintenanceReports();
  const [inputSearchQuery, setInputSearchQuery] = useState("");

  return (
    <>
      {/* {r.tab === "monthly" ? ( */}
      <div className="mb-3">
        <TablePageHeader
          inputSearchQuery={inputSearchQuery}
          setInputSearchQuery={setInputSearchQuery}
          bookingData={[]}
        />
      </div>
      {/* ) : ( */}
      {/* <TitleAndButton className="hidden md:flex mb-3" /> */}
      {/* )} */}

      {/* <div className="flex flex-wrap gap-2 mb-4">
        {REPORT_TABS.map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => r.setTab(value)}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              r.tab === value
                ? "bg-theme text-white border-theme"
                : "border-gray-300 hover:border-theme hover:text-theme"
            }`}
          >
            {label}
          </button>
        ))}
      </div> */}

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <FilterSelect value={r.stationId} onChange={r.setStation}>
          <option value="">All stations</option>
          {r.stations.map((s) => (
            <option key={s._id} value={s.stationId}>
              {s.stationName}
            </option>
          ))}
        </FilterSelect>

        <input
          type="month"
          value={r.month}
          onChange={(e) => r.setMonth(e.target.value)}
          className="block w-full sm:w-48 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        />

        {r.hasFilters && (
          <button
            type="button"
            onClick={r.clearFilters}
            className="px-3 py-2 text-sm rounded-md border border-gray-300 bg-white hover:border-theme hover:text-theme"
          >
            Clear
          </button>
        )}
      </div>

      <MonthlyReport
        rows={r.rows}
        loading={r.loading}
        onOpenVehicle={r.openLifetime}
        pagination={{
          page: r.page,
          limit: r.limit,
          totalPages: r.totalPages,
          setPage: r.setPage,
          setLimit: r.setLimit,
        }}
      />

      {/* {r.tab === "monthly" && (
        <MonthlyReport
          month={r.month}
          setMonth={r.setMonth}
          data={r.monthly}
          loading={r.loading}
          onOpenVehicle={r.openLifetime}
        />
      )} */}

      {/* {r.tab === "fleet" && (
        <FleetSummary
          from={r.from}
          setFrom={r.setFrom}
          to={r.to}
          setTo={r.setTo}
          data={r.fleet}
          loading={r.loading}
          onOpenVehicle={r.openLifetime}
        />
      )} */}

      <LifetimeModal lifetime={r.lifetime} onClose={r.closeLifetime} />
    </>
  );
};

export default MaintenanceReports;

const FilterSelect = ({ value, onChange, children }) => (
  <ArrowSelect
    wrapperClassName="w-[49%] sm:w-48"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm capitalize"
  >
    {children}
  </ArrowSelect>
);
