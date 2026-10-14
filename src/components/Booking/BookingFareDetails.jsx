import {
  camelCaseToSpaceSeparated,
  formatPrice,
  getDurationInDays,
} from "../../utils/index";
import Tooltip from "../../components/Tooltip/Tooltip";
import { renderTooltipBreakdown } from "../../utils/Helper/Helper";
import {
  calculateBookingPrice,
  calculateExtensionAmount,
} from "../../utils/calculateBookingPrice";

const EXCLUDED_BOOKING_PRICE_KEYS = new Set([
  "totalPrice",
  "vehiclePrice",
  "rentAmount",
  "isPackageApplied",
  "userPaid",
  "discountPrice",
  "discountTotalPrice",
  "isInvoiceCreated",
  "isPickupImageAdded",
  "isDiscountZero",
  "isChanged",
  "extendAmount",
  "diffAmount",
  "AmountLeftAfterUserPaid",
  "lateFeeBasedOnHour",
  "lateFeeBasedOnKM",
  "payOnPickupMethod",
  "lateFeePaymentMethod",
  "additionFeePaymentMethod",
  "additionalPrice",
  "refundAmount",
  "rrnNumber",
  "extraAddonPrice",
  "daysBreakdown",
  "appliedPlan",
  "totalDrivenKm",
  "tempId",
  "isRealAssigned",
  "extendAmountBackup",
]);

const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

// billed days = days covered by packages + individually priced days
const getBilledDays = (bp) => {
  const planDays = toArray(bp?.appliedPlan || bp?.appliedPlans).reduce(
    (sum, p) => sum + Number(p?.days || 0) * Number(p?.count || 1),
    0,
  );
  const dailyDays = bp?.daysBreakdown?.length || 0;
  return planDays + dailyDays || 1;
};

// build every main-booking row as data first, then the UI just maps it
const buildMainRows = (rides, fallbackBaseAmount) => {
  const bp = rides?.bookingPrice || {};
  const days = getBilledDays(bp);

  const addonRows = [];
  const otherRows = [];
  let addonTotal = 0;

  Object.entries(bp).forEach(([key, value]) => {
    if (EXCLUDED_BOOKING_PRICE_KEYS.has(key) || key === "bookingPrice") return;

    // add-ons (arrays like helmet, etc.)
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const rate = Number(item?.amount || 0);
        const max = Number(item?.maxAmount || 0);
        const raw = rate * days;
        const isCapped = max > 0 && raw > max;

        let amount = isCapped ? max : raw;
        // single add-on: trust the amount saved at booking time
        if (value.length === 1 && Number(bp.extraAddonPrice) > 0) {
          amount = Number(bp.extraAddonPrice);
        }

        addonTotal += amount;
        addonRows.push({
          id: `${key}-${index}`,
          label: item?.name,
          sub: isCapped
            ? `(₹${rate} x ${days} days)`
            : `(₹${rate} x ${days} ${days === 1 ? "day" : "days"})`,
          amount,
        });
      });
      return;
    }

    if (value && typeof value === "object") return;
    if (typeof value === "number" && value === 0) return;
    if (key === "tax" && rides?.stationData?.isGstActive === "inactive") return;

    otherRows.push({
      id: key,
      label:
        key === "tax"
          ? `GST(${rides?.vehicleMasterId?.gstPercentage || "--"}%)`
          : camelCaseToSpaceSeparated(key),
      amount: value,
    });
  });

  // base rent: use the saved bookingPrice, else total minus add-ons
  const baseAmount =
    Number(bp.bookingPrice) || Math.max(fallbackBaseAmount - addonTotal, 0);

  const bookingRow = {
    id: "bookingPrice",
    label: "Booking Amount",
    amount: baseAmount,
    showBreakdown: !!bp.daysBreakdown,
  };

  return [bookingRow, ...addonRows, ...otherRows];
};

const getDiffNet = (bp) => {
  const diffs = Array.isArray(bp?.diffAmount) ? bp.diffAmount : [];

  // cash / merged case: only the price difference of the latest merged change
  const merged = diffs
    .filter(
      (d) =>
        d?.title === "changedVehicle" &&
        d?.mergedIntoBookingBalance &&
        Number(d?.newAmount) > Number(d?.oldAmount),
    )
    .at(-1);

  let net = merged
    ? Number(merged.newAmount || 0) - Number(merged.oldAmount || 0)
    : 0;

  // paid entries: amount minus refund
  diffs.forEach((d) => {
    if (!d || d.status !== "paid") return;
    net += Number(d.amount || 0) - Number(d.refundAmount || 0);
  });

  return net;
};

const BookingFareDetails = ({ rides }) => {
  const totalBookingPrice = calculateBookingPrice(rides?.bookingPrice);
  const extensionAmount = calculateExtensionAmount(rides?.bookingPrice);
  const diffNet = getDiffNet(rides?.bookingPrice);
  // const baseBookingPrice = totalBookingPrice - extensionAmount;
  const baseBookingPrice = totalBookingPrice - extensionAmount - diffNet;

  const mainRows = buildMainRows(rides, baseBookingPrice);

  if (!rides) return null;

  return (
    <ul className="w-full leading-8 mb-2">
      {mainRows.map((row) => (
        <li key={row.id} className="flex items-center justify-between">
          <div className="my-1">
            <div className="text-sm capitalize">
              {row.label}
              {row.showBreakdown && (
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
            {row.sub && (
              <p className="text-xs text-gray-500 mb-1 leading-normal">
                {row.sub}
              </p>
            )}
          </div>
          <p>{`₹${formatPrice(row.amount)}`}</p>
        </li>
      ))}

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
                  {rides?.bookingPrice?.AmountLeftAfterUserPaid?.paymentMethod
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

      {extensionAmount > 0 && (
        <li className="flex items-center justify-between mt-1 my-1">
          <p className="text-sm capitalize text-left">Extension's</p>
          <p className="text-sm font-semibold text-right">
            {`₹${formatPrice(extensionAmount)}`}
          </p>
        </li>
      )}

      {diffNet !== 0 && (
        <li className="flex items-center justify-between mt-1 my-1">
          <p className="text-sm capitalize text-left">
            Vehicle Change
            <small className="text-xs mx-1 block text-gray-400 italic">
              {diffNet > 0 ? "(Extra paid)" : "(Refunded)"}
            </small>
          </p>
          <p className="text-sm font-semibold text-right">
            {diffNet < 0
              ? `- ₹${formatPrice(Math.abs(diffNet))}`
              : `₹${formatPrice(diffNet)}`}
          </p>
        </li>
      )}

      {/* total price */}
      <li className="flex items-center justify-between mt-1 border-t-2 pt-2 my-2">
        <p className="text-sm capitalize text-left">Total Price</p>
        <p className="text-sm font-extrabold text-right text-theme">
          {`₹${formatPrice(totalBookingPrice || 0)}`}
        </p>
      </li>
      {/* refunded amount */}
      <li className="pt-1 mt-1 border-t-2">
        <div className="flex items-center">
          <p className="text-sm capitalize text-left mr-1">Security Deposit:</p>
          <p className="text-sm text-right">
            {`₹${formatPrice(Number(rides?.vehicleBasic?.refundableDeposit))}`}
          </p>
        </div>
        <p className="text-xs font-semibold mx-1 block text-gray-400 italic">
          (need to pay at pickup and will be refunded after drop)
        </p>
      </li>
    </ul>
  );
};

// const BookingFareDetails = ({ rides }) => {
//   const totalBookingPrice = calculateBookingPrice(rides?.bookingPrice);
//   const extensionAmount = calculateExtensionAmount(rides?.bookingPrice);
//   const baseBookingPrice = totalBookingPrice - extensionAmount;

//   return (
//     <>
//       {rides && (
//         <>
//           {rides?.bookingPrice?.isPackageApplied && (
//             <div className="text-gray-500 mb-1.5">
//               <span className="font-bold">Package:</span>
//               {`(${getDurationInDays(
//                 rides?.BookingStartDateAndTime,
//                 rides?.bookingPrice?.extendAmount?.[0]
//                   ?.originalBookingEndDateAndTime
//                   ? rides?.bookingPrice?.extendAmount?.[0]
//                       ?.originalBookingEndDateAndTime
//                   : rides?.BookingEndDateAndTime,
//               )} days Package Applied)`}
//             </div>
//           )}

//           <ul className="w-full leading-8 mb-2">
//             {Object.entries(rides?.bookingPrice || {})
//               .filter(([key]) => !EXCLUDED_BOOKING_PRICE_KEYS.has(key))
//               .map(([key, value]) => {
//                 if (typeof value === "object") {
//                   return (
//                     value?.length > 0 &&
//                     value?.map((item, index) => (
//                       <li
//                         key={`key-${index}`}
//                         className={`flex items-center justify-between ${
//                           index === value.length - 1 ? "" : "border-b-2"
//                         }`}
//                       >
//                         <div className="my-1">
//                           <p className="text-sm capitalize">{item?.name}</p>
//                           <p className="text-xs text-gray-500 mb-1">
//                             (
//                             {`₹${item?.amount} x ${getDurationInDays(
//                               rides?.BookingStartDateAndTime,
//                               (rides?.extendBooking?.oldBooking?.length > 0 &&
//                                 rides?.extendBooking?.oldBooking[0]
//                                   ?.BookingEndDateAndTime) ||
//                                 rides?.BookingEndDateAndTime,
//                             )} ${
//                               getDurationInDays(
//                                 rides?.BookingStartDateAndTime,
//                                 (rides?.extendBooking?.oldBooking?.length > 0 &&
//                                   rides?.extendBooking?.oldBooking[0]
//                                     ?.BookingEndDateAndTime) ||
//                                   rides?.BookingEndDateAndTime,
//                               ) == 1
//                                 ? "day"
//                                 : "days"
//                             }`}
//                             )
//                           </p>
//                         </div>
//                         <p>{`₹${formatPrice(
//                           item?.maxAmount > 0
//                             ? item?.amount *
//                                 getDurationInDays(
//                                   rides?.BookingStartDateAndTime,
//                                   (rides?.extendBooking?.oldBooking?.length >
//                                     0 &&
//                                     rides?.extendBooking?.oldBooking[0]
//                                       ?.BookingEndDateAndTime) ||
//                                     rides?.BookingEndDateAndTime,
//                                 ) >
//                               item?.maxAmount
//                               ? item?.maxAmount
//                               : item?.amount *
//                                 getDurationInDays(
//                                   rides?.BookingStartDateAndTime,
//                                   (rides?.extendBooking?.oldBooking?.length >
//                                     0 &&
//                                     rides?.extendBooking?.oldBooking[0]
//                                       ?.BookingEndDateAndTime) ||
//                                     rides?.BookingEndDateAndTime,
//                                 )
//                             : item?.amount *
//                                 getDurationInDays(
//                                   rides?.BookingStartDateAndTime,
//                                   (rides?.extendBooking?.oldBooking?.length >
//                                     0 &&
//                                     rides?.extendBooking?.oldBooking[0]
//                                       ?.BookingEndDateAndTime) ||
//                                     rides?.BookingEndDateAndTime,
//                                 ),
//                         )}`}</p>
//                       </li>
//                     ))
//                   );
//                 } else {
//                   if (
//                     (rides?.stationData?.isGstActive === "inactive" &&
//                       key === "tax") ||
//                     (key === "addonTax" && value === 0)
//                   ) {
//                     return null;
//                   }

//                   if (typeof value === "number" && value === 0) {
//                     return null;
//                   }

//                   return (
//                     <li
//                       key={key}
//                       className={`flex items-center justify-between`}
//                     >
//                       <div className="my-1">
//                         <div className="text-sm capitalize">
//                           {key === "tax"
//                             ? `GST(${
//                                 rides?.vehicleMasterId?.gstPercentage || "--"
//                               }%)`
//                             : key === "bookingPrice"
//                               ? "Booking Amount"
//                               : camelCaseToSpaceSeparated(key)}
//                           {key === "bookingPrice" &&
//                             rides?.bookingPrice?.daysBreakdown && (
//                               <span className="ml-1">
//                                 <Tooltip
//                                   underLine={false}
//                                   buttonMessage="(?)"
//                                   tooltipData={renderTooltipBreakdown(
//                                     rides?.bookingPrice?.appliedPlan ||
//                                       rides?.bookingPrice?.appliedPlans,
//                                     rides?.bookingPrice?.daysBreakdown,
//                                   )}
//                                 />
//                               </span>
//                             )}
//                         </div>
//                       </div>
//                       <p>
//                         {`₹${formatPrice(
//                           key === "bookingPrice" ? baseBookingPrice : value,
//                         )}`}
//                       </p>
//                     </li>
//                   );
//                 }
//               })}
//             {/* discount price */}
//             {rides?.bookingPrice?.discountPrice > 0 && (
//               <li
//                 className={`flex items-center justify-between mt-1 my-1 ${
//                   rides?.bookingPrice?.discountPrice ? "border-t-2" : ""
//                 }`}
//               >
//                 <p className="text-sm capitalize text-left">
//                   Discount Price
//                   <small className="text-sm font-semibold mx-1 block text-gray-400 italic">
//                     Coupon: ({rides?.discountCuopon?.couponName})
//                   </small>
//                 </p>
//                 <p className="font-semibold text-right">
//                   {`- ₹${formatPrice(rides?.bookingPrice?.discountPrice)}`}
//                 </p>
//               </li>
//             )}
//             {/* user paid */}
//             {rides?.bookingPrice?.userPaid > 0 &&
//               rides?.paymentStatus !== "pending" && (
//                 <>
//                   <li className="flex items-center justify-between mt-1 my-1">
//                     <p className="text-sm capitalize text-left">Amount Paid</p>
//                     <p className="text-sm font-bold text-right">
//                       {`- ₹${formatPrice(rides?.bookingPrice?.userPaid)}`}
//                     </p>
//                   </li>
//                   <li className="flex items-center justify-between mt-1 my-1">
//                     <p className="text-sm font-bold capitalize text-left">
//                       Remaining Amount
//                       <small className="text-xs mx-1 block text-gray-400 italic">
//                         (
//                         {rides?.bookingPrice?.AmountLeftAfterUserPaid
//                           ?.paymentMethod
//                           ? `Paid: ${rides?.bookingPrice?.AmountLeftAfterUserPaid?.paymentMethod}`
//                           : "need to pay at pickup"}
//                         )
//                       </small>
//                     </p>
//                     <p className="text-sm font-bold text-right">
//                       {`₹${formatPrice(
//                         rides?.bookingPrice.AmountLeftAfterUserPaid?.amount ||
//                           rides?.bookingPrice.AmountLeftAfterUserPaid,
//                       )}`}
//                     </p>
//                   </li>
//                 </>
//               )}

//             {extensionAmount > 0 && (
//               <li className="flex items-center justify-between mt-1 my-1">
//                 <p className="text-sm capitalize text-left">Extension's</p>
//                 <p className="text-sm font-semibold text-right">
//                   {`₹${formatPrice(extensionAmount)}`}
//                 </p>
//               </li>
//             )}

//             {/* total price */}
//             <li className="flex items-center justify-between mt-1 border-t-2 pt-2 my-2">
//               <p className="text-sm capitalize text-left">Total Price</p>
//               <p className="text-sm font-extrabold text-right text-theme">
//                 {`₹${formatPrice(totalBookingPrice || 0)}`}
//               </p>
//             </li>
//             {/* refunded amount */}
//             <li className="pt-1 mt-1 border-t-2">
//               <div className="flex items-center">
//                 <p className="text-sm capitalize text-left mr-1">
//                   Security Deposit:
//                 </p>
//                 <p className="text-sm text-right">
//                   {`₹${formatPrice(
//                     Number(rides?.vehicleBasic?.refundableDeposit),
//                   )}`}
//                 </p>
//               </div>
//               <p className="text-xs font-semibold mx-1 block text-gray-400 italic">
//                 (need to pay at pickup and will be refunded after drop)
//               </p>
//             </li>
//           </ul>
//         </>
//       )}
//     </>
//   );
// };

export default BookingFareDetails;
