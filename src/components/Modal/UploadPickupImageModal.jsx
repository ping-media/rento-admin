import { useDispatch, useSelector } from "react-redux";
import { togglePickupImageModal } from "../../Redux/SideBarSlice/SideBarSlice";
import { useState } from "react";
import MultipleImageAndPreview from "../ImageComponent/MultipleImageAndPreview";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { postData, postMultipleData } from "../../Data";
import Spinner from "../Spinner/Spinner";
import {
  handleInvoiceCreated,
  removeTempVehicleData,
} from "../../Redux/VehicleSlice/VehicleSlice";
import Input from "../InputAndDropdown/Input";
import { useNavigate } from "react-router-dom";

const UploadPickupImageModal = ({ isBookingIdPresent = false }) => {
  const { isUploadPickupImageActive } = useSelector((state) => state.sideBar);
  const { token } = useSelector((state) => state.user);
  const { tempVehicleData, vehicleMaster } = useSelector(
    (state) => state.vehicles
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imagesUrl, setImageUrl] = useState([]);
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isKycApproved, setIsKycApproved] = useState(false);

  //upload images
  const handleUploadPickupImages = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    const images = Array.from(event.target.elements.images?.files || []);
    const formElements = event.target.elements;
    const startOdometerReading = formElements?.newMeterReading?.value;
    const endOdometerReading = formElements?.oldMeterReading?.value;
    const startOtp = formElements?.rideOtp?.value;

    if (!tempVehicleData)
      return handleAsyncError(dispatch, "All fields required.");

    formData.append("userId", tempVehicleData?.userId?._id);
    formData.append("bookingId", tempVehicleData?.bookingId);
    formData.append("_id", tempVehicleData?._id);
    formData.append("newMeterReading", startOdometerReading);
    formData.append("oldMeterReading", endOdometerReading);
    formData.append("rideOtp", startOtp);

    if (images.length > 0) {
      // Append images to the FormData
      images.forEach((file) => {
        formData.append("images", file);
      });
    }

    if (!formData.has("images")) {
      return handleAsyncError(
        dispatch,
        "Unable to upload! No images provided."
      );
    }

    // changing the data based on id is present or not
    let currentData = !isBookingIdPresent ? vehicleMaster?.data : vehicleMaster;

    let currentBooking = currentData?.find(
      (item) => item?._id == tempVehicleData?._id
    );
    // end ride otp
    const endRideOtp = Math.floor(1000 + Math.random() * 9000);

    const updatedBooking = {
      ...currentBooking,
      bookingPrice: {
        ...currentBooking.bookingPrice,
        isPickupImageAdded: true,
      },
      vehicleBasic: {
        ...currentBooking.vehicleBasic,
        endRide: endRideOtp,
      },
      rideStatus: "ongoing",
    };

    setLoading(true);
    try {
      const responseImage = await postMultipleData(
        "/pickupImage",
        formData,
        token
      );

      if (responseImage?.status === 200) {
        setImage([]);
        setImageUrl([]);
        dispatch(togglePickupImageModal());
        dispatch(handleInvoiceCreated(updatedBooking));
        // updating the timeline for booking
        const timeLineData = {
          currentBooking_id: vehicleMaster && vehicleMaster[0]?._id,
          timeLine: {
            "Ride Started": new Date().toLocaleString(),
          },
        };
        postData("/createTimeline", timeLineData, token);
        handleAsyncError(dispatch, responseImage?.message, "success");
      } else {
        if (responseImage?.isKyc === false) {
          setIsKycApproved(true);
        }
        handleAsyncError(dispatch, responseImage?.message);
      }
    } catch (error) {
      handleAsyncError(dispatch, error?.message);
    } finally {
      setLoading(false);
    }
  };

  //   close modal and clear value
  const handleClearAndClose = () => {
    setImage([]);
    setImageUrl([]);
    dispatch(removeTempVehicleData());
    return dispatch(togglePickupImageModal());
  };

  // close modal and send to kyc page
  const handleCloseModalAndVerifyUser = (id) => {
    dispatch(togglePickupImageModal());
    return navigate(`/all-users/${id}`);
  };

  return (
    <div
      className={`fixed ${
        !isUploadPickupImageActive ? "hidden" : ""
      } z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-5 mx-auto shadow-xl rounded-md bg-white max-w-xl">
        <div className="flex justify-end p-2">
          <button
            onClick={handleClearAndClose}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            disabled={loading}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className="p-6 pt-0 text-center">
          <form onSubmit={handleUploadPickupImages}>
            {isKycApproved && (
              <div className="flex items-center justify-end gap-2 mb-2">
                <p className="text-gray-400">User KYC is Pending:</p>
                <button
                  type="button"
                  className="text-theme underline"
                  onClick={() =>
                    handleCloseModalAndVerifyUser(vehicleMaster[0]?.userId?._id)
                  }
                >
                  Verify KYC
                </button>
              </div>
            )}
            <div>
              <MultipleImageAndPreview
                image={image}
                setImageChanger={setImage}
                imagesUrl={imagesUrl}
                setImageUrlChanger={setImageUrl}
                loading={loading}
              />
              {imagesUrl && imagesUrl?.length > 6 && (
                <p className="text-theme text-sm text-left">
                  Max Upload Limit is 6 Images
                </p>
              )}
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-[48%]">
                <Input type="number" item="newMeterReading" require={true} />
              </div>
              <div className="w-[48%]">
                <Input type="number" item="oldMeterReading" require={true} />
              </div>
            </div>
            <Input type="number" item="rideOtp" require={true} />
            <button
              className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
              type="submit"
              disabled={
                loading || imagesUrl.length == 0 || imagesUrl.length > 6
              }
            >
              {!loading ? "Start Ride" : <Spinner message={"updating..."} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPickupImageModal;
