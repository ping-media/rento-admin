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

const BookingForm = ({ handleFormSubmit, loading }) => {
  // const [collectedData, setCollectedData] = useState(null);
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
      // creating bookking data
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
        },
        payInitFrom: "Razorpay",
        paySuccessId: "",
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
      if (!data)
        return handleAsyncError(dispatch, "unable to make booking! try again.");
      const generateOrder = await createOrderId(data);
      // updating the data but order id
      data = {
        ...data,
        paySuccessId: generateOrder?.id,
        paymentgatewayReceiptId: generateOrder?.receipt,
        paymentInitiatedDate: generateOrder?.created_at,
      };

      const response = await postData("/createBooking", data);
      if (response?.status == 200) {
        navigate("/all-bookings");
        handleAsyncError(dispatch, response?.message, "success");
      } else {
        handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <form onSubmit={id ? handleFormSubmit : handleFormSubmitForNew}>
      <div className="flex flex-wrap gap-4">
        {/* for updating the value of the existing one & for creating new one */}
        <>
          {currentStep === 1 && (
            <BookingStepOne token={token} onNext={handleNext} />
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
          ) : (
            "Publish"
          )}
        </button>
      )}
    </form>
  );
};

export default BookingForm;
