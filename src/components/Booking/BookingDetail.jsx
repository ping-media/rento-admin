import { lazy, memo, Suspense, useMemo, useState } from "react";
import {
  formatFullDateAndTime,
  formatNumber,
  millisecToReadableFormat,
} from "../../utils/index";
import { DetailsSkeleton } from "../../components/Skeleton/DetailSkeleton";
import CancelNoteSection from "./_components/left-booking-details/CancelNoteSection";
import CustomerSection from "./_components/left-booking-details/CustomerSection";
import RightSection from "./_components/right-booking-details/RightSection";

const ChangeVehicleModal = lazy(
  () => import("../../components/Modal/ChangeVehicleModal"),
);
const ExtendBookingModal = lazy(
  () => import("../../components/Modal/ExtendBookingModal"),
);

const buildBookingData = (booking) => {
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
        value: `${vm?.stationName ?? "--"}`,
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
          vm &&
          formatFullDateAndTime(
            vm?.extendBooking?.originalEndDate ||
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
};

const BookingDetail = ({ tabs, booking }) => {
  const [tab, setTab] = useState("booking");

  if (!booking) return <DetailsSkeleton />;

  const CancelNotes =
    booking?.notes?.filter((note) => note.noteType === "cancel") ?? [];

  // combining data for use
  const data = useMemo(() => buildBookingData(booking), [booking]);

  return (
    <>
      <Suspense fallback={null}>
        <ChangeVehicleModal bookingData={booking} />
        <ExtendBookingModal bookingData={booking} />
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
