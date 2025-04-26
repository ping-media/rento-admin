import { useDispatch, useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { calculateTax, getDurationBetweenDates } from "../../utils";
import BookingStepOne from "./BookingComponents/BookingStepOne";
import BookingStepTwo from "./BookingComponents/BookingStepTwo";
import BookingStepThree from "./BookingComponents/BookingStepThree";
import { createOrderId, getData, postData } from "../../Data/index";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { CreatePaymentLinkAndTimeline } from "../../Data/Function";
import { updateTimeLineData } from "../../Redux/VehicleSlice/VehicleSlice";
import { tableIcons } from "../../Data/Icons";

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
  const [coupon, setCoupon] = useState({
    couponName: "",
    couponId: "",
    totalPrice: 0,
    discountPrice: 0,
    discountAmount: 0,
    isDiscountZero: false,
  });
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
    extraAddonPrice = 0
  ) => {
    const durationBetweenStartAndEnd = getDurationBetweenDates(
      bookingStartDate,
      bookingEndDate
    );

    const bookingPrice =
      selectedVehicle?.planPrice && selectedVehicle?.planPrice > 0
        ? selectedVehicle?.planPrice
        : Number(durationBetweenStartAndEnd?.days) *
          Number(selectedVehicle?.perDayCost);
    const rentAmount = Number(selectedVehicle?.perDayCost);

    const tax = calculateTax(bookingPrice + Number(extraAddonPrice), 18);

    const totalPrice = Math.round(bookingPrice + tax);

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

  // for fetching package data
  useEffect(() => {
    (async () => {
      try {
        setPlanData((prev) => ({ ...prev, loading: true }));
        const planResponse = await getData(
          "/getPlanData?page=1&limit=50",
          token
        );
        if (planResponse?.status === 200) {
          setPlanData((prev) => ({ ...prev, data: planResponse?.data }));
        }
      } finally {
        setPlanData((prev) => ({ ...prev, loading: false }));
      }
    })();
  }, []);

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
          (Number(formData?.stepTwoData?.totalPrice) * 20) / 100;
        userPaid = Number(needToPay);
        AmountLeftAfterUserPaid =
          Number(formData?.stepTwoData?.totalPrice) - Number(userPaid);
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
          totalPrice:
            coupon?.couponName != "" &&
            coupon?.couponId != "" &&
            coupon?.totalPrice > 0
              ? coupon?.totalPrice
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
          rentAmount: formData?.stepTwoData?.rentAmount,
          isPackageApplied: false,
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
          transactionIds: [],
        },
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

      console.log(data);
      return;

      if (result?.paymentMethod === "cash") {
        data = {
          ...data,
          payInitFrom: "Cash",
          bookingStatus: "done",
          paymentMethod: result?.paymentMethod,
        };
      }

      const bookingResponse = await postData("/createBooking", data, token);
      if (bookingResponse?.status === 200) {
        // updating the timeline for booking
        const timeLineData = {
          userId: bookingResponse?.data?.userId,
          bookingId: bookingResponse?.data?.bookingId,
          currentBooking_id: bookingResponse?.data?._id,
          isStart: true,
          timeLine: [
            {
              title: "Booking Created",
              date: new Date().toLocaleString(),
            },
          ],
        };
        // for creating booking
        await postData("/createTimeline", timeLineData, token);
        if (bookingResponse?.data?.paymentMethod === "cash") {
          const timeLineData = {
            currentBooking_id: bookingResponse?.data?._id,
            timeLine: [
              {
                title: "Pay Later",
                date: new Date().toLocaleString(),
                paymentAmount:
                  bookingResponse?.data?.bookingPrice?.discountTotalPrice > 0
                    ? bookingResponse?.data?.bookingPrice?.discountTotalPrice
                    : bookingResponse?.data?.bookingPrice?.totalPrice,
              },
            ],
          };
          await postData("/createTimeline", timeLineData, token);
          handleAsyncError(dispatch, "Ride Created Successfully", "success");
          navigate(`/all-bookings/details/${bookingResponse?.data?._id}`);
          return;
        }
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
          timeLine: [
            {
              title: "Payment Initiated",
              date: new Date().toLocaleString(),
            },
          ],
        };
        // for creating booking
        await postData("/createTimeline", timeLineData, token);
        // for updating sending link in it
        const updateTimeLineDataToPush = await CreatePaymentLinkAndTimeline(
          UpdatedBookingResponse?.data,
          token,
          "Payment Link Created"
        );
        dispatch(updateTimeLineData(updateTimeLineDataToPush));
        handleAsyncError(dispatch, "Ride Created Successfully", "success");
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
              setCoupon={setCoupon}
              coupon={coupon}
              setFormData={setFormData}
              plan={planData}
              setPlan={setPlanData}
              // onNext={handleNext}
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
