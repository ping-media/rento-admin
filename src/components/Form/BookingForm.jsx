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
import { postData } from "../../Data/index";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { addNewAddOnData } from "../../Redux/GeneralSlice/GeneralSlice";

const BookingForm = ({ handleFormSubmit, loading }) => {
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(id ? 3 : 1);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    vehicleId: "",
    stationId: "",
    bookingStartDate: "",
    bookingEndDate: "",
    selectedVehicle: null,
    isLocationSelected: "",
    duration: 1,
  });

  const [stepTwoData, setStepTwoData] = useState({
    bookingPrice: 0,
    rentAmount: 0,
    extraAddonPrice: 0,
    tax: 0,
    addonTax: 0,
    totalPrice: 0,
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
    setStepTwoData(combinedData);

    return combinedData;
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
            : (Number(stepTwoData?.totalPrice) * 20) / 100;

        userPaid = Number(needToPay);
        AmountLeftAfterUserPaid =
          Number(stepTwoData?.totalPrice) - Number(userPaid);
      }
      // ride starting otp
      const startRideOtp = Math.floor(1000 + Math.random() * 9000);

      // calculating the free km limit
      const isPackage =
        formData?.selectedVehicle?.appliedPlans?.length > 0
          ? formData?.selectedVehicle?.appliedPlans
          : null;

      const daysBreakdowns =
        formData?.selectedVehicle?._daysBreakdown ||
        formData?.selectedVehicle?.daysBreakdown ||
        null;

      const freeKmLimitForPlan =
        isPackage !== null
          ? isPackage.reduce((sum, plan) => {
              return sum + plan.kmLimit * plan.count;
            }, 0)
          : 0;

      const freeKmLimitForDays =
        daysBreakdowns !== null
          ? daysBreakdowns?.length * formData?.selectedVehicle?.freeKms
          : 0;

      const freeLimit = freeKmLimitForPlan + freeKmLimitForDays;

      // creating booking data
      let data = {
        vehicleMasterId: formData?.selectedVehicle?.vehicleMasterId,
        vehicleTableId: formData?.vehicleId,
        vehicleImage: formData?.selectedVehicle?.vehicleImage,
        vehicleBrand: formData?.selectedVehicle?.vehicleBrand,
        vehicleName: formData?.selectedVehicle?.vehicleName,
        stationId: formData?.selectedVehicle?.stationId,
        stationName: formData?.selectedVehicle?.stationName,
        userId: formData?.userId,
        BookingStartDateAndTime: formData?.bookingStartDate,
        BookingEndDateAndTime: formData?.bookingEndDate,
        bookingPrice: {
          bookingPrice: stepTwoData?.bookingPrice,
          vehiclePrice: stepTwoData?.bookingPrice,
          extraAddonDetails: addOns,
          extraAddonPrice: stepTwoData?.extraAddonPrice,
          tax: stepTwoData?.tax || 0,
          addonTax: stepTwoData?.addonTax || 0,
          totalPrice:
            coupon?.couponName != "" &&
            coupon?.couponId != "" &&
            coupon?.totalPrice > 0
              ? coupon?.totalPrice + stepTwoData?.extraAddonPrice
              : stepTwoData?.totalPrice,
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
          rentAmount: stepTwoData?.rentAmount,
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
            formData?.selectedVehicle?._daysBreakdown ||
            formData?.selectedVehicle?.daysBreakdown ||
            [],
          appliedPlan: formData?.selectedVehicle?.appliedPlans || [],
          extendAmount: [],
        },
        vehicleBasic: {
          refundableDeposit: formData?.selectedVehicle?.refundableDeposit,
          speedLimit: formData?.selectedVehicle?.speedLimit,
          vehicleNumber:
            formData?.selectedVehicle?.vehicleNumber ||
            formData?.selectedVehicle?.vehicleDetails[0]?.vehicleNumber,
          freeLimit: freeLimit || 0,
          lateFee: formData?.selectedVehicle?.lateFee,
          extraKmCharge: formData?.selectedVehicle?.extraKmsCharges,
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

      // console.log("Booking Data to send:", data);
      // return;

      const bookingResponse = await postData(
        "/initiate-booking",
        {
          bookingData: data,
          paymentMethod: result?.paymentMethod,
          isAdminBooking: true,
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
    <form onSubmit={handleFormSubmitForNew}>
      <div className="flex flex-wrap gap-4">
        <>
          <BookingStepOne
            data={formData?.stepOneData}
            token={token}
            onNext={handleNext}
            setFormData={setFormData}
          />

          {formData.bookingStartDate &&
            formData.bookingEndDate &&
            formData.selectedVehicle && (
              <BookingStepTwo
                data={formData}
                priceCalculate={changePriceAccordingtoData}
                gst={GST}
                setCoupon={setCoupon}
                coupon={coupon}
                setFormData={setFormData}
                plan={planData}
                setPlan={setPlanData}
                stepTwoData={stepTwoData}
                setStepTwoData={setStepTwoData}
              />
            )}
        </>
      </div>

      <button
        className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-5 focus:outline-none focus:ring-2 disabled:bg-gray-400"
        type="submit"
        disabled={
          formLoading ||
          loading ||
          formData.userId === "" ||
          formData.vehicleId === "" ||
          formData.bookingStartDate === "" ||
          formData.bookingEndDate === ""
        }
      >
        {formLoading || loading ? (
          <Spinner message={"booking. Do not refresh or press back button"} />
        ) : (
          "Create Booking"
        )}
      </button>
    </form>
  );
};

export default BookingForm;
