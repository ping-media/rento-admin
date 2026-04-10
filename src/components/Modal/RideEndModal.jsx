import Spinner from "../../components/Spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { toggleRideEndModal } from "../../Redux/SideBarSlice/SideBarSlice";
import Input from "../../components/InputAndDropdown/Input";
import { useEffect, useMemo, useState } from "react";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { postData } from "../../Data/index";
import {
  handleUpdateCompleteRide,
  updateTimeLineData,
} from "../../Redux/VehicleSlice/VehicleSlice";
import {
  formatDateToISO,
  formatNumber,
  formatPrice,
  getDurationInDaysAndHours,
  hasUnpaid,
  newGetDurationInDaysAndHours,
} from "../../utils/index";
import { useDebounce } from "../../utils/Helper/debounce";
import SelectDropDown from "../../components/InputAndDropdown/SelectDropDown";
import ChangeTextToInput from "../../components/InputAndDropdown/ChangeTextToInput";
import { tableIcons } from "../../Data/Icons";

const RideEndModal = ({ id }) => {
  const { isRideEndModalActive } = useSelector((state) => state.sideBar);
  const { vehicleMaster, vehiclePickupImage } = useSelector(
    (state) => state.vehicles,
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

  const booking = useMemo(() => vehicleMaster?.[0] ?? null, [vehicleMaster]);

  const pickupData = useMemo(() => {
    const vehiclePickupImageData =
      vehiclePickupImage?.[0]?.data?.updatedData ?? [];
    const vehicleMasterPickupImageData =
      vehicleMaster?.[0]?.pickupImage?.data?.updatedData ?? [];

    return vehiclePickupImageData.length > 0
      ? vehiclePickupImageData
      : vehicleMasterPickupImageData.length > 0
        ? vehicleMasterPickupImageData
        : [];
  }, [vehiclePickupImage, vehicleMaster]);

  const previousVehiclesKm = useMemo(() => {
    return pickupData.reduce((sum, entry) => {
      const ran = Math.max(
        0,
        Number(entry.oldVehicleEndMeterReading || 0) -
          Number(entry.startMeterReading || 0),
      );
      return sum + ran;
    }, 0);
  }, [pickupData]);

  const hasVehicleChanges = pickupData.length > 0;

  if (!booking) return null;

  const calculateLateFeeBeforeRidend = () => {
    const {
      BookingStartDateAndTime,
      BookingEndDateAndTime,
      vehicleBasic,
      bookingPrice,
    } = vehicleMaster?.[0];

    const nowIso = formatDateToISO(new Date()).replace(".000Z", "Z");

    const bookingStartDate = BookingStartDateAndTime.split("T")[0];
    const bookingEndDate = BookingEndDateAndTime.split("T")[0];
    const bookingEndTime = BookingEndDateAndTime.split("T")[1];

    const nowDate = nowIso.split("T")[0];
    const nowTime = nowIso.split("T")[1];

    /* ---------------------------------
     REFUND LOGIC
     --------------------------------- */
    let refundAmount = 0;

    const totalPrice =
      bookingPrice?.discountTotalPrice > 0
        ? Number(bookingPrice.discountTotalPrice)
        : Number(bookingPrice?.totalPrice || 0);

    // CASE 1: Same-day close → FULL refund
    if (nowDate === bookingStartDate) {
      refundAmount = totalPrice;
    }

    // CASE 2: Close between start & end → per-day refund
    else if (nowDate > bookingStartDate && nowDate < bookingEndDate) {
      const totalDurationDays = getDurationInDaysAndHours(
        BookingStartDateAndTime,
        BookingEndDateAndTime,
      ).days;

      const remainingDurationDays = getDurationInDaysAndHours(
        nowIso,
        BookingEndDateAndTime,
      ).days;

      if (totalDurationDays > 0 && remainingDurationDays > 0) {
        refundAmount = Math.round(
          totalPrice * (remainingDurationDays / totalDurationDays),
        );
      }
    }

    // CASE 3: On or after booking end → NO refund
    else {
      refundAmount = 0;
    }

    setRefundAmount(refundAmount);

    /* ---------------------------------
     HOUR LATE FEE
     --------------------------------- */
    let lateFeeBasedOnHour = 0;

    if (
      bookingEndDate < nowDate ||
      (bookingEndDate === nowDate && nowTime > bookingEndTime)
    ) {
      const duration = newGetDurationInDaysAndHours(
        BookingEndDateAndTime,
        nowIso,
      );

      if (duration?.totalHours > 0) {
        // const totalLateHours = duration.days * 24 + duration.hours;
        const totalLateHours = duration.totalHours;
        lateFeeBasedOnHour =
          totalLateHours * Number(vehicleBasic?.lateFee || 0);
      }
    }

    /* ---------------------------------
     KM LATE FEE
     --------------------------------- */
    const currentVehicleKm = Math.max(
      0,
      Number(meterDebounceValue) - Number(oldMeterReading),
    );

    // 👇 Add KMs from all previous vehicles before the change
    const totalDrivenKm = currentVehicleKm + previousVehiclesKm;

    // const totalDrivenKm = Math.max(
    //   0,
    //   Number(meterDebounceValue) - Number(oldMeterReading),
    // );

    const paidExtends =
      bookingPrice?.extendAmount?.filter((b) => b.status === "paid") || [];

    const extendKmLimit = paidExtends.reduce(
      (sum, e) => sum + Number(e?.freeLimit || 0),
      0,
    );

    const allowedKm = Number(vehicleBasic?.freeLimit || 0) + extendKmLimit;

    const extraKm = Math.max(0, totalDrivenKm - allowedKm);

    const lateFeeBasedOnKM = extraKm * Number(vehicleBasic?.extraKmCharge || 0);

    /* ---------------------------------
     FINAL SET
     --------------------------------- */
    setLateFees({
      lateFeeBasedOnHour,
      lateFeeBasedOnKM,
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

    if (booking?.bookingStatus === "completed")
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
        _id: booking?._id,
        userId: booking?.userId?._id,
        startMeterReading: oldMeterReading,
        endMeterReading: EndMeterReading,
        rideEndDate: formatDateToISO(new Date()).replace(".000Z", "Z"),
        rideOtp: endRide,
        rideStatus: "completed",
        bookingId: booking?.bookingId,
        lateFeeBasedOnHour: Number(lateFees?.lateFeeBasedOnHour) || 0,
        lateFeeBasedOnKM: Number(lateFees?.lateFeeBasedOnKM) || 0,
        additionalPrice: Number(additionalPrice),
        paymentMode: result?.PaymentMode || "NA",
        endDateTime: Date.now(),
      };
      const LateFeeAmount = data
        ? data.lateFeeBasedOnHour + data.lateFeeBasedOnKM
        : 0;

      // adding refund amount if greater than 0
      // if (
      //   formatDateToISO(new Date()).replace(".000Z", "Z") <
      //   booking?.BookingEndDateAndTime
      // ) {
      //   data = {
      //     ...data,
      //     closingDate: formatDateToISO(new Date()).replace(".000Z", "Z"),
      //     refundAmount: refundAmount,
      //   };
      // }
      if (refundAmount > 0) {
        data = {
          ...data,
          closingDate: formatDateToISO(new Date()).replace(".000Z", "Z"),
          refundAmount: Number(refundAmount ?? 0) ?? 0,
        };
      }

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
              refundAmount: Number(refundAmount ?? 0) ?? 0,
              paymentAmount: LateFeeAmount > 0 ? Number(LateFeeAmount) : 0,
              paymentMode: result?.PaymentMode || "",
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
    } else if (booking?.pickupImage !== null) {
      setOldMeterReading(booking?.pickupImage?.startMeterReading);
    }
  }, [vehiclePickupImage, vehicleMaster]);

  // closing modal and clear all the state to default
  const handleCloseModal = () => {
    SetEndRide(0);
    dispatch(toggleRideEndModal());
  };

  const hasPendingPayments =
    hasUnpaid(booking?.bookingPrice?.diffAmount) ||
    hasUnpaid(booking?.bookingPrice?.extendAmount);

  return (
    <div
      className={`fixed ${
        !isRideEndModalActive ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-20 md:top-14 mx-auto shadow-xl rounded-md bg-white max-w-lg">
        <div className="flex justify-between border-b p-2">
          <h2 className="text-theme font-semibold text-lg uppercase">
            End Ride
          </h2>
          <button
            onClick={handleCloseModal}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            disabled={formLoading || false}
          >
            {tableIcons?.X}
          </button>
        </div>

        <div className="p-6 lg:p-4 pt-0 text-center">
          <div className="lg:h-[30rem] overflow-y-scroll px-0">
            {/* if payment are pending this message will be show  */}
            {hasPendingPayments && (
              <p className="italic text-sm my-2 text-red-300 font-bold text-left">
                Warning: Some payments are pending. Please clear them before
                ending your ride.
              </p>
            )}

            {/* show distance breakdown if there are vehicle changes during the ride  */}
            {hasVehicleChanges && (
              <div className="text-left mb-5">
                <h3 className="font-semibold text-lg text-gray-600 mb-2">
                  Distance Breakdown:
                </h3>

                {/* Previous vehicles from updatedData */}
                {/* {(vehiclePickupImage?.[0]?.data?.updatedData ?? []).map( */}
                {pickupData.map((entry, index) => {
                  const driven = Math.max(
                    0,
                    Number(entry.oldVehicleEndMeterReading || 0) -
                      Number(entry.startMeterReading || 0),
                  );
                  return (
                    <div key={index} className="mb-3 border-b pb-2">
                      <p className="font-semibold text-medium text-gray-700">
                        {entry.vehicleNumber}:
                      </p>
                      <p className="text-base text-gray-500">
                        End reading: {entry.oldVehicleEndMeterReading} Km
                      </p>
                      <p className="text-base text-gray-500">
                        Start reading: {entry.startMeterReading} Km
                      </p>
                      <p className="text-base text-gray-500">
                        Distance driven: {driven} Km
                      </p>
                    </div>
                  );
                })}

                {/* Current vehicle */}
                <div className="mb-3 border-b pb-2">
                  <p className="font-semibold text-medium text-gray-700">
                    {booking?.vehicleBasic?.vehicleNumber}:
                  </p>
                  <p className="text-base text-gray-500">
                    End reading: {EndMeterReading || "—"} Km
                  </p>
                  <p className="text-base text-gray-500">
                    Start reading: {oldMeterReading} Km
                  </p>
                  <p className="text-base text-gray-500">
                    Distance driven:{" "}
                    {Math.max(
                      0,
                      Number(EndMeterReading || 0) - Number(oldMeterReading),
                    )}{" "}
                    Km
                  </p>
                </div>

                {/* Totals */}
                <div className="mt-2">
                  <p className="font-bold text-base text-gray-700">
                    Total Km driven:{" "}
                    {Math.max(
                      0,
                      Number(EndMeterReading || 0) - Number(oldMeterReading),
                    ) + previousVehiclesKm}{" "}
                    Km
                  </p>
                  <p className="font-bold text-base text-gray-700">
                    Km limit:{" "}
                    {Number(booking?.vehicleBasic?.freeLimit || 0) +
                      (
                        booking?.bookingPrice?.extendAmount?.filter(
                          (e) => e.status === "paid",
                        ) || []
                      ).reduce((s, e) => s + Number(e?.freeLimit || 0), 0)}{" "}
                    Km
                  </p>
                  <p className="font-bold text-base text-gray-700">
                    Extra Km:{" "}
                    {Math.max(
                      0,
                      Math.max(
                        0,
                        Number(EndMeterReading || 0) - Number(oldMeterReading),
                      ) +
                        previousVehiclesKm -
                        (Number(booking?.vehicleBasic?.freeLimit || 0) +
                          (
                            booking?.bookingPrice?.extendAmount?.filter(
                              (e) => e.status === "paid",
                            ) || []
                          ).reduce((s, e) => s + Number(e?.freeLimit || 0), 0)),
                    )}{" "}
                    Km
                  </p>
                </div>
              </div>
            )}

            {/* end-ride form */}
            <form onSubmit={handleEndBooking}>
              <div className="mb-2 text-left">
                {/* <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Start Meter Reading:</span>{" "}
                  {formatNumber(Number(oldMeterReading))} km
                </p> */}
                {lateFees?.lateFeeBasedOnKM >= 0 && (
                  <div className="text-theme mb-1 flex items-center">
                    <span className="font-semibold text-base text-gray-700 mr-1">
                      {/* late Fee Based On KM: */}
                      Extra KM Charge:
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
                {lateFees?.lateFeeBasedOnHour >= 0 && (
                  <div className="text-theme flex items-center">
                    <span className="font-semibold text-base text-gray-700 mr-1 mb-2">
                      {/* late Fee Based On Hour: */}
                      Extra Hour Charge:
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

                {refundAmount >= 0 && (
                  <div className="text-theme mb-1 flex items-center mt-2">
                    <span className="font-semibold text-base text-gray-700 mr-1">
                      Refund Amount:
                    </span>
                    <ChangeTextToInput
                      value={Number(refundAmount)}
                      setValue={(e) => setRefundAmount(e.target.value)}
                      type={"number"}
                      isnormal
                    />
                  </div>
                )}

                {(lateFees?.lateFeeBasedOnKM > 0 ||
                  lateFees?.lateFeeBasedOnHour > 0) && (
                  <p className="text-theme border-t">
                    <span className="font-semibold text-base text-gray-700">
                      Total Late Charges:
                    </span>{" "}
                    ₹
                    {formatPrice(
                      Number(lateFees?.lateFeeBasedOnHour) +
                        Number(lateFees?.lateFeeBasedOnKM),
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
                  value={0}
                  type="number"
                />
              </div>
              {(lateFees?.lateFeeBasedOnKM > 0 ||
                lateFees?.lateFeeBasedOnHour > 0) && (
                <div className="text-left mb-2">
                  <SelectDropDown
                    options={["cash"]}
                    value="cash"
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
                className="mt-2 text-center bg-theme px-4 py-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none disabled:bg-theme/60 w-full items-center justify-center"
                disabled={formLoading || endRide === 0}
              >
                {!formLoading ? "End Ride" : <Spinner message={"loading..."} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideEndModal;
