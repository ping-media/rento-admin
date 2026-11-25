import { useSelector } from "react-redux";
import useListParams from "../../hooks/use-list-params";
import { getAttendanceRange } from "../../utils/attendance";
import StationFilter from "../SideBar/StationFilter";

const inputClass =
  "block rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100";

const AttendanceFilters = () => {
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.userType === "admin";
  const { dateFrom, dateTo, stationId, setStationId, updateParams } =
    useListParams();
  const { from, to } = getAttendanceRange({ dateFrom, dateTo, isAdmin });

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="text-xs text-gray-600 dark:text-gray-300">
        From
        <input
          type="date"
          className={inputClass}
          value={from}
          max={to}
          onChange={(e) => updateParams({ dateFrom: e.target.value })}
        />
      </label>
      <label className="text-xs text-gray-600 dark:text-gray-300">
        To
        <input
          type="date"
          className={inputClass}
          value={to}
          min={from}
          onChange={(e) => updateParams({ dateTo: e.target.value })}
        />
      </label>
      {isAdmin && (
        <div className="min-w-[220px]">
          <StationFilter
            compact
            stationId={stationId}
            setStationId={setStationId}
          />
        </div>
      )}
    </div>
  );
};

export default AttendanceFilters;
