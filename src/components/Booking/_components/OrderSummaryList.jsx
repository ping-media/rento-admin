import React from "react";
import { ExtendSummary, RideSummary } from "../RideSummary";

export const OrderSummaryList = React.memo(({ booking }) => {
  if (!booking) return null;

  const extendList = booking?.bookingPrice?.extendAmount ?? [];
  const hasExtension = extendList.length > 0;

  return (
    <>
      {booking?.bookingPrice && (
        <RideSummary
          daysBreakdown={booking?.bookingPrice?.daysBreakdown}
          appliedPlans={booking?.bookingPrice?.appliedPlan}
          item={booking?.bookingPrice}
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
                item={item}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
});
