import { useDispatch, useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {
  calculateTax,
  calculateTotalAddOnPrice,
  getDurationBetweenDates,
} from "../../utils";
import BookingStepOne from "./BookingComponents/BookingStepOne";
import BookingStepTwo from "./BookingComponents/BookingStepTwo";
import BookingStepThree from "./BookingComponents/BookingStepThree";
import { postData } from "../../Data/index";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { tableIcons } from "../../Data/Icons";
import { addNewAddOnData } from "../../Redux/GeneralSlice/GeneralSlice";

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

  const [GST, setGST] = useState(null);
  const [coupon, setCoupon] = useState({
    couponName: "",
    couponId: "",
    totalPrice: 0,
    discountPrice: 0,
    discountAmount: 0,
    isDiscountZero: false,
  });
  const [addOns, setAddOn] = useState([]);
  const [planData, setPlanData] = useState({
    data: null,
    loading: false,
    selectedPlan: null,
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
    addOnArr,
  ) => {
    const durationBetweenStartAndEnd = getDurationBetweenDates(
      bookingStartDate,
      bookingEndDate,
    );

    // setting global gst and addon based on specific station
    const gstSettings = {
      status: selectedVehicle?.stationData?.isGstActive || "inactive",
      percentage: selectedVehicle?.vehicleMasterData?.gstPercentage || 1,
    };
    dispatch(addNewAddOnData(selectedVehicle?.stationData?.extraAddOn));
    setGST(gstSettings);

    let hasMatchPlan = null;
    if (selectedVehicle?.vehiclePlan?.length > 0) {
      hasMatchPlan = selectedVehicle?.vehiclePlan?.filter(
        (plan) =>
          Number(plan?.planDuration) ===
          Number(durationBetweenStartAndEnd?.days),
      )[0];
      setPlanData((prev) => ({ ...prev, data: hasMatchPlan }));
    } else {
      setPlanData((prev) => ({ ...prev, data: null }));
    }

    const bookingPrice =
      hasMatchPlan !== null && hasMatchPlan?.planPrice > 0
        ? hasMatchPlan?.planPrice
        : Number(selectedVehicle?.totalRentalCost);
    const rentAmount = Number(selectedVehicle?.perDayCost);

    if (addOnArr?.length > 0) {
      setAddOn(addOnArr);
    } else {
      setAddOn([]);
    }

    const { totalAddonAmount, totalAddonTax } = calculateTotalAddOnPrice(
      addOnArr,
      durationBetweenStartAndEnd?.days,
    );

    let tax = 0;
    if (selectedVehicle?.stationData?.isGstActive === "active") {
      tax =
        selectedVehicle?.tax ||
        Math.round(
          calculateTax(
            bookingPrice,
            Number(selectedVehicle?.vehicleMasterData?.gstPercentage),
          ),
        );
    }

    const totalPrice =
      bookingPrice + Math.round(Number(totalAddonAmount)) + tax + totalAddonTax;

    const combinedData = {
      bookingPrice,
      rentAmount,
      extraAddonPrice: Math.round(Number(totalAddonAmount)),
      tax,
      addonTax: totalAddonTax,
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
      let AmountLeftAfterUserPaid = 0;
      if (paymentMethodStatus === "partiallyPay") {
        const needToPay =
          !coupon?.isDiscountZero && coupon?.discountPrice > 0
            ? (Number(coupon?.discountPrice) * 20) / 100
            : (Number(formData?.stepTwoData?.totalPrice) * 20) / 100;
        userPaid = Number(needToPay);
        AmountLeftAfterUserPaid =
          Number(formData?.stepTwoData?.totalPrice) - Number(userPaid);
      }
      // ride starting otp
      const startRideOtp = Math.floor(1000 + Math.random() * 9000);

      // calculating the free km limit
      const isPackage =
        formData?.stepOneData?.selectedVehicle?.appliedPlans?.length > 0
          ? formData?.stepOneData?.selectedVehicle?.appliedPlans
          : null;

      const daysBreakdowns =
        formData?.stepOneData?.selectedVehicle?._daysBreakdown ||
        formData?.stepOneData?.selectedVehicle?.daysBreakdown ||
        null;

      const freeKmLimitForPlan =
        isPackage !== null
          ? isPackage.reduce((sum, plan) => {
              return sum + plan.kmLimit * plan.count;
            }, 0)
          : 0;
      const freeKmLimitForDays =
        daysBreakdowns !== null
          ? daysBreakdowns?.length *
            formData?.stepOneData?.selectedVehicle?.freeKms
          : 0;

      const freeLimit = freeKmLimitForPlan + freeKmLimitForDays;

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
          extraAddonDetails: addOns,
          extraAddonPrice: formData?.stepTwoData?.extraAddonPrice,
          tax: formData?.stepTwoData?.tax || 0,
          addonTax: formData?.stepTwoData?.addonTax || 0,
          totalPrice:
            coupon?.couponName != "" &&
            coupon?.couponId != "" &&
            coupon?.totalPrice > 0
              ? coupon?.totalPrice + formData?.stepTwoData?.extraAddonPrice
              : formData?.stepTwoData?.totalPrice,
          discountPrice:
            coupon?.couponName != "" &&
            coupon?.couponId != "" &&
            coupon?.discountAmount > 0
              ? Number(coupon?.discountAmount)
              : 0,
          discountTotalPrice:
            coupon?.couponName != "" &&
            coupon?.couponId != "" &&
            coupon?.discountPrice > 0
              ? coupon?.discountPrice
              : 0,
          isDiscountZero: coupon?.isDiscountZero,
          rentAmount: formData?.stepTwoData?.rentAmount,
          userPaid: Math.round(userPaid),
          AmountLeftAfterUserPaid: {
            amount: Math.round(AmountLeftAfterUserPaid),
            status: "unpaid",
          },
          isPackageApplied:
            planData?.selectedPlan !== null &&
            planData?.selectedPlan?.length > 0
              ? true
              : false,
          daysBreakdown:
            formData?.stepOneData?.selectedVehicle?._daysBreakdown ||
            formData?.stepOneData?.selectedVehicle?.daysBreakdown ||
            [],
          appliedPlan:
            formData?.stepOneData?.selectedVehicle?.appliedPlans || [],
          extendAmount: [],
        },
        vehicleBasic: {
          refundableDeposit:
            formData?.stepOneData?.selectedVehicle?.refundableDeposit,
          speedLimit: formData?.stepOneData?.selectedVehicle?.speedLimit,
          vehicleNumber:
            formData?.stepOneData?.selectedVehicle?.vehicleNumber ||
            formData?.stepOneData?.selectedVehicle?.vehicleDetails[0]
              ?.vehicleNumber,
          freeLimit: freeLimit || 0,
          lateFee: formData?.stepOneData?.selectedVehicle?.lateFee,
          extraKmCharge:
            formData?.stepOneData?.selectedVehicle?.extraKmsCharges,
          startRide: Number(startRideOtp),
          endRide: 0,
        },
        extendBooking: {
          oldBooking: [],
          transactionIds: [],
        },
        bookedFrom: "admin",
        payInitFrom: result?.paymentMethod === "cash" ? "Cash" : "Razorpay",
        paySuccessId: "NA",
        paymentgatewayOrderId: "",
        paymentgatewayReceiptId: "",
        paymentInitiatedDate: "",
        discountCuopon: {
          couponName: coupon?.couponName || "",
          couponId: coupon?.couponId || "",
        },
        paymentMethod: result?.paymentMethod,
        bookingStatus: result?.bookingStatus || "done",
        paymentStatus: result?.paymentStatus || "pending",
        rideStatus: result?.rideStatus || "pending",
      };

      console.log("Booking Data to send:", data);
      return;

      const bookingResponse = await postData(
        "/initiate-booking",
        {
          bookingData: data,
          paymentMethod: result?.paymentMethod,
        },
        token,
      );

      if (result?.paymentMethod === "cash") {
        if (bookingResponse?.status === 200) {
          handleAsyncError(dispatch, "Ride booked successfully", "success");
          navigate(
            `/all-bookings/details/${bookingResponse?.data?._id}_${bookingResponse?.data?.bookingId}`,
          );
          return;
        } else {
          handleAsyncError(dispatch, bookingResponse?.message);
        }
      } else if (["online", "partiallyPay"].includes(paymentMethodStatus)) {
        const { orderId, booking_id, payableAmount } = bookingResponse.data;
        if (orderId && orderId !== "") {
          const paymentLinkResponse = await postData(
            "/create-payment-link",
            {
              bookingId: booking_id,
              amount: payableAmount,
              orderId,
              type:
                paymentMethodStatus === "partiallyPay" ? "partiallyPay" : "",
            },
            token,
          );
          if (paymentLinkResponse?.linkCreated === true) {
            handleAsyncError(dispatch, "Ride booked successfully", "success");
            navigate(
              `/all-bookings/details/${bookingResponse?.data?.booking_id}_${bookingResponse?.data?.bookingId}`,
            );
            return;
          } else {
            handleAsyncError(dispatch, paymentLinkResponse?.message);
          }
        }
      }
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <form onSubmit={id ? handleFormSubmit : handleFormSubmitForNew}>
      <div className="flex items-center gap-2 border-b-2 mb-3 pb-2">
        {currentStep !== 1 && (
          <button className="p-1" type="button" onClick={handlePrevious}>
            {tableIcons?.backArrow}
          </button>
        )}
        <h2 className="text-theme-dark font-semibold text-md lg:text-xl uppercase">
          {(currentStep === 1 && "Basic Info") ||
            (currentStep === 2 && "Confirm Booking") ||
            (currentStep === 3 && "Confirm Booking")}
        </h2>
      </div>
      <div className="flex flex-wrap gap-4">
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
              gst={GST}
              setCoupon={setCoupon}
              coupon={coupon}
              setFormData={setFormData}
              plan={planData}
              setPlan={setPlanData}
            />
          )}

          {id && currentStep === 3 && (
            <BookingStepThree id={id} onPrevious={handlePrevious} />
          )}
        </>
      </div>
      {(currentStep === 2 || (id && currentStep === 3)) && (
        <button
          className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
          type="submit"
          disabled={formLoading || loading}
        >
          {formLoading || loading ? (
            <Spinner
              message={
                id
                  ? "uploading"
                  : "booking. Do not refresh or press back button"
              }
            />
          ) : id ? (
            "Update"
          ) : (
            "Book Ride"
          )}
        </button>
      )}
    </form>
  );
};

export default BookingForm;
