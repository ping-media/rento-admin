import { useDispatch, useSelector } from "react-redux";
import VehicleInfo from "../VehicleDetails/VehicleInfo";
import { lazy, Suspense, useMemo, useState } from "react";
import PreLoader from "../Skeleton/PreLoader";
import {
  formatFullDateAndTime,
  formatNumber,
  millisecToReadableFormat,
} from "../../utils/index";
import BookingFareDetails from "./BookingFareDetails";
import BookingUserDetails from "./BookingUserDetail";
import BookingStatusFlag from "./BookingStatusFlag";
import BookingMoreInfo from "./BookingMoreInfo";
import BookingNote from "./BookingNote";
import { togglePaymentUpdateModal } from "../../Redux/SideBarSlice/SideBarSlice";
import BookingTimeLine from "./BookingTimeLine";
import AdditionalInfo from "./AdditionalInfo";
import Button from "../Buttons/Button";
import VehicleImages from "./VehicleImages";
import UserRideTimeLine from "./UserRideTimeLine";
import { ExtendSummary, RideSummary } from "./RideSummary";
const ChangeVehicleModal = lazy(
  () => import("../../components/Modal/ChangeVehicleModal"),
);
const ExtendBookingModal = lazy(
  () => import("../../components/Modal/ExtendBookingModal"),
);

const BookingDetail = ({ tabs }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const { loggedInRole } = useSelector((state) => state.user);
  const [tab, setTab] = useState("booking");
  const dispatch = useDispatch();

  const booking = useMemo(() => vehicleMaster?.[0] ?? null, [vehicleMaster]);

  // combining data for use
  const data = useMemo(() => {
    if (!booking) return null;
    const vm = booking;
    return {
      user: [
        {
          key: "Full Name",
          value: `${vm?.userId?.firstName} ${vm?.userId?.lastName}` || "",
        },
        {
          key: "Mobile Number",
          value: vm?.userId?.contact || "NA",
        },
        {
          key: "Alt Mobile Number",
          value: vm?.userId?.altContact || "NA",
        },
        {
          key: "Email",
          value: vm?.userId?.email || "example@gmail.com",
        },
        {
          key: "Document Status",
          value: vm?.userId?.kycApproved || "no",
        },
      ],
      moreInfo: [
        {
          key: "Pick Up & Drop Off Location",
          value: `${vehicleMaster && vm?.stationName}`,
        },
        // {
        //   key: "Drop Off Location",
        //   value: `${vehicleMaster && vm?.stationName}`,
        // },
        {
          key: "Booking Start",
          value: `${formatFullDateAndTime(vm?.BookingStartDateAndTime)}`,
        },
        {
          key: "Booking End",
          value: `${
            vehicleMaster &&
            formatFullDateAndTime(
              (vm?.extendBooking?.oldBooking?.length > 0 &&
                vm?.extendBooking?.oldBooking[0]?.BookingEndDateAndTime) ||
                vm?.BookingEndDateAndTime,
            )
          }`,
        },
        {
          key: "Start Odometer Reading",
          value: `${
            vm?.pickupImage?.startMeterReading
              ? `${formatNumber(Number(vm?.pickupImage?.startMeterReading))} Km`
              : ""
          }`,
        },
        {
          key: "End Odometer Reading",
          value: `${
            vm?.pickupImage?.endMeterReading
              ? `${formatNumber(Number(vm?.pickupImage?.endMeterReading))} km`
              : ""
          }`,
        },
        {
          key: "Ride Start",
          value: `${
            vm?.vehicleBasic?.RideStart
              ? millisecToReadableFormat(Number(vm?.vehicleBasic?.RideStart))
              : ""
          }`,
        },
        {
          key: "Ride End",
          value: `${
            vm?.vehicleBasic?.RideEnd
              ? millisecToReadableFormat(Number(vm?.vehicleBasic?.RideEnd))
              : ""
          }`,
        },
        {
          key: "Extended Till",
          value: `${formatFullDateAndTime(vm?.BookingEndDateAndTime)}`,
        },
      ],
    };
  }, [booking]);

  return data != null ? (
    <>
      <Suspense fallback={null}>
        <ChangeVehicleModal bookingData={vehicleMaster && booking} />
        <ExtendBookingModal bookingData={vehicleMaster && booking} />
      </Suspense>

      <div className="flex gap-0 lg:gap-4 flex-wrap">
        <div
          className={`${
            ["customer", "booking"].includes(tabs)
              ? "bg-white shadow-md rounded-xl flex-1 px-3 lg:px-6 py-4"
              : ""
          }`}
        >
          {booking?.notes && (
            <div className="text-sm text-end italic text-gray-400 mb-1">
              {/* here we will show only notes with noteType cancel  */}
              {booking?.notes
                ?.filter((note) => note.noteType === "cancel")
                .map((note, index) => (
                  <p key={note._id || index}>
                    {`Cancel note by ${note.key}: (${note.value})`}
                  </p>
                ))}
            </div>
          )}

          <div className={`${tabs !== "customer" && "hidden lg:block"}`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base lg:text-lg font-semibold text-gray-500 hidden md:flex items-center">
                Customer Information
              </h2>
              <h2 className="text-base lg:text-lg font-semibold text-gray-500 flex md:hidden items-center">
                Booking Status
              </h2>
              <BookingStatusFlag
                title={"Booking Status"}
                rides={booking}
                flag={"bookingStatus"}
              />
            </div>
            <div className="border-2 p-2 border-gray-300 rounded-lg mb-4">
              <BookingUserDetails data={data} userId={booking?.userId?._id} />
            </div>
          </div>
          <div className={`${tabs !== "booking" && "hidden lg:block"}`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="hidden md:block text-base lg:text-lg font-semibold text-gray-500">
                Booking Information
              </h2>
              <h2 className="block md:hidden text-base lg:text-lg font-semibold text-gray-500">
                Ride Status
              </h2>
              <BookingStatusFlag
                title={"Ride Status"}
                rides={booking}
                flag={"rideStatus"}
              />
            </div>
            <div className="border-2 p-2 border-gray-300 rounded-lg">
              <BookingMoreInfo data={data} datatype={"moreInfo"} />
            </div>
            <div>
              <h2 className="text-base lg:text-lg font-semibold text-gray-500 mt-5">
                Vehicle Images
              </h2>
              {booking?.pickupImage !== null ? (
                <VehicleImages pickupImage={booking?.pickupImage} />
              ) : (
                <p className="text-sm italic text-gray-400">
                  No vehicles Images Found.
                </p>
              )}
            </div>
            {/* ride summary start */}
            <div className="border px-2 rounded-md my-4 py-2 lg:hidden w-full mt-8">
              <h2 className="text-md text-gray-600 font-bold mb-2">
                Ride Summary
              </h2>
              <div>
                {booking?.bookingPrice && (
                  <RideSummary
                    daysBreakdown={booking?.bookingPrice?.daysBreakdown}
                    appliedPlans={booking?.bookingPrice?.appliedPlan}
                    item={booking?.bookingPrice}
                  />
                )}

                {booking?.bookingId &&
                  booking?.bookingPrice?.extendAmount?.length > 0 && (
                    <ul className="leading-6 lg:leading-7 list-disc">
                      {booking?.bookingPrice?.extendAmount?.map((item) => (
                        <li className="flex flex-col" key={item.id}>
                          <ExtendSummary
                            daysBreakdown={item?.daysBreakdown || []}
                            appliedPlans={item?.appliedPlans || []}
                            item={item}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            </div>
            {/* ride summary end */}

            <div className="mt-5 mb-5">
              <div className="flex items-center gap-1 justify-between mb-5">
                <h2 className="text-base lg:text-lg font-semibold text-gray-500 w-2/4">
                  {tab.charAt(0).toUpperCase() + tab.slice(1) || "Booking"}{" "}
                  Timeline
                </h2>
                <div className="relative flex border rounded overflow-hidden flex-1">
                  <div
                    className={`absolute top-0 left-0 h-full bg-theme transition-all duration-300 rounded text-white z-0`}
                    style={{
                      width: "50%",
                      transform: `translateX(${
                        tab === "rides" ? "100%" : "0%"
                      })`,
                    }}
                  />
                  {["booking", "rides"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`flex-1 z-10 p-1 font-semibold transition-colors duration-300 ${
                        tab === item ? "text-white" : "text-gray-800"
                      }`}
                      onClick={() => setTab(item)}
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {(booking && tab === "booking" && <BookingTimeLine />) ||
                (booking && tab === "rides" && <UserRideTimeLine />)}
            </div>
          </div>
        </div>
        <div
          className={`${
            tabs !== "payment" && "hidden"
          } lg:block flex-1 px-6 py-4 bg-white shadow-md rounded-lg`}
        >
          <div className="hidden lg:flex lg:items-center justify-between">
            <div>
              <h2 className="font-bold uppercase text-md lg:text-lg flex flex-wrap items-center gap-2">
                {booking?.vehicleBasic?.vehicleNumber}
              </h2>
            </div>
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
          <BookingFareDetails rides={vehicleMaster && booking} />
          <div className="flex items-center justify-between border-b-2 pt-1.5 mt-2 pb-1.5 mb-3">
            <h2 className="text-base lg:text-lg font-semibold text-gray-600">
              Additional Information
            </h2>
            {loggedInRole === "admin" &&
              ((vehicleMaster &&
                booking?.bookingPrice?.diffAmount &&
                booking?.bookingPrice?.diffAmount?.length > 0 &&
                booking?.bookingPrice?.diffAmount?.filter(
                  (record) => record?.status !== "paid",
                )?.length > 0) ||
                (vehicleMaster &&
                  booking?.bookingPrice?.extendAmount &&
                  booking?.bookingPrice?.extendAmount?.length > 0 &&
                  booking?.bookingPrice?.extendAmount?.filter(
                    (record) => record?.status !== "paid",
                  )?.length > 0)) && (
                <Button
                  title={"Update Payment"}
                  customClass={"text-sm bg-theme text-gray-100 px-1.5 py-1"}
                  fn={() => dispatch(togglePaymentUpdateModal())}
                />
              )}
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
      </div>
    </>
  ) : (
    <PreLoader />
  );
};

export default BookingDetail;
