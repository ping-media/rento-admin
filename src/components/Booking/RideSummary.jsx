import React from "react";
import { formatPrice } from "../../utils/index";

const ExtendSummary = ({
  appliedPlans,
  daysBreakdown,
  item,
  bookingDuration,
}) => {
  const weekend =
    daysBreakdown?.length > 0
      ? daysBreakdown?.filter((day) => day.isWeekend === true)
      : [];

  const weekDays =
    daysBreakdown?.length > 0
      ? daysBreakdown?.filter((day) => day.isWeekend === false)
      : [];

  const isAddOnTaxApplicable = Number(item?.addonTax ?? 0) > 0;
  const addOnAmount =
    Number(item?.addOnAmount ?? 0) + Number(item?.addonTax ?? 0);

  return (
    <div className="p-2 mb-2 rounded-md bg-theme/10">
      <div className="w-full flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold capitalize">
            {`${Number(item?.id || 0) + 1}.`} Extension
            {/* {camelCaseToSpaceSeparated(item?.title)} */}
          </span>
          <span className="text-sm font-semibold mx-1">:</span>
          {bookingDuration && (
            <span className="text-sm font-semibold">
              {bookingDuration} Day(s)
            </span>
          )}
        </div>
        <div>
          <span className="text-sm font-bold text-theme ml-1">
            ₹
            {formatPrice(
              item?.amount +
                // (Number(item?.addOnAmount) || 0) +
                (Number(item?.tax) || 0) +
                (Number(item?.addonTax) || 0),
            )}
          </span>
          {item?.status === "unpaid" && (
            <span
              className={`text-sm font-bold ${
                item?.status === "paid" ? "text-green-400" : "text-red-400"
              }`}
            >
              ({item?.status})
            </span>
          )}
        </div>
      </div>
      <div className="text-xs">
        {appliedPlans?.length > 0 &&
          appliedPlans.map((plan, index) => (
            <React.Fragment key={`${plan.id}_${index}`}>
              <span>
                {plan?.days} Days Package: ₹{plan?.planPrice}{" "}
                {plan?.count > 1 && `x ${plan?.count}`}
              </span>
              {index < appliedPlans.length - 1 && (
                <span className="mx-2">|</span>
              )}
            </React.Fragment>
          ))}

        {weekend?.length > 0 && (
          <>
            {appliedPlans?.length > 0 && <span className="mx-2">|</span>}
            <span>
              Weekend ₹{weekend[0]?.dailyRate} x {weekend?.length}
            </span>
            <span className="mx-2">|</span>
          </>
        )}
        {weekDays?.length > 0 && (
          <span>
            Weekday ₹{weekDays[0]?.dailyRate} x {weekDays?.length}
          </span>
        )}
      </div>

      <div className="text-xs">
        {addOnAmount > 0 ? (
          <p className="text-xs">
            <span className="mr-1">
              Addon{isAddOnTaxApplicable ? "(include GST)" : ""}:
            </span>
            ₹{addOnAmount}{" "}
            {isAddOnTaxApplicable ? (
              <span className="mr-1">+ {item?.addonTax}</span>
            ) : null}
          </p>
        ) : null}
      </div>
    </div>
  );
};

const RideSummary = ({
  appliedPlans,
  daysBreakdown,
  item,
  mainBookingDuration,
}) => {
  const weekend =
    daysBreakdown?.length > 0
      ? daysBreakdown?.filter((day) => day.isWeekend === true)
      : [];
  const weekDays =
    daysBreakdown?.length > 0
      ? daysBreakdown?.filter((day) => day.isWeekend === false)
      : [];

  const isDiscountApplied = item.isDiscountZero || item.discountTotalPrice > 0;

  return (
    <div className="p-2 mb-2 rounded-md bg-theme/10">
      <div className="w-full flex items-center justify-between">
        <div>
          <div>
            <span className="text-sm font-semibold capitalize">
              1. Main Booking
            </span>
            <span className="text-sm font-semibold mx-1">:</span>
            <span className="text-sm font-semibold">
              {mainBookingDuration} Day(s)
            </span>
          </div>
        </div>
        <div>
          <span
            className={`text-sm font-bold text-theme ml-1 ${isDiscountApplied ? "line-through font-medium" : "font-bold"}`}
          >
            ₹{formatPrice(item?.totalPrice)}
          </span>
          {isDiscountApplied && (
            <span className="text-sm font-bold text-theme ml-1">
              ₹{formatPrice(item.discountTotalPrice)}
            </span>
          )}
          {item?.status === "unpaid" && (
            <span
              className={`text-sm font-bold ${
                item?.status === "paid" ? "text-green-400" : "text-red-400"
              }`}
            >
              ({item?.status})
            </span>
          )}
        </div>
      </div>
      <div className="text-xs">
        {appliedPlans?.length > 0 && (
          <>
            <span>
              {appliedPlans[0]?.days} Days Package ₹{appliedPlans[0]?.planPrice}{" "}
              {`x ${appliedPlans[0]?.count}`}
            </span>
            <span
              className={`mx-2 ${
                weekend?.length > 0 || weekDays?.length > 0
                  ? "inline"
                  : "hidden"
              }`}
            >
              |
            </span>
          </>
        )}
        {weekend?.length > 0 && (
          <>
            <span>
              Weekend ₹{weekend[0]?.dailyRate} x {weekend?.length}
            </span>
            <span
              className={`mx-2 ${weekDays?.length > 0 ? "inline" : "hidden"}`}
            >
              |
            </span>
          </>
        )}
        {weekDays?.length > 0 && (
          <span>
            Weekday ₹{weekDays[0]?.dailyRate} x {weekDays?.length}
          </span>
        )}
      </div>
      {Number(item?.extraAddonPrice ?? 0) > 0 ? (
        <div className="text-xs">
          <span>Accessories: ₹{item.extraAddonPrice}</span>
        </div>
      ) : null}
    </div>
  );
};

export { ExtendSummary, RideSummary };
