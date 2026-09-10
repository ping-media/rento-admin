import React, { lazy, Suspense, useState } from "react";
import PreLoader from "../../components/Skeleton/PreLoader";
import { useSelector } from "react-redux";
import CopyButton from "../../components/Buttons/CopyButton";
import {
  formatFullDateAndTime,
  formatPrice,
  millisecToReadableFormat,
} from "../../utils/index";
import { tableIcons } from "../../Data/Icons";
import Tooltip from "../../components/Tooltip/Tooltip";
const BookingTimelineNoteModal = lazy(
  () => import("../../components/Modal/BookingTimelineNoteModal"),
);

function formatDateTime(dateString) {
  if (!dateString) return "";

  const [datePart, timePart] = dateString.split(", ");
  if (!datePart || !timePart) return dateString;

  const [day, month, year] = datePart.split("/").map(Number);

  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  const is12Hour = /am|pm/i.test(timePart);

  if (is12Hour) {
    const [time, period] = timePart.split(" ");
    const [h, m, s = "0"] = time.split(":").map(Number);

    hours = h;

    if (period.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    }

    if (period.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    minutes = m;
    seconds = Number(s);
  } else {
    const [h, m, s = "0"] = timePart.split(":").map(Number);

    hours = h;
    minutes = m;
    seconds = Number(s);
  }

  const date = new Date(year, month - 1, day, hours, minutes, seconds);

  if (isNaN(date.getTime())) return dateString;

  const formattedDate = `${date.toLocaleString("en-US", {
    month: "short",
  })} ${date.getDate()}, ${date.getFullYear()}`;

  const formattedTime = date
    .toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace("AM", "AM")
    .replace("PM", "PM");

  return `${formattedDate}, ${formattedTime}`;
}

const BookingTimeLine = () => {
  const { timeLineData } = useSelector((state) => state.vehicles);
  const [loading] = useState(false);
  // modal state
  const [open, setOpen] = useState(false);
  const [timelineIndex, setTimelineIndex] = useState(null);

  const handleOpenNote = (index) => {
    if (typeof index !== "number") return;

    setOpen(true);
    setTimelineIndex(index);
  };

  const handleCloseNote = () => {
    setOpen(false);
    setTimelineIndex(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-4">
        <BookingTimelineSkeleton />
      </div>
    );
  }

  if (timeLineData?.length === 0) {
    return (
      <div className="container mx-auto py-4">
        <p className="italic text-md text-center my-2 text-gray-400">
          No TimeLine Found.
        </p>
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={<PreLoader />}>
        <BookingTimelineNoteModal
          open={open}
          setOpen={handleCloseNote}
          _id={timeLineData?._id ?? ""}
          index={timelineIndex}
        />
      </Suspense>

      <div className="container mx-auto py-4">
        <div className="relative wrap overflow-hidden">
          <div className="border-2-2 absolute border-opacity-20 border-gray-700 h-full border left-[29.3%] md:left-[37.5%]"></div>

          {!loading &&
            timeLineData != null &&
            timeLineData?.timeLine?.map((item, index) => {
              return (
                <div
                  className={`${
                    ["Completed", "Ended", "Cancelled"].some((status) =>
                      item?.title?.includes(status),
                    )
                      ? ""
                      : "mb-5"
                  } flex justify-between  w-full`}
                  key={index}
                >
                  <div className="order-1 w-3/12 md:w-4/12 text-right">
                    <p className="text-gray-700 text-sm leading-tight whitespace-pre-line">
                      {typeof item?.date === "number"
                        ? millisecToReadableFormat(item?.date)
                            .split(/,(?=[^,]*$)/)
                            .join("\n")
                        : item.date &&
                          formatDateTime(item?.date)
                            .split(/,(?=[^,]*$)/)
                            .join("\n")}
                    </p>
                  </div>

                  <div className="z-10 flex items-center order-1 bg-theme shadow-xl w-4 h-4 rounded-full relative"></div>
                  <div className="order-1 w-8/12 md:w-7/12 text-left">
                    {!(
                      item?.title?.includes("Link") ||
                      item?.title?.includes("Extended") ||
                      item?.title?.includes("Changed")
                    ) ? (
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold capitalize text-gray-800 text-sm">
                            {item?.title}
                          </h3>
                        </div>

                        {item?.bookingEndDateAndTime && (
                          <p className="text-gray-700 leading-tight text-sm">
                            {(item?.title).endsWith("Created") && "End date:"}{" "}
                            {formatFullDateAndTime(item?.bookingEndDateAndTime)}
                          </p>
                        )}

                        {Object.keys(item)?.length > 2 && (
                          <>
                            {item?.vehicleName && (
                              <p className="text-gray-700 leading-tight text-sm">
                                <span className="capitalize">
                                  {item?.vehicleName}({item?.vehicleNumber})
                                </span>
                              </p>
                            )}
                            {!item?.vehicleName &&
                            item?.paymentAmount &&
                            item?.paymentAmount > 0 ? (
                              <p className="text-gray-700 leading-tight text-md font-semibold">
                                ₹{formatPrice(item?.paymentAmount)}
                              </p>
                            ) : null}
                            {!item?.vehicleName &&
                              !item?.paymentAmount &&
                              item?.extendedTill && (
                                <p className="text-gray-700 leading-tight text-sm">
                                  {item?.extendedTill}
                                </p>
                              )}
                            {!item?.vehicleName &&
                              !item?.paymentAmount &&
                              !item?.extendedTill &&
                              item?.changedTo && (
                                <p className="text-gray-700 leading-tight text-sm">
                                  {item?.changedTo}
                                </p>
                              )}
                          </>
                        )}

                        {item?.remaining_amount &&
                        Number(item?.remaining_amount) > 0 ? (
                          <p className="text-sm">
                            Amount:{" "}
                            <span className="font-semibold text-theme">
                              {`₹${formatPrice(item?.remaining_amount)}`}
                            </span>
                          </p>
                        ) : null}

                        {item?.paymentMode && (
                          <p className="text-sm">
                            Paid through:{" "}
                            <span className="font-bold uppercase text-theme">
                              {item?.paymentMode}
                            </span>
                          </p>
                        )}
                        {item?.paymentId && (
                          <p className="text-gray-900 leading-tight text-xs">
                            TxID: {item.paymentId}
                          </p>
                        )}
                        {(item?.oldDates || item?.newDates) && (
                          <div className="mt-2 space-y-2">
                            {/* Start Date */}
                            {(item?.oldDates?.start ||
                              item?.newDates?.start) && (
                              <p className="text-xs leading-relaxed text-gray-700 flex-wrap">
                                <span className="font-semibold">
                                  Start Date Changed{" "}
                                </span>
                                from{" "}
                                {item?.oldDates?.start
                                  ? formatFullDateAndTime(item.oldDates.start)
                                  : "--"}{" "}
                                to{" "}
                                <span className="font-semibold">
                                  {item?.newDates?.start
                                    ? formatFullDateAndTime(item.newDates.start)
                                    : "--"}
                                </span>
                              </p>
                            )}

                            {/* End Date */}
                            {(item?.oldDates?.end || item?.newDates?.end) && (
                              <p className="text-xs leading-relaxed text-gray-700 flex-wrap">
                                <span className="font-semibold">
                                  End Date Changed{" "}
                                </span>
                                from{" "}
                                {item?.oldDates?.end
                                  ? formatFullDateAndTime(item.oldDates.end)
                                  : "--"}{" "}
                                to{" "}
                                <span className="font-semibold">
                                  {item?.newDates?.end
                                    ? formatFullDateAndTime(item.newDates.end)
                                    : "--"}
                                </span>
                              </p>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <h3
                            className={`font-bold text-gray-800 text-sm flex justify-start`}
                          >
                            {item?.title === "Booking Extended by User"
                              ? "Extension by User"
                              : item?.title === "Booking Extended by Admin"
                                ? "Extension by Admin"
                                : item?.title === "Booking Extended by Manager"
                                  ? "Extension by Manager"
                                  : item?.title}
                            {item?.extended !== true &&
                              item?.PaymentLink &&
                              item?.PaymentLink !== "" && (
                                <span className="ml-1">
                                  <CopyButton textToCopy={item?.PaymentLink} />
                                </span>
                              )}
                          </h3>
                          {/* add note button if note is there than data  */}
                          {!item?.PaymentLink && (
                            <>
                              {(!item?.notes || item.notes.length === 0) && (
                                <AddNoteBtn
                                  onClick={() => handleOpenNote(index)}
                                />
                              )}

                              {item?.notes?.length === 1 && (
                                <Tooltip
                                  underLine={false}
                                  buttonMessage="(?)"
                                  tooltipData={
                                    <p className="max-w-60 text-wrap">
                                      {item.notes[0]?.value} |{" "}
                                      {item.notes[0]?.key}
                                    </p>
                                  }
                                />
                              )}
                            </>
                          )}
                        </div>
                        {!item?.refundAmount ||
                        (item?.refundAmount && item?.refundAmount === 0) ? (
                          <>
                            <p
                              className={`text-gray-700 leading-tight text-md font-semibold`}
                            >
                              {item?.updatedPendingAmount &&
                              item?.updatedPendingAmount !== undefined
                                ? `₹${formatPrice(item?.updatedPendingAmount || 0)}`
                                : `₹${formatPrice(item?.paymentAmount || 0)}`}
                            </p>
                            {item?.paymentAmount > 0 && (
                              <p className="text-sm lg:text-xs text-theme">
                                {item?.extended === true
                                  ? item?.title?.endsWith("Admin")
                                    ? "(Cash Collected)"
                                    : "(Amount Paid)"
                                  : "Amount need to pay by customer"}
                              </p>
                            )}
                          </>
                        ) : null}

                        {Number(item?.refundAmount ?? 0) > 0 ? (
                          <>
                            <p className="text-gray-700 leading-tight text-md font-semibold">
                              ₹{formatPrice(item?.refundAmount ?? 0)}
                            </p>
                            <p className="text-sm lg:text-xs text-theme">
                              Amount Refunded
                            </p>
                          </>
                        ) : null}

                        {item?.changeToVehicle &&
                          item?.changeToVehicle != "" && (
                            <p className="text-gray-700 leading-tight text-xs">
                              {item?.changeToVehicle}
                            </p>
                          )}

                        {(item?.endDate || item?.extendDate) && (
                          <p className="text-gray-800 leading-tight text-xs">
                            {item?.extended === true
                              ? "Extended Till"
                              : "For extension till"}{" "}
                            {item?.endDate &&
                              formatFullDateAndTime(item?.endDate)}
                            {item?.extendDate &&
                              formatFullDateAndTime(item?.extendDate)}
                          </p>
                        )}

                        {item?.paymentId && (
                          <p className="text-gray-900 leading-tight text-xs">
                            TxID: {item.paymentId}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default BookingTimeLine;

const AddNoteBtn = ({ onClick }) => (
  <button
    type="button"
    className="cursor-pointer bg-theme"
    title="add note"
    onClick={onClick}
  >
    {tableIcons.add}
  </button>
);

const BookingTimelineSkeleton = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Center Line */}
      <div className="absolute left-1/2 h-full border border-gray-200"></div>

      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className={`mb-4 flex w-full justify-between ${
            (index + 1) % 2 === 0
              ? "right-timeline"
              : "flex-row-reverse left-timeline"
          }`}
        >
          {/* Empty Side */}
          <div className="w-5/12"></div>

          {/* Dot */}
          <div className="relative z-20 h-4 w-4 rounded-full bg-gray-300"></div>

          {/* Content */}
          <div
            className={`w-5/12 ${
              (index + 1) % 2 === 0 ? "text-left" : "text-right"
            }`}
          >
            <div
              className={`rounded-xl border border-gray-100 bg-white p-4 shadow-sm ${
                (index + 1) % 2 === 0 ? "" : "ml-auto"
              }`}
            >
              {/* Title */}
              <div
                className={`mb-3 h-4 w-40 animate-pulse rounded bg-gray-200 ${
                  (index + 1) % 2 === 0 ? "" : "ml-auto"
                }`}
              ></div>

              {/* Status */}
              <div
                className={`mb-3 h-3 w-28 animate-pulse rounded bg-gray-200 ${
                  (index + 1) % 2 === 0 ? "" : "ml-auto"
                }`}
              ></div>

              {/* Start */}
              <div
                className={`mb-2 h-3 w-full animate-pulse rounded bg-gray-100`}
              ></div>

              {/* End */}
              <div
                className={`h-3 w-5/6 animate-pulse rounded bg-gray-100 ${
                  (index + 1) % 2 === 0 ? "" : "ml-auto"
                }`}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
