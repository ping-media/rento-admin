import CopyButton from "../Buttons/CopyButton";
import { useSelector } from "react-redux";
import ExtraAmount from "./ExtraAmount";

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
