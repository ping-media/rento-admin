const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      })
    : "";

const titleCase = (s) =>
  (s || "").replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const transformMaintenanceExpenses = (rows = []) =>
  rows.map((r, i) => ({
    "S.No": i + 1,
    Date: fmtDate(r.expenseDate),
    "Vehicle Number": (r.vehicleNumber || "").toUpperCase(),
    Station: titleCase(r.stationName),
    "Work Type": titleCase(r.workType),
    Category: titleCase(r.category),
    Description: r.description || "",
    "Entry Type": titleCase(r.entryType),
    "Amount (INR)": r.amount,
  }));
