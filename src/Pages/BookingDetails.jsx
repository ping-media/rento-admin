import Button from "../components/Buttons/Button";
import BookingDetail from "../components/Booking/BookingDetail";
import { useParams } from "react-router-dom";
import {
  toggleDeleteModal,
  togglePickupImageModal,
} from "../Redux/SideBarSlice/SideBarSlice";
import { useDispatch, useSelector } from "react-redux";
import { lazy, useCallback, useEffect, useState } from "react";
import { handleAsyncError } from "../utils/Helper/handleAsyncError";
import PreLoader from "../components/Skeleton/PreLoader";
import { cancelBookingById, fetchVehicleMasterById } from "../Data/Function";
import {
  addTempVehicleData,
  handleUpdateFlags,
} from "../Redux/VehicleSlice/VehicleSlice";
import GenerateInvoiceButton from "../components/Table/GenerateInvoiceButton";
const CancelModal = lazy(() => import("../components/Modal/CancelModal"));
const UploadPickupImageModal = lazy(() =>
  import("../components/Modal/UploadPickupImageModal")
);

const BookingDetails = () => {
  const { id } = useParams();
  const { token, currentUser } = useSelector((state) => state.user);
  const { vehicleMaster, loading } = useSelector((state) => state.vehicles);
  const [loadingStates, setLoadingStates] = useState({});
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [Note, setNote] = useState("");
  const { isDeleteModalActive } = useSelector((state) => state.sideBar);
  const dispatch = useDispatch();

  // through this we are fetching single vehicle data
  const fetchSingleVehicle = useCallback(() => {
    if (id) {
      fetchVehicleMasterById(dispatch, id, token, "/getBookings");
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
          notes: {
            key: currentUser?.userType,
            value: Note,
          },
        };
        const isCanceled = await cancelBookingById(id, data, token);
        if (isCanceled === true) {
          handleAsyncError(dispatch, "Ride cancelled successfully", "success");
          dispatch(handleUpdateFlags(data));
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
  // for completing the booking
  const handleEndBooking = async () => {
    setVehicleLoading(true);
    try {
      const data = {
        rideOtp: "",
        rideStatus: "completed",
        _id: id,
      };
      const isCanceled = await cancelBookingById(id, data, token);
      if (isCanceled === true) {
        handleAsyncError(dispatch, "Ride completed successfully", "success");
        return dispatch(handleUpdateFlags(data));
      }
      if (isCanceled !== true) return handleAsyncError(dispatch, isCanceled);
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setVehicleLoading(false);
    }
  };

  return !loading && vehicleMaster?.length === 1 ? (
    <>
      {/* cancel modal  */}
      <CancelModal
        title={"cancel booking"}
        handleDelete={handleCancelBooking}
        loading={vehicleLoading}
        isNoteRequired={true}
        value={Note}
        setValueChange={setNote}
      />
      <UploadPickupImageModal isBookingIdPresent={id ? true : false} />
      {/* main booking details start here */}
      <div className="flex items-center flex-wrap justify-between gap-2 lg:gap-0 mb-3">
        <h1 className="text-2xl uppercase font-bold text-theme">
          Booking Details
        </h1>
        {/* actions for cancel & start ride  */}
        <div className="flex flex-wrap gap-2">
          {/* for starting & completing ride  */}
          {vehicleMaster[0]?.rideStatus !== "ongoing" && (
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
              fn={handleEndBooking}
              // customClass={"bg-orange-500 bg-opacity-90 hover:bg-orange-600"}
              disable={vehicleMaster[0]?.bookingStatus === "canceled"}
              loading={vehicleLoading}
            />
          )}
          {/* for cancel the ride  */}
          <Button
            title={"Cancel Booking"}
            fn={handleCancelBooking}
            disable={
              vehicleMaster[0]?.bookingStatus === "canceled" ||
              vehicleMaster[0]?.rideStatus === "ongoing" ||
              vehicleMaster[0]?.rideStatus === "completed"
            }
          />
          {/* for sending reminder  */}
          <Button
            title={"Send Reminder"}
            fn={() => {}}
            disable={
              vehicleMaster[0]?.bookingStatus === "canceled" ||
              vehicleMaster[0]?.rideStatus === "completed"
            }
          />
          {/* for invoice generate  */}
          <GenerateInvoiceButton
            item={vehicleMaster && vehicleMaster[0]}
            loadingStates={loadingStates}
            setLoadingStates={setLoadingStates}
          />
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
