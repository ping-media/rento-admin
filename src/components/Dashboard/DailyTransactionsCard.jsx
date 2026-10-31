import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getData } from "../../Data";
import { TransactionRowsLoader } from "../Skeleton/dashboard/TransactionListSkeleton";
import { formatPrice } from "../../utils";
import { monthNames } from "../../Data/commonData";

const PAGE_SIZE = 20;
const pad = (n) => String(n).padStart(2, "0");
const formatLong = (d) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const TYPE_LABEL = {
  booking: "Main Booking",
  extension: "Extension",
  vehicleChange: "Vehicle Change",
};

const FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Bookings", value: "booking" },
  { label: "Extensions", value: "extension" },
  { label: "Vehicle Change", value: "vehicleChange" },
];

const DailyTransactionsCard = ({
  token,
  loggedInRole,
  stationId,
  selectedMonth,
}) => {
  const now = new Date();
  const today = now.toLocaleDateString("en-CA"); // YYYY-MM-DD, local time
  const isCurrentMonth =
    selectedMonth === `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

  // month bounds from the dropdown value, e.g. "October 2026"
  const [monthName, yearStr] = (selectedMonth || "").split(" ");
  const monthIdx = Math.max(monthNames.indexOf(monthName), 0);
  const year = Number(yearStr) || now.getFullYear();
  const lastDay = new Date(year, monthIdx + 1, 0).getDate();
  const monthStart = `${year}-${pad(monthIdx + 1)}-01`;
  const monthEnd = isCurrentMonth
    ? today
    : `${year}-${pad(monthIdx + 1)}-${pad(lastDay)}`;

  // view / date / filter reset by themselves whenever the month changes
  const initialUi = {
    month: selectedMonth,
    view: isCurrentMonth ? "today" : "month", // today | month | date
    date: "",
    filter: "all",
  };
  const [uiState, setUiState] = useState(initialUi);
  const ui = uiState.month === selectedMonth ? uiState : initialUi;
  const updateUi = (patch) => setUiState({ ...ui, ...patch });
  const { view, date, filter } = ui;

  const stationParam =
    loggedInRole === "manager" && stationId ? `&stationId=${stationId}` : "";
  const dateParams =
    view === "today"
      ? `date=${today}`
      : view === "date" && date
        ? `date=${date}`
        : `startDate=${monthStart}&endDate=${monthEnd}`;
  const baseQuery = `${dateParams}&type=${filter}${stationParam}`;

  // page resets to 1 automatically whenever the query changes
  const [pageState, setPageState] = useState({ key: "", page: 1 });
  const page = pageState.key === baseQuery ? pageState.page : 1;
  const loadMore = () => setPageState({ key: baseQuery, page: page + 1 });

  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    const load = async () => {
      if (page === 1) {
        setLoading(true);
        setLoadingMore(false);
        setRows([]);
        setMeta(null);
      } else {
        setLoadingMore(true);
      }
      try {
        const res = await getData(
          `/getGraphDayDetail?${baseQuery}&page=${page}&limit=${PAGE_SIZE}`,
          token,
        );
        if (cancelled) return;
        if (res?.status === 200) {
          setMeta(res.data);
          setRows((prev) =>
            page === 1 ? res.data.breakdown : [...prev, ...res.data.breakdown],
          );
        }
      } catch (e) {
        console.error("Transactions fetch failed:", e);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [token, baseQuery, page]);

  const viewLabel =
    view === "today"
      ? formatLong(today)
      : view === "date"
        ? formatLong(date)
        : `${monthName} ${year}${isCurrentMonth ? " (till date)" : ""}`;

  return (
    <div className="flex flex-col h-[420px] lg:h-0 lg:min-h-full overflow-hidden rounded-2xl bg-white shadow-lg">
      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-2 border-b px-4 py-3">
        <div>
          <h2 className="text-base font-bold text-theme">
            {view === "today" ? "Today's Transactions" : "Transactions"}
          </h2>
          <p className="text-xs text-gray-500">
            {viewLabel}
            {meta && (
              <>
                {" · "}
                {meta.count} txns · Total{" "}
                <span className="font-semibold text-theme">
                  ₹{formatPrice(meta.total)}
                </span>
              </>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
          className={`flex items-center gap-1 whitespace-nowrap rounded-md border border-theme px-3 py-1 text-xs transition-all duration-150 ${
            showFilters
              ? "bg-theme text-white"
              : "text-theme hover:bg-theme hover:text-white"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filter
        </button>
      </div>

      {/* view + calendar */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3">
          {isCurrentMonth && (
            <button
              type="button"
              onClick={() => updateUi({ view: "today", date: "" })}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition-all duration-150 ${
                view === "today"
                  ? "border-theme bg-theme text-white"
                  : "border-theme/40 text-theme hover:border-theme"
              }`}
            >
              Today
            </button>
          )}
          <button
            type="button"
            onClick={() => updateUi({ view: "month", date: "" })}
            className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition-all duration-150 ${
              view === "month"
                ? "border-theme bg-theme text-white"
                : "border-theme/40 text-theme hover:border-theme"
            }`}
          >
            {isCurrentMonth ? "This month" : "Full month"}
          </button>
          <input
            type="date"
            min={monthStart}
            max={monthEnd}
            value={view === "date" ? date : ""}
            onClick={(e) => e.currentTarget.showPicker?.()}
            onChange={(e) =>
              e.target.value
                ? updateUi({ view: "date", date: e.target.value })
                : updateUi({
                    view: isCurrentMonth ? "today" : "month",
                    date: "",
                  })
            }
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs outline-none ${
              view === "date"
                ? "border-theme bg-theme/10 text-theme"
                : "border-theme/40 text-gray-600"
            }`}
          />
        </div>
      )}

      {/* filters */}
      <div className="border-b px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto overflow-y-hidden">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateUi({ filter: opt.value })}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition-all duration-150 ${
                filter === opt.value
                  ? "border-theme bg-theme text-white"
                  : "border-theme/40 text-theme hover:border-theme"
              }`}
            >
              {opt.label}
              {meta && (
                <span className="ml-1 opacity-70">
                  ({meta.counts?.[opt.value] ?? 0})
                </span>
              )}
            </button>
          ))}
        </div>

        {filter !== "all" && meta && (
          <p className="mt-2 text-xs text-gray-500">
            Subtotal:{" "}
            <span className="font-semibold text-theme">
              ₹{(meta.totals?.[filter] ?? 0).toLocaleString()}
            </span>
          </p>
        )}
      </div>

      {/* list */}
      <div className="flex-1 overflow-y-auto px-4">
        {loading && <TransactionRowsLoader rows={6} />}

        {!loading && !rows.length && (
          <p className="py-10 text-center text-sm text-gray-400">
            No transactions today
          </p>
        )}

        {!loading &&
          rows.map((item, i) => {
            const shortId = item.bookingId?.split("_")[0];
            return (
              <Link
                key={i}
                to={
                  item.booking_id
                    ? `/all-bookings/details/${item.booking_id}_${shortId}`
                    : "#"
                }
                className="block"
              >
                <div className="flex items-center justify-between border-b py-2 last:border-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      #{item.bookingId}
                    </p>
                    <p className="text-xs capitalize text-gray-400">
                      {TYPE_LABEL[item.type] || item.type}
                      {" · "}
                      {item.paymentMethod}
                    </p>
                    {item.customer && (
                      <p className="truncate text-xs capitalize text-gray-400">
                        {item.customer.firstName} {item.customer.lastName}
                      </p>
                    )}
                    {view !== "today" && item.paymentDateFormatted && (
                      <p className="text-xs text-gray-400">
                        {item.paymentDateFormatted}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 pl-2 text-right">
                    <p className="text-sm font-bold text-theme">
                      ₹{formatPrice(item.amount)}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        item.paymentStatus === "paid"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {item.paymentStatus}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

        {!loading && meta?.pagination?.hasNextPage && (
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="my-3 w-full rounded-md border border-theme py-2 text-xs text-theme transition-all duration-150 hover:bg-theme hover:text-white disabled:opacity-60"
          >
            {loadingMore
              ? "Loading..."
              : `Load more (${rows.length} of ${meta.pagination.totalRecords})`}
          </button>
        )}
      </div>
    </div>
  );
};

export default DailyTransactionsCard;
