import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { ExtendSummary, RideSummary } from "../RideSummary";

export const OrderSummaryList = () => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const booking = useMemo(() => vehicleMaster?.[0] ?? null, [vehicleMaster]);

  if (!booking) return null;

  const isExtension = booking?.bookingPrice?.extendAmount?.length > 0 ?? false;
  return (
    <div>
      {booking?.bookingPrice && (
        <RideSummary
          daysBreakdown={booking?.bookingPrice?.daysBreakdown}
          appliedPlans={booking?.bookingPrice?.appliedPlan}
          item={booking?.bookingPrice}
        />
      )}

      {booking?.bookingId && isExtension && (
        <ul className="leading-6 lg:leading-7 list-disc">
          {booking.bookingPrice.extendAmount.map((item) => (
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
    </div>
  );
};
