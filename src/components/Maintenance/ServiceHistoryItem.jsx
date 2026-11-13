import { bookingDetailsPath, money, personName } from "../../utils/maintenance";
import { format } from "date-fns";

const fmt = (d) => (d ? format(new Date(d), "dd MMM, yyyy") : "--");
// const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-IN") : "--");

const Field = ({ label, children }) => (
  <div>
    <div className="text-xs text-gray-500">{label}</div>
    <div className="text-sm break-words">{children || "--"}</div>
  </div>
);

const ServiceHistoryItem = ({ item, open, onToggle }) => (
  <div className="border rounded-md bg-white overflow-hidden">
    <button
      type="button"
      aria-expanded={open}
      onClick={onToggle}
      className="w-full flex items-start gap-3 p-3 text-left hover:bg-gray-50"
    >
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs border border-theme text-theme rounded-full px-2 py-0.5 capitalize">
            {item.type.replace("_", " ")}
          </span>
          <span className="text-xs text-gray-500">{fmt(item.approvedAt)}</span>
        </div>
        <p className="mt-1 text-sm font-medium truncate">
          {item.problemDescription}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <span className="font-semibold text-sm">{money(item.totalCost)}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </button>

    <div
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
      aria-hidden={!open}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="border-t p-3 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {item.bookingId && (
              <Field label="Booking">
                <Link
                  to={bookingDetailsPath(item.bookingId._id)}
                  className="text-theme underline"
                >
                  {item.bookingId.bookingId}
                </Link>
              </Field>
            )}
            <Field label="Mechanic">{personName(item.mechanicId)}</Field>
            {item.bookingId ? (
              <Field label="Meter (before → after)">
                {`${item.serviceReadings?.readingBeforeService ?? "--"} → ${item.serviceReadings?.readingAfterService ?? "--"} km`}
              </Field>
            ) : (
              <Field label="Odometer">
                {item.odometerReading != null
                  ? `${item.odometerReading} km`
                  : ""}
              </Field>
            )}
            <Field label="Completed">{fmt(item.completedAt)}</Field>
            <Field label="Approved">{fmt(item.approvedAt)}</Field>
          </div>

          {item.mechanicNotes && (
            <Field label="Notes">{item.mechanicNotes}</Field>
          )}

          <div>
            <div className="text-xs text-gray-500 mb-1">Expenses</div>
            <div className="border rounded-md">
              {item.expenses.length === 0 && (
                <div className="p-2 text-sm text-gray-400 italic text-center">
                  No expense lines.
                </div>
              )}
              {item.expenses.map((e) => (
                <div
                  key={e._id}
                  className="flex justify-between gap-2 px-2 py-1.5 text-sm border-b last:border-b-0"
                >
                  <span className="capitalize min-w-0 break-words">
                    {e.description}{" "}
                    <i className="text-gray-400">
                      (
                      {e.entryType === "adjustment" ? "adjustment" : e.category}
                      )
                    </i>
                  </span>
                  <span className="shrink-0">{money(e.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          {item.attachments?.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 mb-1">Photos</div>
              <div className="flex flex-wrap gap-2">
                {item.attachments.map((a) => (
                  <a
                    key={a._id || a.url}
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="relative"
                  >
                    <img
                      src={a.url}
                      loading="lazy"
                      className="h-16 w-16 object-cover rounded border"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ServiceHistoryItem;
