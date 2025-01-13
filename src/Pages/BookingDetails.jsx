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
const CancelModal = lazy(() => import("../components/Modal/CancelModal"));
const UploadPickupImageModal = lazy(() =>
  import("../components/Modal/UploadPickupImageModal")
);

const BookingDetails = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const { vehicleMaster, loading } = useSelector((state) => state.vehicles);
  const [vehicleLoading, setVehicleLoading] = useState(false);
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
    setVehicleLoading(true);
    try {
      const data = {
        paymentStatus: "refundInt",
        bookingStatus: "canceled",
        rideStatus: "canceled",
        _id: id,
      };
      const isCanceled = await cancelBookingById(id, data, token);
      if (isCanceled === true) {
        dispatch(handleUpdateFlags(data));
        return dispatch(toggleDeleteModal());
      }
      if (isCanceled !== true) return handleAsyncError(dispatch, isCanceled);
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setVehicleLoading(false);
    }
  };

  const handleEndBooking = async () => {
    setVehicleLoading(true);
    try {
      const data = {
        rideStatus: "completed",
        _id: id,
      };
      const isCanceled = await cancelBookingById(id, data, token);
      if (isCanceled === true) {
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
      />
      <UploadPickupImageModal isBookingIdPresent={id ? true : false} />
      {/* main booking details start here */}
      <div className="flex items-center flex-wrap justify-between gap-2 lg:gap-0 mb-3">
        <h1 className="text-2xl uppercase font-bold text-theme">
          Booking Details
        </h1>
        {/* actions for cancel & start ride  */}
        <div className="flex gap-2">
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
          {vehicleMaster[0]?.rideStatus === "ongoing" && (
            <Button
              title={"Finish Ride"}
              fn={handleEndBooking}
              customClass={"bg-orange-500 bg-opacity-90 hover:bg-orange-600"}
              disable={vehicleMaster[0]?.bookingStatus === "canceled"}
            />
          )}
          <Button
            title={"Cancel Booking"}
            fn={handleCancelBooking}
            disable={
              vehicleMaster[0]?.bookingStatus === "canceled" ||
              vehicleMaster[0]?.rideStatus === "completed"
            }
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
