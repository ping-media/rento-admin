import { useState } from "react";
import { useSelector } from "react-redux";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import ModalWrapper from "../Modal/ModalWrapper";
import { exportToExcel } from "../../utils/ExportFile";
import { getFullData } from "../../Data/index";
import { transformBookings } from "./data/booking";

const PRESETS = [
  { key: "today", label: "Today" },
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
  { key: "6months", label: "Last 6 months" },
  { key: "custom", label: "Custom" },
];

const toYMD = (d) => d.toLocaleDateString("en-CA"); // YYYY-MM-DD, local time

const fmt = (ymd) =>
  new Date(`${ymd}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getPresetRange = (key) => {
  const now = new Date();
  const today = toYMD(now);

  if (key === "today") return { start: today, end: today };

  if (key === "week") {
    const daysSinceMonday = (now.getDay() + 6) % 7;
    const monday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - daysSinceMonday,
    );
    return { start: toYMD(monday), end: today };
  }

  if (key === "month") {
    return {
      start: toYMD(new Date(now.getFullYear(), now.getMonth(), 1)),
      end: today,
    };
  }

  // 6months
  return {
    start: toYMD(
      new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()),
    ),
    end: today,
  };
};

const BookingExportModal = ({ onClose }) => {
  const { token } = useSelector((state) => state.user);
  const [preset, setPreset] = useState("today");
  const [range, setRange] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState("");

  const resolveRange = () => {
    if (preset === "custom") {
      if (!range?.from) return null;
      return { start: toYMD(range.from), end: toYMD(range.to || range.from) };
    }
    return getPresetRange(preset);
  };

  const selected = resolveRange();

  const handleExport = async () => {
    const dates = resolveRange();
    if (!dates) {
      setError("Please select a date range");
      return;
    }

    setError("");
    setLoading(true);
    setProgress({ done: 0, total: 0 });

    try {
      const params = new URLSearchParams({
        startDate: dates.start,
        endDate: dates.end,
      });
      const allData = [];
      let cursor = null;
      let total = 0;

      do {
        if (cursor) params.set("cursor", cursor);

        const res = await getFullData(`/getBooking/report?${params}`, token);

        if (res?.status !== 200) {
          setError(res?.data?.message || "Unable to get data! try again");
          return;
        }

        const body = res.data;

        // first call only: total + cap check come back here
        if (!cursor) {
          total = body?.total ?? 0;
          if (total === 0) {
            setError("No bookings found in this date range");
            return;
          }
        }

        allData.push(...(body?.data || []));
        setProgress({ done: allData.length, total });

        cursor = body?.pagination?.hasMore ? body.pagination.nextCursor : null;
      } while (cursor);

      exportToExcel(
        transformBookings(allData),
        `RentoBikes_Booking_Report_${dates.start}_to_${dates.end}`,
      );
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to generate excel sheet! try again",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper
      active
      onClose={onClose}
      title="Export Bookings"
      size="md"
      position="responsive"
      closeOnOverlay={!loading}
      closeOnEsc={!loading}
      showClose={!loading}
    >
      <div className="p-4 pt-1">
        <p className="mb-3 text-sm text-gray-500">
          Bookings that overlap the selected dates will be exported.
        </p>

        <div className="mb-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              type="button"
              disabled={loading}
              onClick={() => {
                setPreset(p.key);
                setError("");
              }}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition-all duration-150 disabled:opacity-60 ${
                preset === p.key
                  ? "border-theme bg-theme text-white"
                  : "border-theme/40 text-theme hover:border-theme"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {preset === "custom" && (
          <div className="mb-3 flex justify-center">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={(r) => {
                setRange(r);
                setError("");
              }}
              modifiersClassNames={{
                selected: "bg-theme text-white",
                today: "text-red-500",
              }}
            />
          </div>
        )}

        <p className="mb-3 text-sm">
          <span className="font-semibold">Range: </span>
          {selected
            ? selected.start === selected.end
              ? fmt(selected.start)
              : `${fmt(selected.start)} - ${fmt(selected.end)}`
            : "Select a start and end date"}
        </p>

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <button
          type="button"
          onClick={handleExport}
          disabled={loading || !selected}
          className="w-full rounded-md bg-theme px-4 py-2 text-gray-100 transition duration-300 ease-in-out hover:bg-theme-dark disabled:bg-theme/60"
        >
          {loading
            ? progress.total
              ? `Exporting ${progress.done} / ${progress.total}`
              : "Preparing..."
            : "Export"}
        </button>
      </div>
    </ModalWrapper>
  );
};

export default BookingExportModal;
