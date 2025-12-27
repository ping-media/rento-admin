import BookingDetail from "../components/Booking/BookingDetail";
import { useParams } from "react-router-dom";
import { toggleDeleteModal } from "../Redux/SideBarSlice/SideBarSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { handleAsyncError } from "../utils/Helper/handleAsyncError";
import PreLoader from "../components/Skeleton/PreLoader";
import { cancelBookingById, fetchVehicleMasterById } from "../Data/Function";
import {
  handleUpdateFlags,
  resetUserRideInfo,
  updateTimeLineData,
} from "../Redux/VehicleSlice/VehicleSlice";
import { postData } from "../Data/index";
import UpdateBookingPayment from "../components/Modal/UpdateBookingPayment";
import NoData from "../components/Error/NoData";
import TabButton from "../components/TabButton/TabButton";
import BookingDetailsButton from "../components/Form/BookingComponents/BookingDetailsButton";
const CancelModal = lazy(() => import("../components/Modal/CancelModal"));
const UploadPickupImageModal = lazy(() =>
  import("../components/Modal/UploadPickupImageModal")
);
const RideEndModal = lazy(() => import("../components/Modal/RideEndModal"));
const RescheduleModal = lazy(() =>
  import("../components/Modal/RescheduleModal")
);
const UserKycApproveModal = lazy(() =>
  import("../components/Modal/UserKycApproveModal.jsx")
);
const AddonModal = lazy(() => import("../components/Modal/AddonModal.jsx"));

const BookingDetails = () => {
  const { id } = useParams();
  const { token, currentUser } = useSelector((state) => state.user);
  const { vehicleMaster, loading } = useSelector((state) => state.vehicles);
  const [tab, setTab] = useState("customer");
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [Note, setNote] = useState("");
  const { isDeleteModalActive } = useSelector((state) => state.sideBar);
  const dispatch = useDispatch();

  const bookingId = useMemo(() => id?.split("_")[0], [id]);
  const booking = vehicleMaster?.[0];

  // through this we are fetching single vehicle data
  const fetchSingleVehicleDetails = useCallback(async () => {
    if (id) {
      fetchVehicleMasterById(
        dispatch,
        bookingId,
        token,
        "/getBookings",
        "/getTimelineData",
        "/getBookings"
      );
    }
  }, [bookingId, token]);

  useEffect(() => {
    fetchSingleVehicleDetails();

    return () => {
      dispatch(resetUserRideInfo());
    };
  }, [fetchSingleVehicleDetails]);

  // // for opening cancel model
  const handleCancelBooking = async () => {
    // this is for firstTime to active modal
    if (!isDeleteModalActive) return dispatch(toggleDeleteModal());
    // this to cancel booking
    if (Note?.length > 10 && Note?.length <= 35) {
      setVehicleLoading(true);
      try {
        let paymentStatusToSend = "failed";
        if (
          (vehicleMaster && booking?.paymentStatus === "paid") ||
          (vehicleMaster && booking?.paymentStatus === "partiallyPay") ||
          (vehicleMaster && booking?.paymentStatus === "partially_paid")
        ) {
          paymentStatusToSend = "refunded";
        }
        const data = {
          paymentStatus: paymentStatusToSend,
          bookingStatus: "canceled",
          rideStatus: "canceled",
          _id: bookingId,
          notes: [
            { key: currentUser?.userType, value: Note, noteType: "cancel" },
          ],
          email: booking?.userId?.email,
          contact: booking?.userId?.contact,
          managerContact: booking?.stationMasterUserId?.contact,
          managerEmail: booking?.stationMasterUserId?.email,
        };
        const isCanceled = await cancelBookingById(
          bookingId,
          data,
          token,
          "/cancelledBooking"
        );
        if (isCanceled === true) {
          // updating the timeline for booking
          const timeLineData = {
            currentBooking_id: bookingId,
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

  if (loading || !booking) return <PreLoader />;

  if (!loading && !booking) {
    return <NoData message="Booking Not Found" />;
  }

  return (
    <>
      <Suspense fallback={null}>
        {/* cancel modal */}
        <CancelModal
          title={"cancel booking"}
          handleDelete={handleCancelBooking}
          loading={vehicleLoading}
          isNoteRequired={true}
          value={Note}
          setValueChange={setNote}
        />
        {/* pickupImage & start ride modal */}
        <UploadPickupImageModal isBookingIdPresent={!!bookingId} />
        <RescheduleModal />
        <AddonModal />
        {/* update bookingpayment modal */}
        <UpdateBookingPayment id={bookingId} />
        {/* Kyc modal */}
        <UserKycApproveModal />
        {/* ride end modal */}
        <RideEndModal id={bookingId} />
      </Suspense>

      {/* main booking details start here */}
      <div className="flex items-center flex-wrap justify-end gap-2 lg:gap-0 mb-3">
        {/* actions for cancel & start ride  */}
        <BookingDetailsButton
          booking={vehicleMaster && vehicleMaster[0]}
          handleCancelBooking={handleCancelBooking}
          vehicleLoading={vehicleLoading}
        />
      </div>
      <div className="mt-5">
        <div className="w-full bg-white rounded-md lg:hidden mb-5 lg:mb-0">
          <TabButton
            options={[
              { id: "customer", title: "Customer" },
              { id: "booking", title: "Booking" },
              { id: "payment", title: "Payment" },
            ]}
            tab={tab}
            setTab={setTab}
            padding="p-2"
          />
        </div>
        <BookingDetail pickupImagesLoading={false} tabs={tab} />
      </div>
    </>
  );
};

export default BookingDetails;
