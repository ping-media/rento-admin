import React from "react";
import { formatPrice } from "../../utils";
import { Link } from "react-router-dom";
import useTransactionReport from "../../hooks/use-transaction-report";
import Spinner from "../../components/Spinner/Spinner";
import { tableIcons } from "../../Data/Icons";

const BookingBreakdownModal = ({ dayDetail, setDayDetail }) => {
  const { downloadReport, loading: reportLoading } = useTransactionReport();
  const [activeFilter, setActiveFilter] = React.useState("all");

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Bookings", value: "booking" },
    { label: "Extensions", value: "extension" },
    { label: "Vehicle Change", value: "vehicleChange" },
  ];

  const filteredBreakdown =
    dayDetail.data?.breakdown?.filter((item) =>
      activeFilter === "all" ? true : item.type === activeFilter,
    ) || [];

  const filteredTotal = filteredBreakdown.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl min-h-[80vh] max-h-[90vh] flex flex-col">
        {/* header */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-theme">
              {dayDetail.date ? (
                new Date(dayDetail.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              ) : dayDetail.startDate && dayDetail.endDate ? (
                <span className="flex flex-col">
                  <span>
                    {new Date(dayDetail.startDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                    })}
                    {" – "}
                    {new Date(dayDetail.endDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </span>
              ) : (
                ""
              )}
            </h2>
            {dayDetail.data && (
              <p className="text-sm text-gray-500">
                {dayDetail.data.count} transactions · Total:{" "}
                <span className="font-semibold text-theme">
                  ₹{formatPrice(dayDetail.data.total)}
                </span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                downloadReport({
                  date: dayDetail.date || null,
                  startDate: dayDetail.startDate || null,
                  endDate: dayDetail.endDate || null,
                })
              }
              disabled={reportLoading || dayDetail.loading}
              className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border border-theme text-theme hover:bg-theme hover:text-white transition-all duration-150 disabled:opacity-50"
            >
              {reportLoading ? (
                <Spinner />
              ) : (
                <div className="flex items-center gap-2">
                  {tableIcons?.download} <span>Download</span>
                </div>
              )}
            </button>
            <button
              onClick={() =>
                setDayDetail({
                  open: false,
                  date: null,
                  startDate: null,
                  endDate: null,
                  data: null,
                  loading: false,
                })
              }
              className="text-gray-400 hover:text-gray-700 text-xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* filters */}
        <div className="flex items-center gap-2 px-4 py-4 border-b overflow-y-hidden overflow-x-auto">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition-all duration-150 ${
                activeFilter === opt.value
                  ? "bg-theme text-white border-theme"
                  : "text-theme border-theme/40 hover:border-theme"
              }`}
            >
              {opt.label}
              {dayDetail.data && (
                <span className="ml-1 opacity-70">
                  (
                  {opt.value === "all"
                    ? dayDetail.data.breakdown.length
                    : dayDetail.data.breakdown.filter(
                        (i) => i.type === opt.value,
                      ).length}
                  )
                </span>
              )}
            </button>
          ))}
          {activeFilter !== "all" && (
            <p className="ml-auto text-xs text-gray-500 whitespace-nowrap">
              Subtotal:{" "}
              <span className="font-semibold text-theme">
                ₹{filteredTotal.toLocaleString()}
              </span>
            </p>
          )}
        </div>

        {/* body */}
        <div className="overflow-y-auto flex-1 p-4">
          {dayDetail.loading && (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme" />
            </div>
          )}

          {!dayDetail.loading && !dayDetail.data && (
            <p className="text-center text-gray-400 py-10">No data found</p>
          )}

          {!dayDetail.loading &&
            filteredBreakdown.map((item, i) => {
              const bookingId = item.bookingId?.split("_")[0];

              return (
                <Link
                  key={i}
                  to={
                    item.booking_id
                      ? `/all-bookings/details/${item.booking_id}_${bookingId}`
                      : "#"
                  }
                  className="w-full"
                >
                  <div className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-semibold text-base text-gray-800">
                        #{item.bookingId}
                      </p>
                      <p className="text-sm text-gray-400 capitalize">
                        {item.type === "booking"
                          ? "Main Booking"
                          : item.type === "extension"
                            ? "Extension"
                            : "Vehicle Change"}
                        {" · "}
                        {item.paymentMethod}
                      </p>
                      {item.paymentDateFormatted && (
                        <p className="text-sm text-gray-400">
                          {item.paymentDateFormatted}
                        </p>
                      )}
                      {item.customer && (
                        <p className="text-sm text-gray-400 capitalize">
                          {item.customer.firstName} {item.customer.lastName}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-theme">
                        ₹{formatPrice(item.amount)}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${item.paymentStatus === "paid" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}
                      >
                        {item.paymentStatus}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default BookingBreakdownModal;
