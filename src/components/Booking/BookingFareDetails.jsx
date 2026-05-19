import {
  camelCaseToSpaceSeparated,
  formatPrice,
  getDurationInDays,
} from "../../utils/index";
import Tooltip from "../../components/Tooltip/Tooltip";
import { renderTooltipBreakdown } from "../../utils/Helper/Helper";

const BookingFareDetails = ({ rides }) => {
  // --- prices ---
  const bookingPrice =
    rides?.bookingPrice?.isDiscountZero === true ||
    (rides?.bookingPrice?.discountTotalPrice &&
      rides?.bookingPrice?.discountTotalPrice !== 0)
      ? rides?.bookingPrice?.discountTotalPrice
      : rides?.bookingPrice?.totalPrice;

  return (
    <>
      {rides && (
        <>
          {rides?.bookingPrice?.isPackageApplied && (
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
            {Object.entries(rides?.bookingPrice || {})
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
                  key !== "extraAddonPrice" &&
                  key !== "daysBreakdown" &&
                  key !== "appliedPlan" &&
                  key !== "totalDrivenKm",
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
                          <p className="text-sm capitalize">{item?.name}</p>
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
                        <div className="text-sm capitalize">
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
            {/* discount price */}
            {rides?.bookingPrice?.discountPrice > 0 && (
              <li
                className={`flex items-center justify-between mt-1 my-1 ${
                  rides?.bookingPrice?.discountPrice ? "border-t-2" : ""
                }`}
              >
                <p className="text-sm capitalize text-left">
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
                    <p className="text-sm capitalize text-left">Amount Paid</p>
                    <p className="text-sm font-bold text-right">
                      {`- ₹${formatPrice(rides?.bookingPrice?.userPaid)}`}
                    </p>
                  </li>
                  <li className="flex items-center justify-between mt-1 my-1">
                    <p className="text-sm font-bold capitalize text-left">
                      Remaining Amount
                      <small className="text-xs mx-1 block text-gray-400 italic">
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
            {/* total price */}
            <li className="flex items-center justify-between mt-1 border-t-2 pt-2 my-2">
              <p className="text-sm capitalize text-left">Total Price</p>
              <p className="text-sm font-extrabold text-right text-theme">
                {`₹${formatPrice(bookingPrice || 0)}`}
              </p>
            </li>
            {/* refunded amount */}
            <li className="pt-1 mt-1 border-t-2">
              <div className="flex items-center">
                <p className="text-sm capitalize text-left mr-1">
                  Security Deposit:
                </p>
                <p className="text-sm text-right">
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
