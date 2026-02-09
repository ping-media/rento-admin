import {
  camelCaseToSpaceSeparated,
  formatPrice,
  getDurationInDays,
} from "../../utils/index";
import Tooltip from "../../components/Tooltip/Tooltip";
import { renderTooltipBreakdown } from "../../utils/Helper/Helper";

const BookingFareDetails = ({ rides }) => {
  // --- handle booking end date from extend ---
  // const extendAmount = rides.bookingPrice?.extendAmount || [];

  // --- prices ---
  const bookingPrice =
    rides?.bookingPrice?.isDiscountZero === true ||
    (rides?.bookingPrice?.discountTotalPrice &&
      rides?.bookingPrice?.discountTotalPrice !== 0)
      ? rides?.bookingPrice?.discountTotalPrice
      : rides?.bookingPrice?.totalPrice;

  // const extendPrice = extendAmount.reduce((sum, extend) => {
  //   if (extend?.status === "paid") {
  //     return (
  //       sum +
  //       Number(extend?.amount || 0) +
  //       Number(extend?.addOnAmount || 0) +
  //       Number(extend?.tax || 0) +
  //       Number(extend?.addonTax || 0)
  //     );
  //   }
  //   return sum;
  // }, 0);

  // const newBookingPrice = bookingPrice;

  return (
    <>
      {rides && (
        <>
          {rides?.bookingPrice.isPackageApplied && (
            <div className="text-gray-500 mb-1.5">
              <span className="font-bold">Package:</span>
              {`(${getDurationInDays(
                rides?.BookingStartDateAndTime,
                rides?.bookingPrice?.extendAmount?.[0]
                  ?.originalBookingEndDateAndTime
                  ? rides?.bookingPrice?.extendAmount?.[0]
                      ?.originalBookingEndDateAndTime
                  : rides?.BookingEndDateAndTime,
              )} days Package Applied)`}
            </div>
          )}
          <ul className="w-full leading-8 mb-2">
            {Object.entries(rides?.bookingPrice)
              .filter(
                ([key]) =>
                  key !== "totalPrice" &&
                  key !== "vehiclePrice" &&
                  key !== "rentAmount" &&
                  key !== "isPackageApplied" &&
                  key !== "userPaid" &&
                  key !== "discountPrice" &&
                  key !== "discountTotalPrice" &&
                  key !== "isInvoiceCreated" &&
                  key !== "isPickupImageAdded" &&
                  key !== "isDiscountZero" &&
                  key !== "isChanged" &&
                  key !== "extendAmount" &&
                  key !== "diffAmount" &&
                  key !== "AmountLeftAfterUserPaid" &&
                  key !== "lateFeeBasedOnHour" &&
                  key !== "lateFeeBasedOnKM" &&
                  key !== "payOnPickupMethod" &&
                  key !== "lateFeePaymentMethod" &&
                  key !== "additionFeePaymentMethod" &&
                  key !== "additionalPrice" &&
                  key !== "refundAmount" &&
                  key !== "rrnNumber" &&
                  // !(key === "extraAddonPrice" && value === 0)
                  key !== "extraAddonPrice" &&
                  key !== "daysBreakdown" &&
                  key !== "appliedPlan",
              ) // Exclude totalPrice
              .map(([key, value]) => {
                if (typeof value === "object") {
                  return (
                    value?.length > 0 &&
                    value?.map((item, index) => (
                      <li
                        key={`key-${index}`}
                        className={`flex items-center justify-between ${
                          index === value.length - 1 ? "" : "border-b-2"
                        }`}
                      >
                        <div className="my-1">
                          <p className="text-sm font-semibold uppercase">
                            {item?.name}
                          </p>
                          <p className="text-xs text-gray-500 mb-1">
                            (
                            {`₹${item?.amount} x ${getDurationInDays(
                              rides?.BookingStartDateAndTime,
                              (rides?.extendBooking?.oldBooking?.length > 0 &&
                                rides?.extendBooking?.oldBooking[0]
                                  ?.BookingEndDateAndTime) ||
                                rides?.BookingEndDateAndTime,
                            )} ${
                              getDurationInDays(
                                rides?.BookingStartDateAndTime,
                                (rides?.extendBooking?.oldBooking?.length > 0 &&
                                  rides?.extendBooking?.oldBooking[0]
                                    ?.BookingEndDateAndTime) ||
                                  rides?.BookingEndDateAndTime,
                              ) == 1
                                ? "day"
                                : "days"
                            }`}
                            )
                          </p>
                        </div>
                        <p>{`₹${formatPrice(
                          item?.maxAmount > 0
                            ? item?.amount *
                                getDurationInDays(
                                  rides?.BookingStartDateAndTime,
                                  // rides?.extendBooking?.originalEndDate ||
                                  (rides?.extendBooking?.oldBooking?.length >
                                    0 &&
                                    rides?.extendBooking?.oldBooking[0]
                                      ?.BookingEndDateAndTime) ||
                                    rides?.BookingEndDateAndTime,
                                ) >
                              item?.maxAmount
                              ? item?.maxAmount
                              : item?.amount *
                                getDurationInDays(
                                  rides?.BookingStartDateAndTime,
                                  // rides?.extendBooking?.originalEndDate ||
                                  (rides?.extendBooking?.oldBooking?.length >
                                    0 &&
                                    rides?.extendBooking?.oldBooking[0]
                                      ?.BookingEndDateAndTime) ||
                                    rides?.BookingEndDateAndTime,
                                )
                            : item?.amount *
                                getDurationInDays(
                                  rides?.BookingStartDateAndTime,
                                  // rides?.extendBooking?.originalEndDate ||
                                  (rides?.extendBooking?.oldBooking?.length >
                                    0 &&
                                    rides?.extendBooking?.oldBooking[0]
                                      ?.BookingEndDateAndTime) ||
                                    rides?.BookingEndDateAndTime,
                                ),
                        )}`}</p>
                      </li>
                    ))
                  );
                } else {
                  if (
                    (rides?.stationData?.isGstActive === "inactive" &&
                      key === "tax") ||
                    (key === "addonTax" && value === 0)
                  ) {
                    return null;
                  }

                  if (typeof value === "number" && value === 0) {
                    return null;
                  }

                  return (
                    <li
                      key={key}
                      className={`flex items-center justify-between`}
                    >
                      <div className="my-1">
                        <div className="text-sm font-semibold uppercase">
                          {key === "tax"
                            ? `GST(${
                                rides?.vehicleMasterId?.gstPercentage || "--"
                              }%)`
                            : key === "bookingPrice"
                              ? "Booking Amount"
                              : camelCaseToSpaceSeparated(key)}
                          {key === "bookingPrice" &&
                            rides?.bookingPrice?.daysBreakdown && (
                              <span className="ml-1">
                                <Tooltip
                                  underLine={false}
                                  buttonMessage="(?)"
                                  tooltipData={renderTooltipBreakdown(
                                    rides?.bookingPrice?.appliedPlan ||
                                      rides?.bookingPrice?.appliedPlans,
                                    rides?.bookingPrice?.daysBreakdown,
                                  )}
                                />
                              </span>
                            )}
                        </div>
                      </div>
                      <p>{`₹${formatPrice(value)}`}</p>
                    </li>
                  );
                }
              })}

            {/* discount price  */}
            {rides?.bookingPrice?.discountPrice > 0 && (
              <li
                className={`flex items-center justify-between mt-1 my-1 ${
                  rides?.bookingPrice?.discountPrice ? "border-t-2" : ""
                }`}
              >
                <p className="text-sm font-semibold uppercase text-left">
                  Discount Price
                  <small className="text-sm font-semibold mx-1 block text-gray-400 italic">
                    Coupon: ({rides?.discountCuopon?.couponName})
                  </small>
                </p>
                <p className="font-semibold text-right">
                  {`- ₹${formatPrice(rides?.bookingPrice?.discountPrice)}`}
                </p>
              </li>
            )}

            {/* user paid */}
            {rides?.bookingPrice?.userPaid > 0 &&
              rides?.paymentStatus !== "pending" && (
                <>
                  <li className="flex items-center justify-between mt-1 my-1">
                    <p className="text-sm font-semibold uppercase text-left">
                      Amount Paid
                    </p>
                    <p className="text-sm font-bold text-right">
                      {`- ₹${formatPrice(rides?.bookingPrice?.userPaid)}`}
                    </p>
                  </li>
                  <li className="flex items-center justify-between mt-1 my-1">
                    <p className="text-sm font-bold uppercase text-left">
                      Remaining Amount
                      <small className="font-semibold text-xs mx-1 block text-gray-400 italic">
                        (
                        {rides?.bookingPrice?.AmountLeftAfterUserPaid
                          ?.paymentMethod
                          ? `Paid: ${rides?.bookingPrice?.AmountLeftAfterUserPaid?.paymentMethod}`
                          : "need to pay at pickup"}
                        )
                      </small>
                    </p>
                    <p className="text-sm font-bold text-right">
                      {`₹${formatPrice(
                        rides?.bookingPrice.AmountLeftAfterUserPaid?.amount ||
                          rides?.bookingPrice.AmountLeftAfterUserPaid,
                      )}`}
                    </p>
                  </li>
                </>
              )}

            {/* for refund process  */}
            {/* {(rides?.paymentStatus === "refundInt" ||
              rides?.paymentStatus === "refunded") && (
              <li className="flex items-center justify-between pt-1 mt-1 border-t-2">
                <p className="text-sm font-semibold uppercase text-left">
                  Refund Amount
                  <small className="font-semibold text-xs mx-1 block text-gray-400 italic">
                    (
                    {`${
                      rides?.paymentStatus === "refundInt"
                        ? "Refund Request Received"
                        : "Refunded"
                    }`}
                    )
                  </small>
                </p>
                <p className="text-sm font-bold text-right">
                  {`₹${formatPrice(rides?.bookingPrice?.refundAmount)}`}
                </p>
              </li>
            )} */}
            {/* difference amount  */}
            {/* {rides?.bookingPrice?.diffAmount?.length > 0 &&
              rides?.bookingPrice?.diffAmount[
                rides?.bookingPrice?.diffAmount?.length - 1
              ]?.amount > 0 && (
                <li className="flex items-center justify-between pt-1 mt-1 border-t-2">
                  <p className="text-sm font-semibold uppercase text-left">
                    Difference Amount
                    <small className="font-semibold text-xs mx-1 block text-gray-400 italic">
                      ({" "}
                      {rides?.bookingPrice?.diffAmount[
                        rides?.bookingPrice?.diffAmount?.length - 1
                      ]?.status === "unpaid"
                        ? "need to pay this amount"
                        : "Paid"}{" "}
                      )
                    </small>
                  </p>
                  <p className="text-sm font-bold text-right">
                    {`₹${formatPrice(
                      Number(
                        rides?.bookingPrice?.diffAmount[
                          rides?.bookingPrice?.diffAmount?.length - 1
                        ]?.amount
                      )
                    )}`}
                  </p>
                </li>
              )} */}

            {/* extend amount  */}
            {/* {rides?.bookingPrice?.extendAmount?.length > 0 && (
              <li className="flex items-center justify-between pt-1 mt-1">
                <p className="text-sm font-semibold uppercase text-left">
                  Extend Amount
                  <small className="font-semibold text-xs mx-1 block text-gray-400 italic">
                    (
                    {rides?.bookingPrice?.extendAmount[
                      rides?.bookingPrice?.extendAmount?.length - 1
                    ]?.status === "unpaid"
                      ? "New Price For Extend booking"
                      : "Paid"}
                    )
                  </small>
                </p>
                <p className="text-sm font-bold text-right">
                  {`₹${formatPrice(
                    Number(
                      rides?.bookingPrice?.extendAmount[
                        rides?.bookingPrice?.extendAmount?.length - 1
                      ]?.amount +
                        (rides?.bookingPrice?.extendAmount[
                          rides?.bookingPrice?.extendAmount?.length - 1
                        ]?.tax || 0) +
                        (rides?.bookingPrice?.extendAmount[
                          rides?.bookingPrice?.extendAmount?.length - 1
                        ]?.addonTax || 0)
                    )
                  )}`}
                </p>
              </li>
            )} */}

            {/* total price  */}
            <li className="flex items-center justify-between mt-1 border-t-2 pt-2 my-2">
              <p className="text-sm font-bold uppercase text-left">
                Total Price
              </p>
              <p className="text-sm font-extrabold text-right text-theme">
                {`₹${formatPrice(bookingPrice || 0)}`}
              </p>
            </li>

            {/* refunded amount  */}
            <li className="pt-1 mt-1 border-t-2">
              <div className="flex items-center">
                <p className="text-sm font-semibold uppercase text-left mr-1">
                  Security Deposit:
                </p>
                <p className="text-sm font-bold text-right">
                  {`₹${formatPrice(
                    Number(rides?.vehicleBasic?.refundableDeposit),
                  )}`}
                </p>
              </div>
              <p className="text-xs font-semibold mx-1 block text-gray-400 italic">
                (need to pay at pickup and will be refunded after drop)
              </p>
            </li>
          </ul>
        </>
      )}
    </>
  );
};

export default BookingFareDetails;
