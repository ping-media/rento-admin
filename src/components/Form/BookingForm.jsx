import { useDispatch, useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { calculateTax, getDurationBetweenDates } from "../../utils";
import BookingStepOne from "./BookingComponents/BookingStepOne";
import BookingStepTwo from "./BookingComponents/BookingStepTwo";
import BookingStepThree from "./BookingComponents/BookingStepThree";
import { createOrderId, postData } from "../../Data/index";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { updateTimeLine } from "../../Data/Function";

const BookingForm = ({ handleFormSubmit, loading }) => {
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(id ? 3 : 1);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    stepOneData: {},
    stepTwoData: {},
  });

  // for sending to next steps
  const handleNext = (data) => {
    if (currentStep === 1) setFormData({ ...formData, stepOneData: data });
    setCurrentStep(currentStep + 1);
  };

  // for calculating price based on vehicles
  const changePriceAccordingtoData = (
    bookingStartDate,
    bookingEndDate,
    selectedVehicle,
    extraAddonPrice = 0
  ) => {
    const durationBetweenStartAndEnd = getDurationBetweenDates(
      bookingStartDate,
      bookingEndDate
    );

    const bookingPrice =
      Number(durationBetweenStartAndEnd?.days) *
      Number(selectedVehicle?.perDayCost);
    const rentAmount = Number(selectedVehicle?.perDayCost);

    const tax = calculateTax(bookingPrice, 18);

    // Include extraAddonPrice in the total calculation
    const totalPrice = bookingPrice + tax + Number(extraAddonPrice);

    const combinedData = {
      bookingPrice,
      rentAmount,
      extraAddonPrice,
      tax,
      totalPrice,
    };

    // Update the form data with the new stepTwoData
    setFormData({ ...formData, stepTwoData: combinedData });

    return combinedData;
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  // for creating new booking
  const handleFormSubmitForNew = async (event) => {
    event.preventDefault();
    const response = new FormData(event.target);
    let result = Object.fromEntries(response.entries());
    if (!formData && !result)
      return handleAsyncError(dispatch, "unable to make booking! try again.");

    try {
      setFormLoading(true);
      const paymentMethodStatus = result["paymentMethod"];
      let userPaid = 0;
      if (paymentMethodStatus === "partiallyPay") {
        userPaid = (Number(formData?.stepTwoData?.totalPrice) * 20) / 100;
      }
      // ride starting otp
      const startRideOtp = Math.floor(1000 + Math.random() * 9000);
      // creating booking data
      let data = {
        vehicleMasterId:
          formData?.stepOneData?.selectedVehicle?.vehicleMasterId,
        vehicleTableId: formData?.stepOneData?.vehicleId,
        vehicleImage: formData?.stepOneData?.selectedVehicle?.vehicleImage,
        vehicleBrand: formData?.stepOneData?.selectedVehicle?.vehicleBrand,
        vehicleName: formData?.stepOneData?.selectedVehicle?.vehicleName,
        stationId: formData?.stepOneData?.selectedVehicle?.stationId,
        stationName: formData?.stepOneData?.selectedVehicle?.stationName,
        userId: formData?.stepOneData?.userId,
        BookingStartDateAndTime: formData?.stepOneData?.bookingStartDate,
        BookingEndDateAndTime: formData?.stepOneData?.bookingEndDate,
        bookingPrice: {
          bookingPrice: formData?.stepTwoData?.bookingPrice,
          vehiclePrice: formData?.stepTwoData?.bookingPrice,
          extraAddonPrice: formData?.stepTwoData?.extraAddonPrice,
          tax: formData?.stepTwoData?.tax,
          totalPrice: formData?.stepTwoData?.totalPrice,
          discountPrice: 0,
          discountTotalPrice: 0,
          rentAmount: formData?.stepTwoData?.rentAmount,
          isPackageApplied: false,
          userPaid: userPaid,
          extendAmount: [],
        },
        vehicleBasic: {
          refundableDeposit:
            formData?.stepOneData?.selectedVehicle?.refundableDeposit,
          speedLimit: formData?.stepOneData?.selectedVehicle?.speedLimit,
          vehicleNumber: formData?.stepOneData?.selectedVehicle?.vehicleNumber,
          freeLimit: formData?.stepOneData?.selectedVehicle?.freeKms,
          lateFee: formData?.stepOneData?.selectedVehicle?.lateFee,
          extraKmCharge:
            formData?.stepOneData?.selectedVehicle?.extraKmsCharges,
          startRide: Number(startRideOtp),
          endRide: 0,
        },
        extendBooking: {
          oldBooking: [],
        },
        payInitFrom: "Razorpay",
        paySuccessId: "NA",
        paymentgatewayOrderId: "",
        paymentgatewayReceiptId: "",
        paymentInitiatedDate: "",
        discountCuopon: {
          couponName: "",
          couponId: "",
        },
        paymentMethod: result?.paymentMethod,
        bookingStatus: result?.bookingStatus,
        paymentStatus: result?.paymentStatus,
        rideStatus: result?.rideStatus,
      };

      const bookingResponse = await postData("/createBooking", data, token);
      if (bookingResponse?.status === 200) {
        // updating the timeline for booking
        const timeLineData = {
          userId: bookingResponse?.data?.userId,
          bookingId: bookingResponse?.data?.bookingId,
          currentBooking_id: bookingResponse?.data?._id,
          isStart: true,
          timeLine: {
            "Booking Created": new Date().toLocaleString(),
          },
        };
        // for creating booking
        await postData("/createTimeline", timeLineData, token);
        // for updating sending link in it
        await updateTimeLine(bookingResponse?.data, token);
      } else {
        return handleAsyncError(dispatch, bookingResponse?.message);
      }

      if (bookingResponse?.status !== 200)
        return handleAsyncError(dispatch, "unable to make booking! try again.");
      const generateOrder = await createOrderId(bookingResponse?.data);
      // updating the data but order id
      data = {
        ...bookingResponse?.data,
        paymentgatewayOrderId: generateOrder?.id,
        paymentgatewayReceiptId: generateOrder?.receipt,
        paymentInitiatedDate: generateOrder?.created_at,
      };

      const UpdatedBookingResponse = await postData(
        `/createBooking?_id=${bookingResponse?.data?._id}`,
        data,
        token
      );
      if (UpdatedBookingResponse?.status === 200) {
        // updating the timeline for booking
        const timeLineData = {
          currentBooking_id: UpdatedBookingResponse?.data?._id,
          timeLine: {
            "Payment Initiated": new Date().toLocaleString(),
          },
        };
        // for creating booking
        postData("/createTimeline", timeLineData, token);
        // for updating sending link in it
        await updateTimeLine(UpdatedBookingResponse?.data, token);
        handleAsyncError(dispatch, UpdatedBookingResponse?.message, "success");
        navigate(`/all-bookings/details/${UpdatedBookingResponse?.data?._id}`);
      } else {
        return handleAsyncError(dispatch, UpdatedBookingResponse?.message);
      }
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <form onSubmit={id ? handleFormSubmit : handleFormSubmitForNew}>
      <h2 className="text-theme-dark font-semibold text-md lg:text-xl mb-3 uppercase border-b-2 pb-2">
        {(currentStep === 1 && "Basic Info") ||
          (currentStep === 2 && "Booking Pricing") ||
          (currentStep === 3 && "Confirm Booking")}
      </h2>
      <div className="flex flex-wrap gap-4">
        {/* for updating the value of the existing one & for creating new one */}
        <>
          {currentStep === 1 && (
            <BookingStepOne
              data={formData?.stepOneData}
              token={token}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <BookingStepTwo
              data={formData?.stepOneData}
              priceCalculate={changePriceAccordingtoData}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}

          {currentStep === 3 && (
            <BookingStepThree id={id} onPrevious={handlePrevious} />
          )}
        </>
      </div>
      {currentStep === 3 && (
        <button
          className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
          type="submit"
          disabled={formLoading || loading}
        >
          {formLoading || loading ? (
            <Spinner message={"uploading"} />
          ) : id ? (
            "Update"
          ) : (
            "Add New"
          )}
        </button>
      )}
    </form>
  );
};

export default BookingForm;
