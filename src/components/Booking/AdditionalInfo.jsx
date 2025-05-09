import CopyButton from "../Buttons/CopyButton";
import { useSelector } from "react-redux";
import ExtraAmount from "./ExtraAmount";
import { formatPrice, getDurationInDays } from "../../utils/index";

const AdditionalInfo = () => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  return (
    <>
      {/* ride otp's  */}
      <div className="mb-2">
        <p className="text-gray-400 flex items-center">
          <span className="font-semibold mr-1">Start OTP:</span>
          {vehicleMaster[0]?.vehicleBasic?.startRide}{" "}
          <CopyButton textToCopy={vehicleMaster[0]?.vehicleBasic?.startRide} />
        </p>
        {vehicleMaster[0]?.vehicleBasic?.endRide > 0 && (
          <p className="text-gray-400 flex items-center">
            <span className="font-semibold mr-1">End OTP:</span>
            {vehicleMaster[0]?.vehicleBasic?.endRide}{" "}
            <CopyButton textToCopy={vehicleMaster[0]?.vehicleBasic?.endRide} />
          </p>
        )}
      </div>
      <div className="mt-1 mb-2.5">
        <p className="text-sm text-gray-400 mb-1">
          <span className="font-semibold mr-1">Free Limit:</span>
          {vehicleMaster[0]?.vehicleBasic?.freeLimit
            ? vehicleMaster[0]?.vehicleBasic?.freeLimit *
              getDurationInDays(
                vehicleMaster[0]?.BookingStartDateAndTime,
                vehicleMaster[0]?.extendBooking?.originalEndDate ||
                  vehicleMaster[0]?.BookingEndDateAndTime
              )
            : "--"}
          KM
          <span className="mx-1">
            {vehicleMaster[0]?.vehicleBasic?.freeLimit
              ? `(${vehicleMaster[0]?.vehicleBasic?.freeLimit} x 
            ${getDurationInDays(
              vehicleMaster[0]?.BookingStartDateAndTime,
              vehicleMaster[0]?.extendBooking?.originalEndDate ||
                vehicleMaster[0]?.BookingEndDateAndTime
            )}
            day(s))`
              : "--"}
          </span>
        </p>
        <p className="text-sm text-gray-400">
          <span className="font-semibold mr-1">Extra KM Charge:</span>
          {vehicleMaster[0]?.vehicleBasic?.extraKmCharge
            ? `₹${formatPrice(
                Number(vehicleMaster[0]?.vehicleBasic?.extraKmCharge)
              )}
          /km (after free limit exceeds.)`
            : "--"}
        </p>
      </div>
      <div className="w-full">
        <div className="flex items-center gap-1 mb-1">
          <h2 className="text-md text-gray-600 font-bold">Late Fee Charges</h2>
          {vehicleMaster[0]?.bookingPrice?.lateFeePaymentMethod &&
            vehicleMaster[0]?.bookingPrice?.lateFeePaymentMethod !== "NA" && (
              <span className="text-xs italic text-gray-400">
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
              <p className="text-sm text-theme">
                <span className="mr-1 font-semibold text-gray-500">
                  Hour Late Fee:
                </span>
                ₹
                {formatPrice(
                  Number(vehicleMaster[0]?.bookingPrice?.lateFeeBasedOnHour)
                )}
              </p>
              <p className="text-sm text-theme">
                <span className="mr-1 font-semibold text-gray-500">
                  KM Late Fee:
                </span>
                ₹
                {formatPrice(
                  Number(vehicleMaster[0]?.bookingPrice?.lateFeeBasedOnKM)
                )}
              </p>
              <p className="text-sm text-theme">
                <span className="mr-1 font-semibold text-gray-500">
                  Additional Price:
                </span>
                ₹
                {formatPrice(
                  Number(vehicleMaster[0]?.bookingPrice?.additionalPrice)
                )}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Ride not finish yet.</p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        <div className="w-full lg:flex-1">
          <h2 className="text-md text-gray-600 font-bold mb-2">
            Ride Extend Summary
          </h2>
          <div className="mb-2">
            {vehicleMaster[0]?.bookingPrice?.extendAmount &&
            vehicleMaster[0]?.bookingPrice?.extendAmount?.length > 0 ? (
              <ul className="leading-6 lg:leading-7 list-disc">
                {vehicleMaster[0]?.bookingPrice?.extendAmount?.map(
                  (item, index) => (
                    <li className="flex gap-1" key={index}>
                      <ExtraAmount item={item} />
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic">
                vehicle not extended yet.
              </p>
            )}
          </div>
        </div>
        <div className="w-full lg:flex-1">
          <h2 className="text-md text-gray-600 font-bold mb-2">
            Change Vehicle Summary
          </h2>
          <div className="mb-2">
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
              <p className="text-sm text-gray-400 italic">
                vehicle not changed yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdditionalInfo;
