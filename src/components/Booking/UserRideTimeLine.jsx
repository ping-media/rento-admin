import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { formatFullDateAndTime } from "../../utils/index";
import {
  addUserRideInfo,
  resetUserRideInfo,
} from "../../Redux/VehicleSlice/VehicleSlice";
import { getData } from "../../Data";

const UserRideTimeLine = () => {
  const { id: userId } = useParams();
  const { userRideInfo } = useSelector((state) => state.vehicles);
  const { token } = useSelector((state) => state.user);
  const [ridesLoading, setRidesLoading] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.pathname?.includes("/all-bookings/details/")) return;
    if (!userId) return;

    (async () => {
      try {
        setRidesLoading(true);
        const response = await getData(`/getBookings?userId=${userId}`, token);
        if (response?.status === 200) {
          dispatch(addUserRideInfo(response?.data));
        }
      } finally {
        setRidesLoading(false);
      }
    })();

    return () => {
      dispatch(resetUserRideInfo());
    };
  }, [userId]);

  // if (loading) {
  if (ridesLoading) {
    return (
      <div className="container mx-auto py-2">
        <RideTimelineSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-2">
      {/* {userRideInfo !== null && userRideInfo?.length > 0 ? ( */}
      {Array.isArray(userRideInfo) && userRideInfo.length > 0 ? (
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
                    to={`/all-bookings/details/${item?._id}_${item?.bookingId}`}
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
  );
};

export default UserRideTimeLine;

// skeleton loader for ride timeline
const RideTimelineSkeleton = () => {
  return (
    <div className="relative overflow-hidden py-2">
      {/* Center Line */}
      <div className="absolute left-1/2 h-full border border-gray-200"></div>

      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className={`mb-4 flex w-full justify-between ${
            (index + 1) % 2 === 0
              ? "right-timeline"
              : "flex-row-reverse left-timeline"
          }`}
        >
          {/* Empty Side */}
          <div className="w-5/12"></div>

          {/* Dot */}
          <div className="relative z-20 h-4 w-4 rounded-full bg-gray-300"></div>

          {/* Content */}
          <div
            className={`w-5/12 ${
              (index + 1) % 2 === 0 ? "text-left" : "text-right"
            }`}
          >
            <div
              className={`rounded-xl border border-gray-100 bg-white p-4 shadow-sm ${
                (index + 1) % 2 === 0 ? "" : "ml-auto"
              }`}
            >
              {/* Title */}
              <div
                className={`mb-3 h-4 w-40 animate-pulse rounded bg-gray-200 ${
                  (index + 1) % 2 === 0 ? "" : "ml-auto"
                }`}
              ></div>

              {/* Status */}
              <div
                className={`mb-3 h-3 w-28 animate-pulse rounded bg-gray-200 ${
                  (index + 1) % 2 === 0 ? "" : "ml-auto"
                }`}
              ></div>

              {/* Start */}
              <div
                className={`mb-2 h-3 w-full animate-pulse rounded bg-gray-100`}
              ></div>

              {/* End */}
              <div
                className={`h-3 w-5/6 animate-pulse rounded bg-gray-100 ${
                  (index + 1) % 2 === 0 ? "" : "ml-auto"
                }`}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
