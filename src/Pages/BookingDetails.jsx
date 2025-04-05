import Button from "../components/Buttons/Button";
import BookingDetail from "../components/Booking/BookingDetail";
import { useParams } from "react-router-dom";
import {
  toggleBookingExtendModal,
  toggleDeleteModal,
  // togglePaymentUpdateModal,
  // togglePaymentUpdateModal,
  togglePickupImageModal,
  toggleRideEndModal,
} from "../Redux/SideBarSlice/SideBarSlice";
import { useDispatch, useSelector } from "react-redux";
import { lazy, useCallback, useEffect, useState } from "react";
import { handleAsyncError } from "../utils/Helper/handleAsyncError";
import PreLoader from "../components/Skeleton/PreLoader";
import { cancelBookingById, fetchVehicleMasterById } from "../Data/Function";
import {
  addTempVehicleData,
  handleUpdateFlags,
  updateTimeLineData,
} from "../Redux/VehicleSlice/VehicleSlice";
import GenerateInvoiceButton from "../components/Table/GenerateInvoiceButton";
import { postData } from "../Data/index";
import UpdateBookingPayment from "../components/Modal/UpdateBookingPayment";
import { formatDateToISO } from "../utils/index";
const CancelModal = lazy(() => import("../components/Modal/CancelModal"));
const UploadPickupImageModal = lazy(() =>
  import("../components/Modal/UploadPickupImageModal")
);
const RideEndModal = lazy(() => import("../components/Modal/RideEndModal"));

const BookingDetails = () => {
  const { id } = useParams();
  const { token, currentUser } = useSelector((state) => state.user);
  const { vehicleMaster, loading } = useSelector((state) => state.vehicles);
  const [loadingStates, setLoadingStates] = useState({});
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [reminderLoading, setReminderLoading] = useState(false);
  const [isVehicleChanging, setIsVehicleChanging] = useState(false);
  const [Note, setNote] = useState("");
  const { isDeleteModalActive } = useSelector((state) => state.sideBar);
  const dispatch = useDispatch();

  // through this we are fetching single vehicle data
  const fetchSingleVehicle = useCallback(async () => {
    if (id) {
      fetchVehicleMasterById(
        dispatch,
        id,
        token,
        "/getBookings",
        "/getTimelineData"
      );
    }
  }, [dispatch, id, token]);

  useEffect(() => {
    fetchSingleVehicle();
  }, [fetchSingleVehicle]);

  // start ride
  const handleStartRideAndAddImages = () => {
    dispatch(addTempVehicleData(vehicleMaster[0]));
    dispatch(togglePickupImageModal());
  };
  // for opening cancel model
  const handleCancelBooking = async () => {
    // this is for firstTime to active modal
    if (!isDeleteModalActive) return dispatch(toggleDeleteModal());
    // this to cancel booking
    if (Note?.length > 10 && Note?.length <= 35) {
      setVehicleLoading(true);
      try {
        let paymentStatusToSend = "failed";
        if (
          (vehicleMaster && vehicleMaster[0]?.paymentStatus === "paid") ||
          (vehicleMaster &&
            vehicleMaster[0]?.paymentStatus === "partiallyPay") ||
          (vehicleMaster &&
            vehicleMaster[0]?.paymentStatus === "partially_paid")
        ) {
          paymentStatusToSend = "refunded";
        }
        const data = {
          paymentStatus: paymentStatusToSend,
          bookingStatus: "canceled",
          rideStatus: "canceled",
          _id: id,
          notes: [
            { key: currentUser?.userType, value: Note, noteType: "cancel" },
          ],
          email: vehicleMaster[0]?.userId?.email,
          contact: vehicleMaster[0]?.userId?.contact,
          managerContact: vehicleMaster[0]?.stationMasterUserId?.contact,
          managerEmail: vehicleMaster[0]?.stationMasterUserId?.email,
        };
        const isCanceled = await cancelBookingById(
          id,
          data,
          token,
          "/cancelledBooking"
        );
        if (isCanceled === true) {
          // updating the timeline for booking
          const timeLineData = {
            currentBooking_id: id,
            timeLine: [
              {
                title: "Booking Cancelled",
                date: new Date().toLocaleString(),
                cancelNote: Note,
              },
            ],
          };
          await postData("/createTimeline", timeLineData, token);
          // for updating timeline redux data
          dispatch(updateTimeLineData(timeLineData));
          handleAsyncError(dispatch, "Ride cancelled successfully", "success");
          // removing the data before updating redux state
          const { email, contact, managerContact, managerEmail, ...otherData } =
            data;
          dispatch(handleUpdateFlags(otherData));
          return dispatch(toggleDeleteModal());
        }
        if (isCanceled !== true) return handleAsyncError(dispatch, isCanceled);
      } catch (error) {
        return handleAsyncError(dispatch, error?.message);
      } finally {
        setVehicleLoading(false);
      }
    } else {
      return handleAsyncError(
        dispatch,
        "Note should be between 10 to 35 characters"
      );
    }
  };
  // for sending remainder
  const handleSendRemainder = async () => {
    try {
      setReminderLoading(true);
      const data = {
        ...vehicleMaster[0],
        contact: vehicleMaster[0]?.userId?.contact,
        firstName: vehicleMaster[0]?.userId?.firstName,
        managerContact: vehicleMaster[0]?.stationMasterUserId?.contact,
        userEmail: vehicleMaster[0]?.userId?.email,
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

  return !loading && vehicleMaster?.length === 1 ? (
    <>
      {/* modal  */}
      <CancelModal
        title={"cancel booking"}
        handleDelete={handleCancelBooking}
        loading={vehicleLoading}
        isNoteRequired={true}
        value={Note}
        setValueChange={setNote}
      />
      <UploadPickupImageModal
        isBookingIdPresent={id ? true : false}
        isChange={isVehicleChanging}
        setIsChange={setIsVehicleChanging}
      />
      <UpdateBookingPayment id={id} />
      <RideEndModal id={id} />
      {/* main booking details start here */}
      <div className="flex items-center flex-wrap justify-between gap-2 lg:gap-0 mb-3">
        <h1 className="text-2xl uppercase font-bold text-theme">
          Booking Details
        </h1>
        {/* actions for cancel & start ride  */}
        <div className="flex flex-wrap gap-2">
          {/* for starting & completing ride  */}
          {vehicleMaster[0]?.rideStatus !== "ongoing" &&
            vehicleMaster[0]?.rideStatus !== "completed" && (
              // vehicleMaster[0]?.BookingStartDateAndTime.split("T")[0] <=
              //   formatDateToISO(new Date()).split("T")[0] &&
              <Button
                title={
                  vehicleMaster[0]?.rideStatus === "completed"
                    ? "Ride Finished"
                    : "Start Ride"
                }
                fn={handleStartRideAndAddImages}
                disable={
                  vehicleMaster[0]?.bookingStatus === "canceled" ||
                  vehicleMaster[0]?.rideStatus === "completed"
                }
              />
            )}
          {/* for completing ride  */}
          {vehicleMaster[0]?.rideStatus === "ongoing" && (
            <Button
              title={"Finish Ride"}
              fn={() => dispatch(toggleRideEndModal())}
              disable={
                vehicleMaster[0]?.rideStatus === "pending" ||
                vehicleMaster[0]?.bookingStatus === "canceled"
              }
              loading={vehicleLoading}
            />
          )}

          {/* for cancel ride */}
          {vehicleMaster[0]?.rideStatus !== "completed" && (
            <Button
              title={"Cancel Booking"}
              fn={handleCancelBooking}
              disable={
                vehicleMaster[0]?.bookingStatus === "canceled" ||
                vehicleMaster[0]?.rideStatus === "ongoing" ||
                vehicleMaster[0]?.rideStatus === "completed"
              }
            />
          )}
          {/* for extend booking  */}
          {!(
            vehicleMaster[0]?.bookingStatus === "canceled" ||
            vehicleMaster[0]?.bookingStatus === "completed" ||
            vehicleMaster[0]?.rideStatus == "completed"
          ) && (
            <Button
              customClass={
                "border-2 border-theme text-theme hover:text-gray-100 hover:border-theme-dark p-1.5 text-sm lg:px-2.5 lg:py-1.5"
              }
              title={"Extend Booking"}
              fn={() => dispatch(toggleBookingExtendModal())}
            />
          )}
          {/* for sending reminder  */}
          <Button
            title={"Send Reminder"}
            fn={handleSendRemainder}
            disable={
              vehicleMaster[0]?.bookingStatus === "canceled" ||
              vehicleMaster[0]?.rideStatus === "completed"
            }
            loading={reminderLoading}
            customLoadingMessage="sending"
          />
          {/* for invoice generate  */}
          {vehicleMaster[0]?.bookingStatus !== "canceled" &&
            vehicleMaster[0]?.paymentStatus !== "pending" && (
              <GenerateInvoiceButton
                item={vehicleMaster && vehicleMaster[0]}
                loadingStates={loadingStates}
                setLoadingStates={setLoadingStates}
              />
            )}
        </div>
      </div>
      <div className="mt-5">
        <BookingDetail />
      </div>
    </>
  ) : (
    <PreLoader />
  );
};

export default BookingDetails;
