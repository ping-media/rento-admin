import React from "react";
import { ExtendSummary, RideSummary } from "../RideSummary";
import { getDurationInDays } from "../../../utils";

export const OrderSummaryList = React.memo(({ booking }) => {
  if (!booking) return null;

  const extendList = booking?.bookingPrice?.extendAmount ?? [];
  const hasExtension = extendList.length > 0;

  const startDate = booking?.BookingStartDateAndTime;
  const endDate = hasExtension
    ? booking?.bookingPrice?.extendAmount[0]?.BookingStartDateAndTime
    : booking?.BookingEndDateAndTime;

  const mainBookingDuration = getDurationInDays(startDate, endDate, "ceil");

  return (
    <>
      {booking?.bookingPrice && (
        <RideSummary
          daysBreakdown={booking?.bookingPrice?.daysBreakdown}
          appliedPlans={booking?.bookingPrice?.appliedPlan}
          item={booking?.bookingPrice}
          mainBookingDuration={mainBookingDuration}
        />
      )}

      {/* {booking?.bookingId && isExtension && ( */}
      {hasExtension && (
        <ul className="leading-6 lg:leading-7 list-disc">
          {extendList.map((item) => (
            <li className="flex flex-col" key={item.id}>
              <ExtendSummary
                daysBreakdown={item?.daysBreakdown ?? []}
                appliedPlans={item?.appliedPlans ?? []}
                bookingDuration={item?.extendDuration || 0}
                item={item}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
});
