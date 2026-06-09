import { lazy, memo, Suspense, useMemo, useState } from "react";
import {
  formatFullDateAndTime,
  // formatNumber,
  // millisecToReadableFormat,
} from "../../utils/index";
import { DetailsSkeleton } from "../../components/Skeleton/DetailSkeleton";
import CancelNoteSection from "./_components/left-booking-details/CancelNoteSection";
import CustomerSection from "./_components/left-booking-details/CustomerSection";
import RightSection from "./_components/right-booking-details/RightSection";
import CopyButton from "../../components/Buttons/CopyButton";

const ChangeVehicleModal = lazy(
  () => import("../../components/Modal/ChangeVehicleModal"),
);
const ExtendBookingModal = lazy(
  () => import("../../components/Modal/ExtendBookingModal"),
);

const OdometerReadingModal = lazy(
  () => import("../../components/Modal/OdometerReadingModal"),
);

const buildBookingData = (booking, setOdometerModal) => {
  if (!booking) return null;
  const vm = booking;

  const diffAmount = vm?.bookingPrice?.diffAmount
    ? vm?.bookingPrice?.diffAmount[vm?.bookingPrice?.diffAmount?.length - 1]
    : null;

  // const isExtended = vm?.bookingStatus === "extended" || false;

  // const rawBookingEndDateAndTime =
  //   (vm?.extendBooking?.oldBooking?.length > 0 &&
  //     vm?.extendBooking?.oldBooking[0]?.BookingEndDateAndTime) ||
  //   vm?.BookingEndDateAndTime;

  // const BookingEndDateAndTime = !isExtended
  //   ? vm?.extendBooking?.originalEndDate || rawBookingEndDateAndTime
  //   : rawBookingEndDateAndTime;

  return {
    user: [
      {
        key: "Full Name",
        value: `${vm?.userId?.firstName} ${vm?.userId?.lastName}` || "",
        isVisible: true,
      },
      {
        key: "Mobile Number",
        value: vm?.userId?.contact || "NA",
        isVisible: true,
      },
      {
        key: "Alt Mobile Number",
        value: vm?.userId?.altContact || "NA",
        isVisible: true,
      },
      {
        key: "Email",
        value: vm?.userId?.email || "example@gmail.com",
        isVisible: true,
      },
      {
        key: "Document Status",
        value: vm?.userId?.kycApproved || "no",
        isVisible: true,
      },
    ],
    moreInfo: [
      {
        key: "Pick Up & Drop Off Location",
        value: `${vm?.stationName ?? "--"}`,
        isVisible: true,
      },
      {
        key: "Booking Start",
        value: `${vm?.BookingStartDateAndTime && formatFullDateAndTime(vm?.BookingStartDateAndTime)}`,
        isVisible: true,
      },
      {
        key: "Booking End",
        value: `${vm?.BookingEndDateAndTime && formatFullDateAndTime(vm?.BookingEndDateAndTime)}`,
        isVisible: true,
        // value: `${BookingEndDateAndTime && formatFullDateAndTime(BookingEndDateAndTime)}`,
      },
      {
        key: "Odometer Readings",
        value: () => setOdometerModal(true),
        isVisible: true,
      },
      {
        key: "Start OTP",
        value: vm?.vehicleBasic?.startRide || 0,
        isVisible:
          vm?.rideStatus !== "completed" &&
          ((diffAmount !== null && diffAmount?.rideStatus === false) ||
            vm?.rideStatus !== "ongoing"),
      },
      {
        key: "End OTP",
        value: vm?.vehicleBasic?.endRide || 0,
        isVisible:
          vm?.rideStatus !== "completed" && vm?.vehicleBasic?.endRide > 0,
      },
      // {
      //   key: "Start Odometer Reading",
      //   value: `${
      //     vm?.pickupImage?.startMeterReading
      //       ? `${formatNumber(Number(vm?.pickupImage?.startMeterReading))} Km`
      //       : ""
      //   }`,
      // },
      // {
      //   key: "End Odometer Reading",
      //   value: `${
      //     vm?.pickupImage?.endMeterReading
      //       ? `${formatNumber(Number(vm?.pickupImage?.endMeterReading))} km`
      //       : ""
      //   }`,
      // },
      // {
      //   key: "Ride Start",
      //   value: `${
      //     vm?.vehicleBasic?.RideStart
      //       ? millisecToReadableFormat(Number(vm?.vehicleBasic?.RideStart))
      //       : ""
      //   }`,
      // },
      // {
      //   key: "Ride End",
      //   value: `${
      //     vm?.vehicleBasic?.RideEnd
      //       ? millisecToReadableFormat(Number(vm?.vehicleBasic?.RideEnd))
      //       : ""
      //   }`,
      // },
      // {
      //   key: "Extended Till",
      //   value: `${vm?.BookingEndDateAndTime && formatFullDateAndTime(vm?.BookingEndDateAndTime)}`,
      // },
    ],
  };
};

const BookingDetail = ({ tabs, booking, onVehicleChange = null }) => {
  const [odometerModal, setOdometerModal] = useState(false);
  const [tab, setTab] = useState("booking");

  if (!booking) return <DetailsSkeleton />;

  const CancelNotes =
    booking?.notes?.filter((note) => note.noteType === "cancel") ?? [];

  // combining data for use
  const data = useMemo(
    () => buildBookingData(booking, setOdometerModal),
    [booking],
  );

  return (
    <>
      <Suspense fallback={null}>
        <ChangeVehicleModal
          bookingData={booking}
          onVehicleChange={onVehicleChange}
        />
        <ExtendBookingModal bookingData={booking} />
        <OdometerReadingModal
          isActive={odometerModal}
          setIsActive={setOdometerModal}
        />
      </Suspense>

      <div className="flex gap-0 lg:gap-4 flex-wrap">
        <div
          className={`${
            ["customer", "booking"].includes(tabs)
              ? "bg-white shadow-md rounded-xl flex-1 px-3 lg:px-6 py-4"
              : ""
          }`}
        >
          {CancelNotes?.length > 0 && (
            <CancelNoteSection CancelNotes={CancelNotes} />
          )}

          <CustomerSection
            tab={tab}
            tabs={tabs}
            setTab={setTab}
            booking={booking}
            data={data}
          />
        </div>

        <RightSection tabs={tabs} booking={booking} />
      </div>
    </>
  );
};

export default memo(BookingDetail);
