import React, { useState } from "react";
import PreLoader from "../../components/Skeleton/PreLoader";
import { useSelector } from "react-redux";
import CopyButton from "../../components/Buttons/CopyButton";
import {
  formatMilliseconds,
  formatPrice,
  removeSecondsFromDateAndTime,
} from "../../utils/index";

const BookingTimeLine = () => {
  const { timeLineData } = useSelector((state) => state.vehicles);
  const [loading] = useState(false);

  return (
    <>
      <div className="container mx-auto py-2">
        {loading && <PreLoader />}
        <div className="relative wrap overflow-hidden">
          <div className="border-2-2 absolute border-opacity-20 border-gray-700 h-full border left-1/2"></div>
          {!loading &&
            timeLineData != null &&
            timeLineData?.timeLine?.map((item, index) => {
              return (
                <div
                  className={`${
                    ["Completed", "Ended", "Cancelled"].some((status) =>
                      item?.title?.includes(status)
                    )
                      ? ""
                      : "mb-2"
                  } flex justify-between ${
                    index === 0
                      ? "items-start"
                      : index === timeLineData?.timeLine?.length - 1
                      ? "items-end"
                      : "items-center"
                  } w-full ${
                    (index + 1) % 2 === 0
                      ? "right-timeline"
                      : "flex-row-reverse left-timeline"
                  }`}
                  key={index}
                >
                  <div className="order-1 w-5/12"></div>
                  <div className="z-10 flex items-center order-1 bg-theme shadow-xl w-4 h-4 rounded-full relative">
                    {/* {index + 1 === timeLineData?.timeLine?.length &&
                      !item?.title?.includes("Completed") && (
                        <div className="absolute top-0 bottom-0 w-full h-full rounded-full bg-theme animate-ping"></div>
                      )} */}
                  </div>
                  <div
                    className={`order-1 w-5/12 ${
                      (index + 1) % 2 === 0 ? "text-left" : "text-right"
                    }`}
                  >
                    {!(
                      item?.title?.includes("Link") ||
                      item?.title?.includes("Extended") ||
                      item?.title?.includes("Changed")
                    ) ? (
                      <>
                        <h3 className="mb-1 font-bold text-gray-800 text-sm">
                          {item?.title}
                        </h3>
                        {Object.keys(item)?.length > 2 && (
                          <p
                            className={`text-gray-700 leading-tight ${
                              item?.paymentAmount
                                ? "text-md font-semibold"
                                : "text-sm"
                            }`}
                          >
                            {(item?.vehicleName && (
                              <span className="capitalize">
                                Vehicle: {item?.vehicleName}(
                                {item?.vehicleNumber})
                              </span>
                            )) ||
                              (item?.paymentAmount &&
                                `₹${formatPrice(item?.paymentAmount)}`) ||
                              item?.extendedTill ||
                              item?.changedTo}
                          </p>
                        )}
                        <p className="text-gray-700 leading-tight text-xs">
                          {typeof item?.date === "number" &&
                            formatMilliseconds(item?.date)}
                          {/* {removeSecondsFromDateAndTime(item?.date)} */}
                        </p>
                      </>
                    ) : (
                      <div>
                        <h3
                          className={`mb-1 font-bold text-gray-800 text-sm flex ${
                            (index + 1) % 2 === 0
                              ? "justify-start"
                              : "justify-end"
                          }`}
                        >
                          {item?.title}
                          {item?.PaymentLink != "" && (
                            <span className="ml-1">
                              <CopyButton textToCopy={item?.PaymentLink} />
                            </span>
                          )}
                        </h3>
                        <p
                          className={`text-gray-700 leading-tight text-md font-semibold`}
                        >
                          ₹{formatPrice(item?.paymentAmount)}
                        </p>
                        {item?.changeToVehicle &&
                          item?.changeToVehicle != "" && (
                            <p className="text-gray-700 leading-tight text-xs">
                              {item?.changeToVehicle}
                            </p>
                          )}
                        <p className="text-gray-700 leading-tight text-xs">
                          {removeSecondsFromDateAndTime(item?.date)}
                        </p>
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
