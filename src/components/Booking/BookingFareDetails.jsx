import {
  camelCaseToSpaceSeparated,
  formatPrice,
  getDurationInDays,
} from "../../utils/index";

const BookingFareDetails = ({ rides }) => {
  return (
    <>
      {rides && (
        <>
          {rides?.bookingPrice.isPackageApplied && (
            <div className="text-gray-500 mb-1.5">
              <span className="font-bold">Package:</span>
              {`(${getDurationInDays(
                rides?.BookingStartDateAndTime,
                rides?.extendBooking?.originalEndDate
                  ? rides?.extendBooking?.originalEndDate
                  : rides?.BookingEndDateAndTime
              )} days Package Applied)`}
            </div>
          )}
          <ul className="w-full leading-8 mb-2">
            {Object.entries(rides?.bookingPrice)
              .filter(
                ([key, value]) =>
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
                  !(key === "extraAddonPrice" && value === 0)
              ) // Exclude totalPrice
              .map(([key, value]) => (
                <li
                  key={key}
                  className="flex items-center justify-between border-b-2"
                >
                  <div className="my-1">
                    <p className="text-sm font-semibold uppercase">
                      {key == "tax"
                        ? `${camelCaseToSpaceSeparated(key)} (18% GST)`
                        : camelCaseToSpaceSeparated(key)}
                    </p>
                    {key != "tax" &&
                      key != "userPaid" &&
                      value != 0 &&
                      !rides?.bookingPrice.isPackageApplied && (
                        <p className="text-xs text-gray-500 mb-1">
                          (
                          {key == "extraAddonPrice"
                            ? `₹${50} x ${getDurationInDays(
                                rides?.BookingStartDateAndTime,
                                rides?.extendBooking?.originalEndDate ||
                                  rides?.BookingEndDateAndTime
                              )} ${
                                getDurationInDays(
                                  rides?.BookingStartDateAndTime,
                                  rides?.extendBooking?.originalEndDate ||
                                    rides?.BookingEndDateAndTime
                                ) == 1
                                  ? "day"
                                  : "days"
                              } (Extra Helmet)`
                            : `₹${
                                rides?.bookingPrice?.rentAmount
                              } x ${getDurationInDays(
                                rides?.BookingStartDateAndTime,
                                rides?.extendBooking?.originalEndDate ||
                                  rides?.BookingEndDateAndTime
                              )} ${
                                getDurationInDays(
                                  rides?.BookingStartDateAndTime,
                                  rides?.extendBooking?.originalEndDate ||
                                    rides?.BookingEndDateAndTime
                                ) == 1
                                  ? "day"
                                  : "days"
                              }`}
                          )
                        </p>
                      )}
                  </div>
                  <p>{`₹${formatPrice(value)}`}</p>
                </li>
              ))}

            {/* Display the totalPrice & user paid & remaining amount last */}
            {/* totalPrice */}
            {rides?.bookingPrice?.totalPrice && (
              <li className="flex items-center justify-between mt-1 my-1">
                <p className="text-sm font-bold uppercase text-left">
                  {rides?.bookingPrice?.discountPrice &&
                  rides?.bookingPrice?.discountPrice != 0
                    ? "Subtotal"
                    : "Total Price"}
                  <small className="font-semibold text-xs mx-1 block text-gray-400 italic">
                    {rides?.bookingPrice?.discountPrice &&
                    rides?.bookingPrice?.discountPrice != 0
                      ? ""
                      : rides?.paymentMethod == "online" &&
                        rides?.paySuccessId != "NA"
                      ? "(Full Paid)"
                      : rides?.paymentMethod == "partiallyPay"
                      ? ""
                      : rides?.bookingPrice?.payOnPickupMethod
                      ? `(${rides?.bookingPrice?.payOnPickupMethod})`
                      : "(need to pay at pickup)"}
                  </small>
                </p>
                <p className="text-sm font-extrabold text-right text-theme">
                  {`₹${formatPrice(rides?.bookingPrice?.totalPrice)}`}
                </p>
              </li>
            )}
            {/* discount price  */}
            {rides?.bookingPrice?.discountPrice > 0 && (
              <li
                className={`flex items-center justify-between mt-1 my-1 ${
                  rides?.bookingPrice?.discountPrice ? "border-t-2" : ""
                }`}
              >
                <p className="text-sm font-semibold uppercase text-left">
                  Discount Price
                  <small className="text-sm font-semibold text-xs mx-1 block text-gray-400 italic">
                    Coupon: ({rides?.discountCuopon?.couponName})
                  </small>
                </p>
                <p className="font-semibold text-right">
                  {`- ₹${formatPrice(rides?.bookingPrice?.discountPrice)}`}
                </p>
              </li>
            )}

            {/* total price  */}
            {(rides?.bookingPrice?.isDiscountZero === true ||
              rides?.bookingPrice?.discountTotalPrice > 0) && (
              <li
                className={`flex items-center justify-between mt-1 my-1 ${
                  rides?.bookingPrice?.userPaid ? "border-b-2" : ""
                }`}
              >
                <p className="text-sm font-bold uppercase text-left">
                  Total Price
                  <small className="font-semibold text-xs mx-1 block text-gray-400 italic">
                    {rides?.paymentMethod == "online" &&
                    rides?.paySuccessId !== "NA"
                      ? "(Full Paid)"
                      : rides?.paymentMethod == "partiallyPay"
                      ? ""
                      : rides?.bookingPrice?.isDiscountZero === true
                      ? ""
                      : rides?.bookingPrice?.payOnPickupMethod
                      ? `(${rides?.bookingPrice?.payOnPickupMethod})`
                      : "(Need to pay at pickup)"}
                  </small>
                </p>
                <p className="text-sm font-extrabold text-right text-theme">
                  {`₹${formatPrice(rides?.bookingPrice?.discountTotalPrice)}`}
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
                    <p className="text-sm font-bold text-right text-theme">
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
                          rides?.bookingPrice.AmountLeftAfterUserPaid
                      )}`}
                    </p>
                  </li>
                </>
              )}
            {/* for refund process  */}
            {(rides?.paymentStatus === "refundInt" ||
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
            )}
            {/* difference amount  */}
            {rides?.bookingPrice?.diffAmount?.length > 0 &&
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
              )}
            {/* extend amount  */}
            {rides?.bookingPrice?.extendAmount?.length > 0 && (
              <li className="flex items-center justify-between pt-1 mt-1 border-t-2">
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
                <p className="text-sm font-bold text-right text-theme">
                  {`₹${formatPrice(
                    Number(
                      rides?.bookingPrice?.extendAmount[
                        rides?.bookingPrice?.extendAmount?.length - 1
                      ]?.amount
                    )
                  )}`}
                </p>
              </li>
            )}
            {/* refunded amount  */}
            <li className="flex items-center justify-between pt-1 mt-1 border-t-2">
              <p className="text-sm font-semibold uppercase text-left">
                Refundable Deposit Amount
                <small className="font-semibold text-xs mx-1 block text-gray-400 italic">
                  (need to pay at pickup and will be refunded after drop)
                </small>
              </p>
              <p className="text-sm font-bold text-right">
                {`₹${formatPrice(
                  Number(rides?.vehicleBasic?.refundableDeposit)
                )}`}
              </p>
            </li>
          </ul>
        </>
      )}
    </>
  );
};

export default BookingFareDetails;
