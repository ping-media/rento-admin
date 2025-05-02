import Spinner from "../../components/Spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { toggleRideEndModal } from "../../Redux/SideBarSlice/SideBarSlice";
import Input from "../../components/InputAndDropdown/Input";
import { useEffect, useState } from "react";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { postData } from "../../Data/index";
import {
  handleUpdateCompleteRide,
  updateTimeLineData,
} from "../../Redux/VehicleSlice/VehicleSlice";
import {
  formatDateToISO,
  formatPrice,
  getDurationInDaysAndHours,
} from "../../utils/index";
import { useDebounce } from "../../utils/Helper/debounce";
import SelectDropDown from "../../components/InputAndDropdown/SelectDropDown";
import ChangeTextToInput from "../../components/InputAndDropdown/ChangeTextToInput";

const RideEndModal = ({ id }) => {
  const { isRideEndModalActive } = useSelector((state) => state.sideBar);
  const { vehicleMaster, vehiclePickupImage } = useSelector(
    (state) => state.vehicles
  );
  const { token } = useSelector((state) => state.user);
  const [formLoading, setFormLoading] = useState(false);
  const [endRide, SetEndRide] = useState(0);
  const [oldMeterReading, setOldMeterReading] = useState(0);
  const [EndMeterReading, SetEndMeterReading] = useState(0);
  const [lateFees, setLateFees] = useState({
    lateFeeBasedOnKM: 0,
    lateFeeBasedOnHour: 0,
  });
  const [additionalPrice, setAdditionalPrice] = useState(0);
  const [refundAmount, setRefundAmount] = useState(0);
  const meterDebounceValue = useDebounce(EndMeterReading, 300);
  const dispatch = useDispatch();

  const calculateLateFeeBeforeRidend = () => {
    const {
      BookingStartDateAndTime,
      BookingEndDateAndTime,
      vehicleBasic,
      bookingPrice,
      extendBooking,
    } = vehicleMaster[0];
    // void calulating the rate before end date
    const isCurrentDateIsSmall =
      BookingEndDateAndTime.split("T")[0] >
      formatDateToISO(new Date()).split("T")[0];

    const newBookingEndDateAndTime = extendBooking?.originalEndDate
      ? extendBooking?.originalEndDate
      : BookingEndDateAndTime;

    const bookingDuration = getDurationInDaysAndHours(
      BookingStartDateAndTime,
      newBookingEndDateAndTime
    );
    let extendBookingDuration = null;

    if (extendBooking?.originalEndDate) {
      extendBookingDuration = getDurationInDaysAndHours(
        extendBooking?.originalEndDate,
        BookingEndDateAndTime
      );
    }

    const duration = getDurationInDaysAndHours(
      BookingEndDateAndTime,
      formatDateToISO(new Date()).replace(".000Z", "Z")
    );

    let refundAmount = 0;
    let extensionAmount = 0;
    if (isCurrentDateIsSmall) {
      const totalPrice =
        bookingPrice?.discountTotalPrice > 0
          ? bookingPrice?.discountTotalPrice
          : bookingPrice?.totalPrice;
      if (Number(bookingDuration?.days) > 0) {
        refundAmount =
          (Number(totalPrice) / Number(bookingDuration?.days)) *
          Number(duration?.days);
      } else if (extendBookingDuration !== null) {
        if (bookingPrice?.extendAmount?.length === 0) return;
        const totalAmount =
          bookingPrice?.extendAmount[bookingPrice?.extendAmount?.length - 1]
            ?.status === "paid"
            ? bookingPrice?.extendAmount[bookingPrice?.extendAmount?.length - 1]
                ?.amount
            : 0;
        if (totalAmount > 0) {
          extensionAmount =
            (Number(totalAmount) / Number(extendBookingDuration?.days)) *
            Number(duration?.days);
        }
      }
      const totalRefundAmount =
        (refundAmount > 0 ? refundAmount : 0) +
        (extensionAmount > 0 ? extensionAmount : 0);
      setRefundAmount(Math.round(totalRefundAmount));
    }

    let lateFeeBasedOnHour;
    if (isCurrentDateIsSmall !== true) {
      lateFeeBasedOnHour =
        Number(vehicleBasic?.lateFee) *
          (duration?.days * 24 + duration?.hours) || 0;
    }

    const lateKm =
      (Number(meterDebounceValue) > Number(oldMeterReading) &&
        Number(meterDebounceValue) - Number(oldMeterReading)) ||
      0;

    const daysBtwDates = getDurationInDaysAndHours(
      BookingStartDateAndTime,
      BookingEndDateAndTime
    );
    let allowKm =
      (Number(daysBtwDates?.days) === 0 ? 1 : Number(daysBtwDates?.days)) *
      Number(vehicleBasic?.freeLimit);

    if (isCurrentDateIsSmall) {
      const removeKm = Number(duration?.days) * Number(vehicleBasic?.freeLimit);
      allowKm = allowKm - removeKm;
    }
    const lateFeeBasedOnKM = (lateKm - allowKm) * vehicleBasic?.extraKmCharge;
    console.log(allowKm, lateFeeBasedOnKM);

    setLateFees({
      lateFeeBasedOnHour: lateFeeBasedOnHour || 0,
      lateFeeBasedOnKM: lateFeeBasedOnKM > 0 ? lateFeeBasedOnKM : 0,
    });
  };

  useEffect(() => {
    if (EndMeterReading === 0) return;
    calculateLateFeeBeforeRidend();
  }, [meterDebounceValue]);

  // for completing the booking
  const handleEndBooking = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const result = Object.fromEntries(formData.entries());
    if (endRide === 0 && EndMeterReading === 0 && oldMeterReading === 0)
      return handleAsyncError(dispatch, "all fields required.");
    if (vehicleMaster[0]?.bookingStatus === "completed")
      return handleAsyncError(dispatch, "Ride Already Completed!.Refresh Page");

    if (lateFees?.lateFeeBasedOnKM > 0 || lateFees?.lateFeeBasedOnHour > 0) {
      if (!result?.PaymentMode || result?.PaymentMode === "") {
        handleAsyncError(dispatch, "Payment Mode is required");
        return;
      }
    }

    setFormLoading(true);
    try {
      let data = {
        _id: vehicleMaster[0]?._id,
        userId: vehicleMaster[0]?.userId?._id,
        startMeterReading: oldMeterReading,
        endMeterReading: EndMeterReading,
        rideEndDate: formatDateToISO(new Date()).replace(".000Z", "Z"),
        rideOtp: endRide,
        rideStatus: "completed",
        bookingId: vehicleMaster[0]?.bookingId,
        lateFeeBasedOnHour: Number(lateFees?.lateFeeBasedOnHour) || 0,
        lateFeeBasedOnKM: Number(lateFees?.lateFeeBasedOnKM) || 0,
        additionalPrice: Number(additionalPrice),
        paymentMode: result?.PaymentMode || "NA",
      };
      // this is for preclosing the ride
      if (
        formatDateToISO(new Date()).replace(".000Z", "Z") <
        vehicleMaster[0]?.BookingEndDateAndTime
      ) {
        data = {
          ...data,
          closingDate: formatDateToISO(new Date()).replace(".000Z", "Z"),
          refundAmount: refundAmount,
        };
      }
      // console.log(data);
      // return;
      const response = await postData("/rideUpdate", data, token, "put");
      if (response.status === 200) {
        handleAsyncError(dispatch, "Ride completed successfully", "success");
        // updating the timeline for booking
        const timeLineData = {
          currentBooking_id: id,
          timeLine: [
            {
              title:
                refundAmount > 0
                  ? "Booking Ended & Refunded"
                  : "Booking Completed",
              date: Date.now(),
            },
          ],
        };
        postData("/createTimeline", timeLineData, token);
        // for updating timeline redux data
        dispatch(updateTimeLineData(timeLineData));
        handleCloseModal();
        return dispatch(handleUpdateCompleteRide(response?.data));
      }
      if (response?.status !== 200)
        return handleAsyncError(dispatch, response?.message);
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    if (vehiclePickupImage !== null) {
      setOldMeterReading(vehiclePickupImage[0]?.startMeterReading);
    }
  }, [vehiclePickupImage]);

  // after closing the modal clear all the state to default
  const handleCloseModal = () => {
    SetEndRide(0);
    dispatch(toggleRideEndModal());
  };

  return (
    <div
      className={`fixed ${
        !isRideEndModalActive ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-10 mx-auto shadow-xl rounded-md bg-white max-w-lg">
        <div className="flex justify-between p-2">
          <h2 className="text-theme font-semibold text-lg uppercase">
            Finish Ride
          </h2>
          <button
            onClick={handleCloseModal}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            disabled={formLoading || false}
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
          {/* if payment are pending this message will be show  */}
          {((vehicleMaster[0]?.bookingPrice?.diffAmount &&
            vehicleMaster[0]?.bookingPrice?.diffAmount?.every(
              (item) => item.status === "paid"
            ) === false) ||
            (vehicleMaster[0]?.bookingPrice?.extendAmount &&
              vehicleMaster[0]?.bookingPrice?.extendAmount?.every(
                (item) => item.status === "paid"
              ) === false)) && (
            <p className="italic text-xs lg:text-sm my-2 text-red-300 font-bold text-left">
              Warning: Some payments are pending. Please clear them before
              ending your ride.
            </p>
          )}
          {/* end ride form */}
          <form onSubmit={handleEndBooking}>
            <div className="mb-2 text-left">
              <p className="text-gray-400 mb-1">
                <span className="font-semibold">Start Meter Reading:</span>{" "}
                {oldMeterReading}
              </p>
              {refundAmount > 0 && (
                <div className="text-theme mb-1 flex items-center">
                  <span className="font-semibold text-gray-400">
                    Refund Amount:
                  </span>{" "}
                  <ChangeTextToInput
                    value={Number(refundAmount)}
                    setValue={(e) => setRefundAmount(e.target.value)}
                    type={"number"}
                  />
                </div>
              )}
              {lateFees?.lateFeeBasedOnKM > 0 && (
                <div className="text-theme mb-1 flex items-center">
                  <span className="font-semibold text-gray-400">
                    late Fee Based On KM:
                  </span>{" "}
                  <ChangeTextToInput
                    value={Number(lateFees?.lateFeeBasedOnKM)}
                    setValue={(e) =>
                      setLateFees({
                        ...lateFees,
                        lateFeeBasedOnKM: e.target.value,
                      })
                    }
                    type={"number"}
                  />
                </div>
              )}
              {lateFees?.lateFeeBasedOnHour > 0 && (
                <div className="text-theme flex items-center">
                  <span className="font-semibold text-gray-400 mb-2">
                    late Fee Based On Hour:
                  </span>{" "}
                  <ChangeTextToInput
                    value={Number(lateFees?.lateFeeBasedOnHour)}
                    setValue={(e) =>
                      setLateFees({
                        ...lateFees,
                        lateFeeBasedOnHour: e.target.value,
                      })
                    }
                    type={"number"}
                  />
                </div>
              )}
              {(lateFees?.lateFeeBasedOnKM > 0 ||
                lateFees?.lateFeeBasedOnHour > 0) && (
                <p className="text-theme">
                  <span className="font-semibold text-gray-400">
                    Total Late Fee:
                  </span>{" "}
                  ₹
                  {formatPrice(
                    Number(lateFees?.lateFeeBasedOnHour) +
                      Number(lateFees?.lateFeeBasedOnKM)
                  )}
                </p>
              )}
            </div>
            <div className="mb-2">
              <Input
                item={"endMeterReading"}
                setValueChange={SetEndMeterReading}
                type="number"
                require={true}
              />
            </div>
            <div className="mb-2">
              <Input
                item={"additionalPrice"}
                setValueChange={setAdditionalPrice}
                type="number"
              />
            </div>
            {(lateFees?.lateFeeBasedOnKM > 0 ||
              lateFees?.lateFeeBasedOnHour > 0) && (
              <div className="text-left mb-2">
                <SelectDropDown
                  options={["cash", "online"]}
                  item="PaymentMode"
                  require={true}
                  isSearchEnable={false}
                />
              </div>
            )}
            <div className="mb-2">
              <Input
                item={"OTP"}
                setValueChange={SetEndRide}
                type="number"
                require={true}
              />
            </div>
            <button
              type="submit"
              className="bg-theme px-4 py-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none disabled:bg-gray-400"
              disabled={formLoading || endRide === 0}
            >
              {!formLoading ? "End Ride" : <Spinner message={"loading..."} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RideEndModal;
