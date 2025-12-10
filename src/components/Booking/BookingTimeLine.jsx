import React, { useState } from "react";
import PreLoader from "../../components/Skeleton/PreLoader";
import { useSelector } from "react-redux";
import CopyButton from "../../components/Buttons/CopyButton";
import {
  formatFullDateAndTime,
  formatPrice,
  millisecToReadableFormat,
} from "../../utils/index";

const BookingTimeLine = () => {
  const { timeLineData } = useSelector((state) => state.vehicles);
  const [loading] = useState(false);

  return (
    <>
      <div className="container mx-auto py-4">
        {loading && <PreLoader />}
        <div className="relative wrap overflow-hidden">
          {/* <div className="border-2-2 absolute border-opacity-20 border-gray-700 h-full border left-1/2"></div> */}
          <div
            className="border-2-2 absolute border-opacity-20 border-gray-700 h-full border"
            style={{ left: "37.5%" }}
          ></div>

          {!loading &&
            timeLineData != null &&
            timeLineData?.timeLine?.map((item, index) => {
              const isBothDatesChange = item?.title?.includes("Rescheduled")
                ? item?.newStartDate !== "" && item?.newEndDate !== ""
                  ? true
                  : false
                : false;
              return (
                <div
                  className={`${
                    ["Completed", "Ended", "Cancelled"].some((status) =>
                      item?.title?.includes(status)
                    )
                      ? ""
                      : "mb-5"
                  } flex justify-between  w-full`}
                  key={index}
                >
                  {/* <div className="order-1 w-5/12 text-right"> */}
                  <div className="order-1 w-4/12 text-right">
                    <p className="text-gray-700 text-sm leading-tight whitespace-pre-line">
                      {typeof item?.date === "number" &&
                        millisecToReadableFormat(item?.date)
                          .split(/,(?=[^,]*$)/)
                          .join("\n")}
                    </p>
                  </div>

                  <div className="z-10 flex items-center order-1 bg-theme shadow-xl w-4 h-4 rounded-full relative"></div>
                  {/* <div className="order-1 w-5/12 text-left"> */}
                  <div className="order-1 w-7/12 text-left">
                    {!(
                      item?.title?.includes("Link") ||
                      item?.title?.includes("Extended") ||
                      item?.title?.includes("Changed")
                    ) ? (
                      <>
                        <h3 className="mb-1 font-bold text-gray-800 text-sm">
                          {item?.title}
                        </h3>

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
                        {(item?.newStartDate || item?.newEndDate) && (
                          <>
                            {isBothDatesChange && (
                              <p className="text-gray-800 leading-tight text-xs">
                                Booking Date(s) changes to
                              </p>
                            )}
                            {item?.newStartDate && !isBothDatesChange && (
                              <p className="text-gray-800 leading-tight text-xs">
                                Booking Start Date Change to
                                {formatFullDateAndTime(item?.newStartDate)}
                              </p>
                            )}
                            {item?.newEndDate && !isBothDatesChange && (
                              <p className="text-gray-800 leading-tight text-xs">
                                Booking End Date Change to
                                {formatFullDateAndTime(item?.newEndDate)}
                              </p>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <div>
                        <h3
                          className={`mb-1 font-bold text-gray-800 text-sm flex justify-start`}
                        >
                          {item?.title}
                          {item?.extended !== true &&
                            item?.PaymentLink &&
                            item?.PaymentLink !== "" && (
                              <span className="ml-1">
                                <CopyButton textToCopy={item?.PaymentLink} />
                              </span>
                            )}
                        </h3>
                        {(!item?.refundAmount ||
                          (item?.refundAmount && item?.refundAmount === 0)) && (
                          <>
                            <p
                              className={`text-gray-700 leading-tight text-md font-semibold`}
                            >
                              ₹{formatPrice(item?.paymentAmount || 0)}
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
                        )}

                        {Number(item?.refundAmount || 0) > 0 && (
                          <>
                            <p className="text-gray-700 leading-tight text-md font-semibold">
                              ₹{formatPrice(item.refundAmount)}
                            </p>
                            <p className="text-sm lg:text-xs text-theme">
                              Amount Refunded
                            </p>
                          </>
                        )}

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
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
        {!loading && timeLineData?.length === 0 && (
          <p className="italic text-md text-center my-2 text-gray-400">
            No TimeLine Found.
          </p>
        )}
      </div>
    </>
  );
};

export default BookingTimeLine;
