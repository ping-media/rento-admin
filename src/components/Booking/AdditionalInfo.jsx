import { useSelector } from "react-redux";
import ExtraAmount from "./ExtraAmount";
import {
  formatNumber,
  formatPrice,
  getDurationInDays,
} from "../../utils/index";
import CopyButton from "../Buttons/CopyButton";
import { ExtendSummary, RideSummary } from "./RideSummary";

const AdditionalInfo = () => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);

  const diffAmount = vehicleMaster[0]?.bookingPrice?.diffAmount
    ? vehicleMaster[0]?.bookingPrice?.diffAmount[
        vehicleMaster[0]?.bookingPrice?.diffAmount?.length - 1
      ]
    : null;

  const booking = vehicleMaster?.[0];
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

  return (
    <>
      {/* ride otp's  */}
      <div className="mb-2">
        {((diffAmount !== null && diffAmount?.rideStatus === false) ||
          vehicleMaster[0]?.rideStatus !== "ongoing") && (
          <div className="w-full flex items-center justify-between  flex items-center">
            <p className="font-semibold mr-1">Start OTP:</p>
            <p className="flex items-center">
              {vehicleMaster[0]?.vehicleBasic?.startRide}{" "}
              <CopyButton
                textToCopy={vehicleMaster[0]?.vehicleBasic?.startRide}
              />
            </p>
          </div>
        )}
        {vehicleMaster[0]?.vehicleBasic?.endRide > 0 && (
          <div className="w-full flex items-center justify-between  flex items-center">
            <p className="font-semibold mr-1">End OTP:</p>
            <p className="flex items-center">
              {vehicleMaster[0]?.vehicleBasic?.endRide}{" "}
              <CopyButton
                textToCopy={vehicleMaster[0]?.vehicleBasic?.endRide}
              />
            </p>
          </div>
        )}
      </div>

      {vehicleMaster[0]?.pickupImage && (
        <>
          <div className="w-full flex items-center justify-between  flex items-center mb-1">
            <p className="font-semibold mr-1">Odometer Start Reading:</p>
            <p className="flex items-center">
              {formatNumber(
                vehicleMaster[0]?.pickupImage?.startMeterReading || 0
              )}
            </p>
          </div>
          <div className="w-full flex items-center justify-between  flex items-center">
            <p className="font-semibold mr-1">Odometer End Reading:</p>
            <p className="flex items-center">
              {formatNumber(
                vehicleMaster[0]?.pickupImage?.endMeterReading || 0
              )}
            </p>
          </div>
        </>
      )}

      {diffAmount !== null && diffAmount?.refundAmount > 0 && (
        <div className="mt-1 mb-2.5">
          <div className="w-full flex items-center justify-between text-sm  uppercase">
            <p className="font-semibold mr-1 capitalize">
              Change Vehicle Refund Amount:
            </p>
            <p className="text-theme font-semibold">
              ₹
              {formatPrice(
                vehicleMaster[0]?.bookingPrice?.diffAmount[
                  vehicleMaster[0]?.bookingPrice?.diffAmount?.length - 1
                ]?.refundAmount
              )}
            </p>
          </div>
        </div>
      )}
      <div className="mt-1 mb-2.5">
        <div className="w-full flex items-center justify-between text-sm  mb-1">
          <p className="font-semibold mr-1">Free Limit:</p>
          <p>
            {vehicleMaster[0]?.vehicleBasic?.freeLimit ? freeLimit : "--"} KM
          </p>
        </div>
        <div className="w-full flex items-center justify-between text-sm  mb-1">
          <p className="font-semibold mr-1">Extra KM Charge:</p>
          <p>
            {vehicleMaster[0]?.vehicleBasic?.extraKmCharge ? (
              <>
                ₹
                {formatPrice(
                  Number(vehicleMaster[0]?.vehicleBasic?.extraKmCharge)
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
        <div className="w-full flex items-center justify-between text-sm ">
          <p className="font-semibold mr-1">Booked From:</p>
          <p>
            {vehicleMaster[0]?.bookedFrom === "web"
              ? "WEBSITE"
              : vehicleMaster[0]?.bookedFrom === "admin"
              ? "ADMIN"
              : "APP" || "--"}
          </p>
        </div>
      </div>
      <div className="w-full">
        <div className="flex items-center gap-1 mb-1">
          <p className="text-md text-gray-600 font-bold">Late Fee Charges</p>
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
                <span className="mr-1 font-semibold">Hour Late Fee:</span>₹
                {formatPrice(
                  Number(vehicleMaster[0]?.bookingPrice?.lateFeeBasedOnHour)
                )}
              </p>
              <p className="w-full flex items-center justify-between text-sm text-theme">
                <span className="mr-1 font-semibold">KM Late Fee:</span>₹
                {formatPrice(
                  Number(vehicleMaster[0]?.bookingPrice?.lateFeeBasedOnKM)
                )}
              </p>
              <p className="w-full flex items-center justify-between text-sm text-theme">
                <span className="mr-1 font-semibold">Additional Price:</span>₹
                {formatPrice(
                  Number(vehicleMaster[0]?.bookingPrice?.additionalPrice)
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
                  )
                )}
              </ul>
            )}
        </div>
      </div>
      <div className="w-full">
        <h2 className="text-md text-gray-600 border-b pb-1 font-bold mb-1">
          Change Vehicle Summary
        </h2>
        <div className="mb-2 w-full">
          {vehicleMaster[0]?.bookingPrice?.diffAmount &&
          vehicleMaster[0]?.bookingPrice?.diffAmount?.length > 0 ? (
            <ul className="leading-6 lg:leading-7 list-disc">
              {vehicleMaster[0]?.bookingPrice?.diffAmount?.map(
                (item, index) => (
                  <li className="flex gap-1" key={index}>
                    <ExtraAmount item={item} />
                  </li>
                )
              )}
            </ul>
          ) : (
            <p className="text-sm  italic text-gray-400">
              vehicle not changed yet.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default AdditionalInfo;
