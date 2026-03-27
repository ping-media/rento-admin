import { useDispatch, useSelector } from "react-redux";
import Button from "../../Buttons/Button";
import React, { useEffect, useMemo, useState } from "react";
import {
  toggleAddonModal,
  toggleBookingExtendModal,
  toggleChangeVehicleModal,
  togglePickupImageModal,
  toggleRescheduleModal,
  toggleRideEndModal,
} from "../../../Redux/SideBarSlice/SideBarSlice";
import GenerateInvoiceButton from "../../Table/GenerateInvoiceButton";
import { postData } from "../../../Data/index";
import { handleAsyncError } from "../../../utils/Helper/handleAsyncError";
import { addTempVehicleData } from "../../../Redux/VehicleSlice/VehicleSlice";

const BookingDetailsButton = ({
  booking,
  handleCancelBooking,
  vehicleLoading,
}) => {
  const { isUploadPickupImageActive } = useSelector((state) => state.sideBar);
  const [reminderLoading, setReminderLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const { token, loggedInRole } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const diffData = useMemo(
    () => booking?.bookingPrice?.diffAmount?.slice(-1)[0] ?? null,
    [booking],
  );
  const isChange = useMemo(() => diffData?.rideStatus === false, [diffData]);
  const isBookingCanceled = booking?.bookingStatus === "canceled";

  const isStartRideVisible = useMemo(() => {
    const rideStatus = booking?.rideStatus;
    const lastDiff = booking?.bookingPrice?.diffAmount?.slice(-1)[0];
    return (
      (lastDiff && !lastDiff.rideStatus) ||
      (rideStatus !== "ongoing" && rideStatus !== "completed")
    );
  }, [booking]);

  //   for opening start ride modal
  const handleStartRideAndAddImages = () => {
    dispatch(addTempVehicleData(booking));
    dispatch(togglePickupImageModal());
  };

  // this will triggr the start ride modal after vehicle change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (vehicleLoading || !booking || !diffData) return;

      if (isChange && !isBookingCanceled) {
        handleStartRideAndAddImages();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [booking, diffData, vehicleLoading, isChange]);

  // make modal state goes to default state
  useEffect(() => {
    return () => {
      if (isUploadPickupImageActive === true) {
        dispatch(togglePickupImageModal());
      }
    };
  }, []);

  // for sending remainder
  const handleSendRemainder = async () => {
    try {
      setReminderLoading(true);
      const data = {
        ...booking,
        contact: booking?.userId?.contact,
        firstName: booking?.userId?.firstName,
        managerContact: booking?.stationMasterUserId?.contact,
        userEmail: booking?.userId?.email,
      };
      const response = await postData("/sendReminder", data, token);
      if (response?.status === 200) {
        return handleAsyncError(dispatch, response?.message, "success");
      } else {
        return handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      handleAsyncError(dispatch, error?.message);
    } finally {
      setReminderLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* for starting & completing ride  */}
      {isStartRideVisible && (
        <Button
          title={
            booking?.rideStatus === "completed" ? "Ride Finished" : "Start Ride"
          }
          fn={handleStartRideAndAddImages}
          disable={
            booking?.bookingStatus === "canceled" ||
            booking?.rideStatus === "completed"
          }
        />
      )}
      {/* for completing ride  */}
      {booking?.rideStatus === "ongoing" && !isChange && (
        <Button
          title={"End Ride"}
          fn={() => dispatch(toggleRideEndModal())}
          disable={
            booking?.rideStatus === "pending" ||
            booking?.bookingStatus === "canceled"
          }
          loading={vehicleLoading}
        />
      )}

      {/* for cancel ride */}
      {((loggedInRole === "admin" && booking?.rideStatus !== "completed") ||
        !(
          booking?.bookingStatus == "canceled" ||
          booking?.rideStatus == "ongoing" ||
          booking?.rideStatus == "completed"
        )) && (
        <Button
          title={"Cancel Ride"}
          fn={() => handleCancelBooking()}
          disable={
            booking?.bookingStatus === "canceled" ||
            (loggedInRole !== "admin" &&
              (booking?.bookingStatus === "canceled" ||
                booking?.rideStatus === "ongoing" ||
                booking?.rideStatus === "completed"))
          }
        />
      )}
      {/* for extend booking  */}
      {!(
        booking?.bookingStatus === "canceled" ||
        booking?.bookingStatus === "completed" ||
        booking?.rideStatus == "completed"
      ) && (
        <Button
          title={"Extend Ride"}
          fn={() => dispatch(toggleBookingExtendModal())}
        />
      )}

      {/* for now disabling the reschudle option as it is making conflict  */}
      {/* {booking?.bookingStatus !== "canceled" &&
        booking?.rideStatus !== "completed" &&
        // booking?.rideStatus === "pending" &&
        loggedInRole === "admin" && (
          <Button
            title={"Reschedule"}
            fn={() => dispatch(toggleRescheduleModal())}
          />
        )} */}

      {booking?.bookingStatus !== "canceled" &&
        booking?.rideStatus === "pending" &&
        loggedInRole === "admin" && (
          <Button title={"Add-On"} fn={() => dispatch(toggleAddonModal())} />
        )}

      {!(
        booking?.rideStatus === "completed" ||
        booking?.bookingStatus === "canceled"
      ) && (
        <button
          className="text-sm font-medium bg-theme text-gray-100 px-1.5 rounded shadow-md py-1 disabled:bg-theme/75"
          type="button"
          onClick={() => dispatch(toggleChangeVehicleModal())}
        >
          Change Vehicle
        </button>
      )}

      <Button
        title={"Send Reminder"}
        fn={handleSendRemainder}
        disable={
          booking?.bookingStatus === "canceled" ||
          booking?.rideStatus === "completed"
        }
        loading={reminderLoading}
        customLoadingMessage="sending"
      />

      {booking?.bookingStatus !== "canceled" &&
        booking?.paymentStatus !== "pending" && (
          <GenerateInvoiceButton
            item={booking}
            loadingStates={loadingStates}
            setLoadingStates={setLoadingStates}
          />
        )}
    </div>
  );
};

export default BookingDetailsButton;
