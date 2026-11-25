import { format } from "date-fns";
import { useState } from "react";

const TIMELINE_DOT = {
  pending: "bg-gray-400",
  in_progress: "bg-blue-500",
  completed: "bg-amber-500",
  approved: "bg-green-600",
  rejected: "bg-red-500",
  cancelled: "bg-red-500",
  photo_removed: "bg-gray-400",
};

const TIMELINE_LABEL = {
  rejected: "Sent back",
  photo_removed: "Photo removed",
};

const formatEventDate = (at) =>
  at ? format(new Date(at), "MMM d, yyyy, hh:mm a") : "--";

const RepairTimeline = ({ items = [] }) => {
  const [view, setView] = useState("horizontal");

  return (
    <div className="border-t pt-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-base sm:text-lg">Activity</h3>

        <ViewOption view={view} setView={setView} />
      </div>

      {view === "horizontal" ? (
        <div className="overflow-x-auto pb-3">
          <div className="flex items-start min-w-max">
            {items.map((t, i) => (
              <div key={i} className="flex items-start">
                <div className="flex flex-col items-center w-36">
                  <span
                    className={`h-3 w-3 rounded-full ring-4 ring-white ${
                      TIMELINE_DOT[t.status] || "bg-gray-400"
                    }`}
                  />

                  <div className="mt-3 text-center">
                    <p className="text-sm font-medium capitalize">
                      {TIMELINE_LABEL[t.status] || t.status.replace("_", " ")}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {formatEventDate(t.at)}
                    </p>

                    {t.by && (
                      <p className="text-xs text-gray-500 mt-1 capitalize">
                        By {t.by}
                      </p>
                    )}

                    {t.note && (
                      <p className="text-xs text-gray-500 mt-1 whitespace-normal break-words">
                        {t.note}
                      </p>
                    )}
                  </div>
                </div>

                {i !== items.length - 1 && (
                  <div className="w-12 h-0.5 bg-gray-300 mt-1.5 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ol className="relative ml-1.5 border-l border-gray-300">
          {items.map((t, i) => (
            <li key={i} className="mb-3 ml-4 last:mb-0">
              <span
                className={`absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                  TIMELINE_DOT[t.status] || "bg-gray-400"
                }`}
              />

              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="text-sm font-medium capitalize">
                  {TIMELINE_LABEL[t.status] || t.status.replace("_", " ")}
                </span>

                <span className="text-xs text-gray-500">
                  {formatEventDate(t.at)}
                </span>
              </div>

              {(t.by || t.note) && (
                <p className="text-xs text-gray-500 break-words">
                  {t.by && <span className="capitalize">By {t.by}</span>}
                  {t.by && t.note ? " · " : ""}
                  {t.note}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default RepairTimeline;

const ViewOption = ({ view, setView }) => (
  <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
    <button
      type="button"
      onClick={() => setView("horizontal")}
      className={`p-1.5 rounded-md transition ${
        view === "horizontal"
          ? "bg-white shadow-sm text-theme"
          : "text-gray-500 hover:text-gray-800"
      }`}
      title="Horizontal timeline"
    >
      {/* Horizontal icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 12h16M4 12l3-3m-3 3 3 3m13-3-3-3m3 3-3 3"
        />
      </svg>
    </button>

    <button
      type="button"
      onClick={() => setView("list")}
      className={`p-1.5 rounded-md transition ${
        view === "list"
          ? "bg-white shadow-sm text-theme"
          : "text-gray-500 hover:text-gray-800"
      }`}
      title="List timeline"
    >
      {/* List icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
        />
      </svg>
    </button>
  </div>
);
