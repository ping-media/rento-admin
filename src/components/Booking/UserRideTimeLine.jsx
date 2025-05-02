import React from "react";
import PreLoader from "../../components/Skeleton/PreLoader";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formatFullDateAndTime } from "../../utils/index";

const UserRideTimeLine = () => {
  const { userRideInfo, loading } = useSelector((state) => state.vehicles);

  return (
    <>
      <div className="container mx-auto py-2">
        {loading && <PreLoader />}
        {!loading && userRideInfo !== null && userRideInfo?.length > 0 ? (
          <div className="relative wrap overflow-hidden">
            <div className="border-2-2 absolute border-opacity-20 border-gray-700 h-full border left-1/2"></div>
            {userRideInfo?.map((item, index) => (
              <div
                className={`${
                  index === userRideInfo?.length - 1 ? "" : "mb-2"
                } flex justify-between ${
                  index === 0
                    ? "items-start"
                    : index === userRideInfo?.length - 1
                    ? "items-end"
                    : "items-center"
                } w-full ${
                  (index + 1) % 2 === 0
                    ? "right-timeline"
                    : "flex-row-reverse left-timeline"
                }`}
                key={index}
              >
                <div className="order-1 w-5/12"></div>
                <div className="z-20 flex items-center order-1 bg-theme shadow-xl w-4 h-4 rounded-full relative"></div>
                <div
                  className={`order-1 w-5/12 ${
                    (index + 1) % 2 === 0 ? "text-left" : "text-right"
                  }`}
                >
                  <>
                    <Link
                      to={`/all-bookings/details/${item?._id}`}
                      className="mb-1 font-bold text-gray-800 text-sm capitalize hover:text-theme hover:underline"
                    >
                      {`${item?.vehicleBrand} ${item?.vehicleName}`} (#
                      {item?.bookingId})
                    </Link>
                    {item?.bookingStatus === "canceled" && (
                      <p className="text-gray-700 leading-tight text-sm my-1">
                        <span className="font-semibold">Booking Status:</span>{" "}
                        <span className="bg-theme/70 px-2 py-1 text-white rounded-md">
                          {item?.bookingStatus}
                        </span>
                      </p>
                    )}
                    <p className="text-gray-700 leading-tight text-xs lg:text-sm">
                      <span className="font-semibold">Start:</span>{" "}
                      {formatFullDateAndTime(item?.BookingStartDateAndTime)}
                    </p>
                    <p className="text-gray-700 leading-tight text-xs lg:text-sm">
                      <span className="font-semibold">End:</span>{" "}
                      {formatFullDateAndTime(item?.BookingEndDateAndTime)}
                    </p>
                  </>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full">
            <p className="italic text-sm">
              No rides have been made by this user yet.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default UserRideTimeLine;
