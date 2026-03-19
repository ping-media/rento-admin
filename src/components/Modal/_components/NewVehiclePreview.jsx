import React from "react";
import { formatPrice } from "../../../utils";

const NewVehiclePreview = ({
  previewData,
  showBreakdown,
  setShowBreakdown,
}) => {
  return (
    <>
      <div className="flex items-center justify-between border-t border-gray-600/20 pt-1">
        <h2 className="text-left font-semibold">New Vehicle Info</h2>
        <p className="text-sm capitalize">
          {previewData?.newVehicle?.vehicleNumber}(
          {`${previewData?.newVehicle?.vehicleBrand} ${previewData?.newVehicle?.vehicleName}`}
          )
        </p>
      </div>

      {!showBreakdown ? (
        <>
          <ul className="leading-7 text-left mb-1 text-sm">
            <li className="font-semibold text-gray-600">
              Remaining days: {previewData?.priceSummary?.daysLeft} day(s) (
              {previewData?.priceSummary?.segmentType} period)
            </li>
            <li>
              Current vehicle value for remaining days:{" "}
              <span className="font-semibold">
                ₹ {formatPrice(previewData?.priceSummary?.oldRemainingValue)}
              </span>
            </li>
            <li>
              New vehicle cost for remaining days:{" "}
              <span className="font-semibold">
                ₹ {formatPrice(previewData?.priceSummary?.newRemainingCost)}
              </span>
            </li>
            <li>
              New vehicle total price:{" "}
              <span className="font-semibold">
                ₹{" "}
                {formatPrice(
                  previewData?.newVehicle?.totalRentalCost +
                    (previewData?.newVehicle?.tax || 0),
                )}
              </span>
            </li>
          </ul>

          <div className="mt-1 border-t border-gray-600/20 flex flex-wrap md:flex-nowrap items-center justify-between pt-1">
            {previewData?.priceSummary?.isFreeSwap && (
              <p className="text-left text-sm font-semibold text-green-600">
                Free Change — no payment required
              </p>
            )}
            {previewData?.priceSummary?.isExtraPayment && (
              <p className="text-left text-sm font-semibold text-red-600">
                Extra payment required: ₹{" "}
                {formatPrice(previewData?.priceSummary?.difference)}
              </p>
            )}
            {previewData?.priceSummary?.isRefund && (
              <p className="text-left text-sm font-semibold text-yellow-600">
                Refund to customer: ₹{" "}
                {formatPrice(previewData?.priceSummary?.difference)}
              </p>
            )}
            <button
              type="button"
              onClick={() => setShowBreakdown(true)}
              className="text-sm text-theme underline mt-1"
            >
              View price breakdown
            </button>
          </div>
        </>
      ) : (
        <>
          <ul className="leading-7 text-left mb-1 text-sm">
            {/* Applied plans */}
            {previewData?.newVehicle?.appliedPlans?.length > 0 && (
              <>
                <li className="font-semibold text-gray-600">Plans Applied:</li>
                {previewData.newVehicle.appliedPlans.map((plan, i) => (
                  <li key={i} className="pl-2">
                    {plan.days} day plan × {plan.count} ={" "}
                    <span className="font-semibold">
                      ₹ {formatPrice(plan.planPrice * plan.count)}
                    </span>
                  </li>
                ))}
              </>
            )}

            {/* Per day breakdown */}
            {previewData?.newVehicle?._daysBreakdown?.length > 0 && (
              <>
                <li className="font-semibold text-gray-600 mt-1">
                  Per Day Charges:
                </li>
                {previewData.newVehicle._daysBreakdown.map((day, i) => (
                  <li key={i} className="pl-2 flex justify-between">
                    <span>
                      {new Date(day.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                      {day.weekendPriceApplied && (
                        <span className="ml-1 text-xs text-orange-500">
                          (weekend)
                        </span>
                      )}
                    </span>
                    <span className="font-semibold">
                      ₹ {formatPrice(day.dailyRate)}
                    </span>
                  </li>
                ))}
              </>
            )}

            {/* Tax if any */}
            {previewData?.newVehicle?.tax > 0 && (
              <li className="flex justify-between border-t border-gray-400/30 pt-1 mt-1">
                <span>Tax</span>
                <span className="font-semibold">
                  ₹ {formatPrice(previewData.newVehicle.tax)}
                </span>
              </li>
            )}

            {/* Total */}
            <li className="flex justify-between border-t border-gray-400/30 pt-1 font-semibold">
              <span>Total</span>
              <span>
                ₹{" "}
                {formatPrice(
                  previewData?.newVehicle?.totalRentalCost +
                    (previewData?.newVehicle?.tax || 0),
                )}
              </span>
            </li>
          </ul>

          <button
            type="button"
            onClick={() => setShowBreakdown(false)}
            className="text-sm text-theme underline mt-1 text-left"
          >
            Back to summary
          </button>
        </>
      )}
    </>
  );
};

export default NewVehiclePreview;
