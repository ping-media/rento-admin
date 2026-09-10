import React from "react";
import BookingCardHeader from "../Bookingcardheader";
import { DetailsSkeleton } from "../../../../components/Skeleton/DetailSkeleton";
import BookingUserDetails from "../../../../components/Booking/BookingUserDetail";
import BookingMoreInfo from "../../../../components/Booking/BookingMoreInfo";
import VehicleImages from "../../../../components/Booking/VehicleImages";
import { OrderSummaryList } from "../OrderSummaryList";
import { Timeline } from "../Timeline";

const CustomerSection = ({ booking, data, tab, tabs, setTab }) => {
  const isVehicleImages =
    Object.keys(booking?.pickupImage?.files ?? {}).length > 0;

  return (
    <>
      <div className={`${tabs !== "customer" ? "hidden lg:block" : ""}`}>
        <BookingCardHeader
          title={"Customer Information"}
          flag_title={"Booking Status"}
          booking_flag={"bookingStatus"}
          booking={booking}
        />

        <div className="border-2 p-2 border-gray-300 rounded-lg mb-4">
          {data !== null ? (
            <BookingUserDetails data={data} user={booking?.userId ?? {}} />
          ) : (
            <DetailsSkeleton />
          )}
        </div>
      </div>

      <div className={`${tabs !== "booking" ? "hidden lg:block" : ""}`}>
        <BookingCardHeader
          title={"Booking Information"}
          flag_title={"Ride Status"}
          booking_flag={"rideStatus"}
          booking={booking}
        />

        <div className="border-2 p-2 border-gray-300 rounded-lg">
          {data !== null ? (
            <BookingMoreInfo data={data} datatype={"moreInfo"} />
          ) : (
            <DetailsSkeleton rows={3} showStatusRow={false} />
          )}
        </div>
        <div>
          <h2 className="text-base lg:text-lg font-semibold text-gray-500 mt-5">
            Vehicle Images
          </h2>
          {/* {booking?.pickupImage !== null ? ( */}
          {isVehicleImages ? (
            <VehicleImages pickupImage={booking?.pickupImage} />
          ) : (
            <p className="text-sm italic text-gray-400">
              No vehicles Images Found.
            </p>
          )}
        </div>

        {/* ride summary */}
        <div className="border px-2 rounded-md my-4 py-2 lg:hidden w-full mt-8">
          <h2 className="text-md text-gray-600 font-bold mb-2">Ride Summary</h2>

          <OrderSummaryList booking={booking} />
        </div>

        {/* timeline list   */}
        <Timeline tab={tab} setTab={setTab} booking={booking} />
      </div>
    </>
  );
};

export default React.memo(CustomerSection);
