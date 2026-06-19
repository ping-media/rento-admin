import { useSelector } from "react-redux";
import { formatPrice, getDurationInDays } from "../../utils/index";
import { ExtendSummary, RideSummary } from "./RideSummary";
import { useEffect, useReducer } from "react";
import { calculateBookingPrice } from "../../utils/calculateBookingPrice";

const priceReducer = (_, action) => {
  return calculateBookingPrice(action.payload);
};

const getTotalRefund = (bookingPrice) => {
  if (!bookingPrice) return 0;

  let totalRefund = 0;

  //  Main booking refund
  if (Number(bookingPrice.refundAmount) > 0) {
    totalRefund += Number(bookingPrice.refundAmount);
  }

  //  Diff refund
  if (Array.isArray(bookingPrice.diffAmount)) {
    bookingPrice.diffAmount.forEach((item) => {
      if (item.status === "paid" && Number(item.refundAmount) > 0) {
        totalRefund += Number(item.refundAmount);
      }
    });
  }

  //  Extension refund
  if (Array.isArray(bookingPrice.extendAmount)) {
    bookingPrice.extendAmount.forEach((item) => {
      if (item.status === "paid" && Number(item.refundAmount) > 0) {
        totalRefund += Number(item.refundAmount);
      }
    });
  }

  return totalRefund;
};

const AdditionalInfo = () => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [totalPrice, calculateTotal] = useReducer(priceReducer, 0);

  const diffAmount = vehicleMaster[0]?.bookingPrice?.diffAmount
    ? vehicleMaster[0]?.bookingPrice?.diffAmount[
        vehicleMaster[0]?.bookingPrice?.diffAmount?.length - 1
      ]
    : null;

  const booking = vehicleMaster?.[0];
  const bookingPrice = booking?.bookingPrice ?? null;
  const startDate = booking?.BookingStartDateAndTime;
  const isExtend = booking?.bookingPrice?.extendAmount?.length > 0;
  const endDate = isExtend
    ? booking?.bookingPrice?.extendAmount[0]?.BookingStartDateAndTime
    : vehicleMaster[0]?.BookingEndDateAndTime;

  const mainBookingDuration = getDurationInDays(startDate, endDate);

  const extendBookingLimit = isExtend
    ? booking?.bookingPrice?.extendAmount.reduce((sum, extend) => {
        return sum + (extend.freeLimit || 0);
      }, 0)
    : 0;

  const freeLimit =
    Number(booking?.vehicleBasic?.freeLimit) + Number(extendBookingLimit);

  useEffect(() => {
    if (!bookingPrice) return;

    calculateTotal({ payload: bookingPrice });
  }, [bookingPrice]);

  const refundAmount = getTotalRefund(bookingPrice);
  const finalRefundAmount = refundAmount > 0 ? refundAmount : null;

  const finalTotalPrice =
    refundAmount !== null ? totalPrice - refundAmount : totalPrice;

  return (
    <>
      {diffAmount !== null && diffAmount?.refundAmount > 0 && (
        <div className="mt-1 mb-2.5">
          <div className="w-full flex items-center justify-between text-sm  uppercase">
            <p className="mr-1 capitalize">Change Vehicle Refund Amount:</p>
            <p className="text-theme font-semibold">
              ₹
              {formatPrice(
                vehicleMaster[0]?.bookingPrice?.diffAmount[
                  vehicleMaster[0]?.bookingPrice?.diffAmount?.length - 1
                ]?.refundAmount,
              )}
            </p>
          </div>
        </div>
      )}

      <div className="mt-1 mb-2.5">
        <div className="w-full flex items-center justify-between text-sm  mb-1">
          <p className="mr-1">Free Limit:</p>
          <p>
            {vehicleMaster[0]?.vehicleBasic?.freeLimit ? freeLimit : "--"} Km
          </p>
        </div>
        <div className="w-full flex items-center justify-between text-sm  mb-1">
          <p className="mr-1">Extra Km Charge:</p>
          <p>
            {vehicleMaster[0]?.vehicleBasic?.extraKmCharge ? (
              <>
                ₹
                {formatPrice(
                  Number(vehicleMaster[0]?.vehicleBasic?.extraKmCharge),
                )}
                /km{" "}
                <span className="hidden lg:inline">
                  (after free limit exceeds.)
                </span>
              </>
            ) : (
              "--"
            )}
          </p>
        </div>
        <div className="w-full flex items-center justify-between text-sm mb-1">
          <p className="mr-1">Booked From:</p>
          <p>
            {vehicleMaster[0]?.bookedFrom === "web"
              ? "Website"
              : vehicleMaster[0]?.bookedFrom === "admin"
                ? "Admin"
                : "App" || "--"}
          </p>
        </div>
        <div className="w-full flex items-center justify-between text-sm ">
          <p className="mr-1">Payment Method:</p>
          <p>
            {vehicleMaster?.[0]?.paymentMethod === "partiallyPay"
              ? "Partially Pay"
              : vehicleMaster?.[0]?.paymentMethod || "--"}
          </p>
        </div>
      </div>
      <div className="w-full">
        <div className="flex items-center gap-1 mb-1">
          {vehicleMaster[0]?.bookingPrice?.lateFeePaymentMethod &&
            vehicleMaster[0]?.bookingPrice?.lateFeePaymentMethod !== "NA" && (
              <span className="text-xs italic ">
                (Paid by {vehicleMaster[0]?.bookingPrice?.lateFeePaymentMethod})
              </span>
            )}
        </div>

        <div className="mb-2">
          {vehicleMaster[0]?.bookingPrice?.lateFeeBasedOnHour ||
          vehicleMaster[0]?.bookingPrice?.lateFeeBasedOnKM ||
          vehicleMaster[0]?.bookingPrice?.additionalPrice ||
          vehicleMaster[0]?.rideStatus === "completed" ? (
            <div>
              <p className="w-full flex items-center justify-between text-sm text-theme">
                <span className="mr-1">Late Hour Charges:</span>₹
                {formatPrice(
                  Number(
                    vehicleMaster[0]?.bookingPrice?.lateFeeBasedOnHour || 0,
                  ),
                )}
              </p>
              <p className="w-full flex items-center justify-between text-sm text-theme">
                <span className="mr-1">Late KM Charges:</span>₹
                {formatPrice(
                  Number(vehicleMaster[0]?.bookingPrice?.lateFeeBasedOnKM || 0),
                )}
              </p>
              <p className="w-full flex items-center justify-between text-sm text-theme">
                <span className="mr-1">Other Charges:</span>₹
                {formatPrice(
                  Number(vehicleMaster[0]?.bookingPrice?.additionalPrice || 0),
                )}
              </p>
            </div>
          ) : (
            <p className="text-sm  italic text-gray-400">
              Ride not finish yet.
            </p>
          )}
        </div>
      </div>
      <div className="hidden lg:block w-full">
        <h2 className="text-md text-gray-600 font-bold border-b pb-1 mb-1">
          Ride Summary
        </h2>
        <div className="my-2">
          {vehicleMaster[0]?.bookingPrice && (
            <RideSummary
              daysBreakdown={vehicleMaster[0]?.bookingPrice?.daysBreakdown}
              appliedPlans={vehicleMaster[0]?.bookingPrice?.appliedPlan}
              item={vehicleMaster[0]?.bookingPrice}
              mainBookingDuration={mainBookingDuration}
            />
          )}

          {vehicleMaster[0]?.bookingPrice?.extendAmount &&
            vehicleMaster[0]?.bookingPrice?.extendAmount?.length > 0 && (
              <ul className="leading-6 lg:leading-7 list-disc">
                {vehicleMaster[0]?.bookingPrice?.extendAmount?.map(
                  (item, index) => (
                    <li className="flex flex-col" key={index}>
                      <ExtendSummary
                        daysBreakdown={item?.daysBreakdown || []}
                        appliedPlans={item?.appliedPlans || []}
                        bookingDuration={item?.extendDuration || 0}
                        item={item}
                      />
                    </li>
                  ),
                )}
              </ul>
            )}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t-2 mt-5 pt-2.5">
        {finalRefundAmount !== null && (
          <div className="flex items-center justify-between">
            <h2 className="md:text-base font-normal">Refund Price:</h2>
            <p className="text-theme font-semibold">
              - ₹{formatPrice(finalRefundAmount)}
            </p>
          </div>
        )}
        <div className="flex items-center justify-between">
          <h2 className="md:text-base font-medium">Total Price:</h2>
          <p className="text-theme font-semibold">
            ₹{formatPrice(finalTotalPrice)}
          </p>
        </div>
      </div>
    </>
  );
};

export default AdditionalInfo;
