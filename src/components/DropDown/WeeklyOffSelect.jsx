import ArrowSelect from "../InputAndDropdown/ArrowSelect";

export const WEEKDAYS = [
  ["none", "No weekly off"],
  ["0", "Sunday"],
  ["1", "Monday"],
  ["2", "Tuesday"],
  ["3", "Wednesday"],
  ["4", "Thursday"],
  ["5", "Friday"],
  ["6", "Saturday"],
];

// null / undefined  ->  "none", otherwise the number as a string
export const toWeeklyOffValue = (v) =>
  v === null || v === undefined ? "none" : String(v);

// "none"  ->  null, otherwise a number
export const fromWeeklyOffValue = (v) =>
  v === "none" || v === "" || v === null || v === undefined ? null : Number(v);

const WeeklyOffSelect = ({
  id = "weeklyOff",
  label = "Weekly off",
  value, // current dropdown value ("none", "0"..."6")
  savedValue, // value currently saved (same format)
  onChange, // receives the new value string
  onSave, // parent's submit handler
  saving = false,
  disabled = false, // e.g. non-admin users
}) => (
  <div className="flex items-center gap-2 text-sm">
    <label htmlFor={id} className="text-gray-600 dark:text-gray-300">
      {label}
    </label>
    <ArrowSelect
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="rounded-md border border-gray-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100"
    >
      {WEEKDAYS.map(([val, text]) => (
        <option key={val} value={val}>
          {text}
        </option>
      ))}
    </ArrowSelect>
    {!disabled && value !== savedValue && (
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-md bg-theme px-3 py-1.5 text-sm font-semibold text-white hover:bg-theme-dark disabled:bg-gray-400"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    )}
  </div>
);

export default WeeklyOffSelect;
