import React from "react";
import BookingFareDetails from "../../../../components/Booking/BookingFareDetails";
import BookingStatusFlag from "../../../../components/Booking/BookingStatusFlag";
import VehicleInfo from "../../../../components/VehicleDetails/VehicleInfo";
import { UpdatePaymentBtn } from "../UpdatePaymentBtn";
import AdditionalInfo from "../../../../components/Booking/AdditionalInfo";
import BookingNote from "../../../../components/Booking/BookingNote";
import { Link } from "react-router-dom";
import CopyButton from "../../../../components/Buttons/CopyButton";

const RightSection = ({ tabs, booking }) => {
  return (
    <div
      className={`${
        tabs !== "payment" ? "hidden" : ""
      } lg:block flex-1 px-6 py-4 bg-white shadow-md rounded-lg`}
    >
      <div className="hidden lg:flex lg:items-center">
        <Link to={`/all-vehicles/details/${booking?.vehicleTableId?._id}`}>
          <h2 className="font-bold uppercase text-md lg:text-lg flex flex-wrap items-center hover:text-theme hover:underline gap-2">
            {booking?.vehicleBasic?.vehicleNumber}
          </h2>
        </Link>
        {booking?.vehicleBasic?.vehicleNumber !== "unassigned" && (
          <CopyButton textToCopy={booking?.vehicleBasic?.vehicleNumber} />
        )}
      </div>

      <small className="capitalize lg:block text-sm text-gray-400 mb-2 lg:mb-5">
        {`${booking?.vehicleBrand} ${booking?.vehicleName}`}
      </small>

      <div className="hidden lg:block">
        <VehicleInfo
          vehicleImage={booking?.vehicleImage}
          vehicleName={booking?.vehicleName}
        />
      </div>
      <div className="flex items-center justify-between border-b-2 pb-1.5 mb-1.5">
        <h2 className="hidden md:block text-base lg:text-lg font-semibold text-gray-600">
          Fare Details
        </h2>
        <h2 className="block md:hidden text-base lg:text-lg font-semibold text-gray-600">
          Payment Status
        </h2>
        <BookingStatusFlag
          title={"Payment Status"}
          rides={booking}
          flag={"paymentStatus"}
        />
      </div>
      <BookingFareDetails rides={booking} />

      <div className="flex items-center justify-between border-b-2 pt-1.5 mt-2 pb-1.5 mb-3">
        <h2 className="text-base lg:text-lg font-semibold text-gray-600">
          Additional Information
        </h2>

        {/* manual update changevehicle or extendvehicle  */}
        <UpdatePaymentBtn />
      </div>
      <div className="mb-3">
        <AdditionalInfo />
      </div>

      <div className="flex items-center justify-between border-b-2 pb-1.5 mb-1.5">
        <h2 className="text-md lg:text-lg font-semibold text-gray-500">
          Notes
        </h2>
      </div>
      <BookingNote />
    </div>
  );
};

export default React.memo(RightSection);
