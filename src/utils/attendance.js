const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export const istDate = (offsetDays = 0) =>
  new Date(Date.now() + IST_OFFSET_MS + offsetDays * 86400000)
    .toISOString()
    .slice(0, 10);

// admin defaults to today, manager/fleet to the last 7 days
export const getAttendanceRange = ({ dateFrom, dateTo, isAdmin }) => ({
  from: dateFrom || (isAdmin ? istDate() : istDate(-6)),
  to: dateTo || istDate(),
});

export const fmtTime = (iso) =>
  iso
    ? new Date(iso)
        .toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        })
        .toUpperCase()
    : "--";

export const fmtDate = (d) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

export const fmtDuration = (mins) =>
  mins === null || mins === undefined
    ? ""
    : `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, "0")}m`;
