import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useListParams from "../../hooks/use-list-params";
import { getFullData, postData } from "../../Data/index";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { fmtDuration, fmtTime, istDate } from "../../utils/attendance";
import ArrowSelect from "../InputAndDropdown/ArrowSelect";

const STATUS = {
  present: {
    label: "Present",
    cls: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  },
  half_day: {
    label: "Half Day",
    cls: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300",
  },
  absent: {
    label: "Absent",
    cls: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300",
  },
  weekly_off: {
    label: "Weekly Off",
    cls: "bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-gray-300",
  },
  pending: {
    label: "Today",
    cls: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
  },
  none: {
    label: "No record",
    cls: "bg-gray-50 text-gray-400 dark:bg-slate-800 dark:text-gray-500",
  },
};

const WEEKDAYS = [
  ["none", "No weekly off"],
  ["0", "Sunday"],
  ["1", "Monday"],
  ["2", "Tuesday"],
  ["3", "Wednesday"],
  ["4", "Thursday"],
  ["5", "Friday"],
  ["6", "Saturday"],
];

const shiftMonth = (month, delta) => {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1 + delta, 1)).toISOString().slice(0, 7);
};

const monthLabel = (month) =>
  new Date(`${month}-01T12:00:00Z`).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

const dayParts = (date) => ({
  num: Number(date.slice(8)),
  weekday: new Date(`${date}T12:00:00Z`).toLocaleDateString("en-IN", {
    weekday: "short",
    timeZone: "UTC",
  }),
});

// dot colors: check-in red = late, green = on time; check-out amber = left early
const inDot = (d) =>
  !d.checkIn || d.flags?.late == null
    ? "bg-gray-300"
    : d.flags.late
      ? "bg-red-500"
      : "bg-green-500";

const outDot = (d) =>
  !d.checkOut || d.flags?.earlyLeave == null
    ? "bg-gray-300"
    : d.flags.earlyLeave
      ? "bg-amber-400"
      : "bg-green-500";

const TimeLine = ({ dot, value }) => (
  <div className="flex items-center gap-2">
    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} />
    <span className="tabular-nums text-gray-800 dark:text-gray-100">
      {value}
    </span>
  </div>
);

const Chevron = ({ dir }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points={dir === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
  </svg>
);

const DayRow = ({ day }) => {
  const { num, weekday } = dayParts(day.date);
  const st = STATUS[day.status] || STATUS.none;
  const showTimes = [
    "present",
    "half_day",
    "absent",
    "weekly_off",
    "pending",
    "none",
  ].includes(day.status);
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <div className="w-12 shrink-0 text-center">
        <div className="text-lg font-semibold leading-tight text-gray-800 dark:text-gray-100">
          {num}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {weekday}
        </div>
      </div>

      {/* <div className="min-w-0 flex-1 space-y-1 text-sm"> */}
      <div className="min-w-0 flex-1 space-y-1 text-sm sm:flex sm:items-center sm:gap-10 sm:space-y-0">
        {showTimes && (
          <>
            <TimeLine dot={inDot(day)} value={fmtTime(day.checkIn)} />
            <TimeLine dot={outDot(day)} value={fmtTime(day.checkOut)} />
          </>
        )}
      </div>

      <div className="shrink-0 text-right">
        <span
          className={`inline-block min-w-[92px] rounded-lg px-3 py-1.5 text-center text-sm font-semibold ${st.cls}`}
        >
          {st.label}
        </span>
        {day.workedMinutes != null ? (
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {fmtDuration(day.workedMinutes)}
          </div>
        ) : day.flags?.missingCheckOut ? (
          <div className="mt-1 text-xs text-red-500">No check-out</div>
        ) : null}
      </div>
    </li>
  );
};

const AttendanceMonth = ({ userId, isAdmin, refreshKey = 0 }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { month: monthParam, updateParams } = useListParams();

  const currentMonth = istDate().slice(0, 7);
  const month = monthParam || currentMonth;

  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [weeklyOffValue, setWeeklyOffValue] = useState("none");
  const [savingOff, setSavingOff] = useState(false);

  const savedWeeklyOff =
    data?.user?.weeklyOff === null || data?.user?.weeklyOff === undefined
      ? "none"
      : String(data.user.weeklyOff);

  // reset the dropdown whenever a different person or fresh data loads
  useEffect(() => {
    setWeeklyOffValue(savedWeeklyOff);
  }, [data?.user?._id, savedWeeklyOff]);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ month });
      if (isAdmin) params.set("userId", userId);
      const res = await getFullData(
        `/attendance/month?${params.toString()}`,
        token,
      );
      const body = res?.data;
      if (res?.status == 200 && body?.status === 200) {
        setData(body.data);
        setMessage("");
      } else {
        setData(null);
        setMessage(body?.message || "Unable to load attendance");
      }
    } catch (error) {
      handleAsyncError(dispatch, error?.message);
    } finally {
      setLoading(false);
    }
  }, [userId, isAdmin, month, token, dispatch]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const saveWeeklyOff = async () => {
    setSavingOff(true);
    try {
      const response = await postData(
        "/change-user-profile",
        { _id: userId, weeklyOff: weeklyOffValue },
        token,
      );
      if (response?.status === 200) {
        handleAsyncError(dispatch, "Weekly off updated", "success");
        load();
      } else {
        handleAsyncError(
          dispatch,
          response?.message || "Unable to update weekly off",
        );
      }
    } catch (error) {
      handleAsyncError(dispatch, error?.message);
    } finally {
      setSavingOff(false);
    }
  };

  const goTo = (next) =>
    updateParams({ month: next === currentMonth ? "" : next });

  if (!userId) {
    return (
      <p className="mt-6 text-center text-sm text-gray-500">
        {isAdmin
          ? "Select a manager or fleet member from Filters (top right) to see their attendance."
          : "Loading..."}
      </p>
    );
  }

  const s = data?.summary;
  const chip = "rounded-full bg-gray-100 px-2.5 py-1 dark:bg-slate-700";

  return (
    <div className="w-full">
      {/* month switcher */}
      <div className="mb-3 flex items-center justify-between rounded-xl bg-gray-100 px-2 py-2 dark:bg-slate-700">
        <button
          type="button"
          aria-label="Previous month"
          className="rounded-lg p-2 text-gray-700 hover:bg-white/70 dark:text-gray-100 dark:hover:bg-slate-600"
          onClick={() => goTo(shiftMonth(month, -1))}
        >
          <Chevron dir="left" />
        </button>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          {monthLabel(month)}
        </span>
        <button
          type="button"
          aria-label="Next month"
          className="rounded-lg p-2 text-gray-700 hover:bg-white/70 disabled:opacity-30 dark:text-gray-100 dark:hover:bg-slate-600"
          disabled={month >= currentMonth}
          onClick={() => goTo(shiftMonth(month, 1))}
        >
          <Chevron dir="right" />
        </button>
      </div>

      {isAdmin && data?.user && (
        <div className="mb-3 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p className="text-sm font-medium capitalize text-gray-700 dark:text-gray-200">
            {data.user.firstName} {data.user.lastName}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <label
              htmlFor="weeklyOff"
              className="text-gray-600 dark:text-gray-300"
            >
              Weekly off
            </label>
            <ArrowSelect
              id="weeklyOff"
              value={weeklyOffValue}
              onChange={(e) => setWeeklyOffValue(e.target.value)}
              className="rounded-md border border-gray-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100"
            >
              {WEEKDAYS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </ArrowSelect>
            {weeklyOffValue !== savedWeeklyOff && (
              <button
                type="button"
                onClick={saveWeeklyOff}
                disabled={savingOff}
                className="rounded-md bg-theme px-3 py-1.5 text-sm font-semibold text-white hover:bg-theme-dark disabled:bg-gray-400"
              >
                {savingOff ? "Saving..." : "Save"}
              </button>
            )}
          </div>
        </div>
      )}

      {s && (
        <div className="mb-3 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-300">
          <span className={chip}>Present {s.present}</span>
          <span className={chip}>Half day {s.halfDay}</span>
          <span className={chip}>Absent {s.absent}</span>
          <span className={chip}>Off {s.weeklyOff}</span>
          <span className={chip}>Total {fmtDuration(s.workedMinutes)}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-xl bg-white shadow dark:bg-slate-800">
        {loading && !data ? (
          <p className="px-4 py-8 text-center text-sm text-gray-500">
            Loading...
          </p>
        ) : !data?.days?.length ? (
          <p className="px-4 py-8 text-center text-sm text-gray-500">
            {message || "No days to show for this month"}
          </p>
        ) : (
          <ul
            className={`divide-y divide-gray-100 dark:divide-slate-700 ${
              loading ? "opacity-60" : ""
            }`}
          >
            {data.days.map((day) => (
              <DayRow key={day.date} day={day} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AttendanceMonth;
