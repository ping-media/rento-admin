export const REPAIR_TYPES = [
  ["repair", "General Repair"],
  ["periodic_service", "Periodic Service"],
  ["accident", "Accident Repair"],
  ["other", "Other"],
];
export const COST_CATEGORIES = ["parts", "labour", "other"];
export const MAX_PHOTOS = 4;
export const INPUT_CLS = "w-full border rounded-md px-4 py-3 text-sm";
export const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
export const personName = (u) =>
  u ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : "--";
export const bookingDetailsPath = (id) => `/all-bookings/details/${id}`;
