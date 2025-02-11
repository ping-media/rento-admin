import Spinner from "../../components/Spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { toggleRideEndModal } from "../../Redux/SideBarSlice/SideBarSlice";
import Input from "../../components/InputAndDropdown/Input";
import { useEffect, useState } from "react";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { getData, postData } from "../../Data/index";
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

const RideEndModal = ({ id }) => {
  const { isRideEndModalActive } = useSelector((state) => state.sideBar);
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const { token } = useSelector((state) => state.user);
  const [formLoading, setFormLoading] = useState(false);
  const [endRide, SetEndRide] = useState(0);
  const [oldMeterReading, setOldMeterReading] = useState(0);
  const [loading, setLoading] = useState(false);
  const [EndMeterReading, SetEndMeterReading] = useState(0);
  const [lateFees, setLateFees] = useState({
    lateFeeBasedOnKM: 0,
    lateFeeBasedOnHour: 0,
  });
  const meterDebounceValue = useDebounce(EndMeterReading, 300);
  const dispatch = useDispatch();

  const calculateLateFeeBeforeRidend = () => {
    const { BookingStartDateAndTime, BookingEndDateAndTime, vehicleBasic } =
      vehicleMaster[0];
    const iscurrentDateOrStartDateSame =
      BookingStartDateAndTime.split("T")[0] ===
      formatDateToISO(new Date()).split("T")[0];
    // void calulating the rate before end date
    const isCurrentDateIsSmall =
      BookingEndDateAndTime.split("T")[0] >
      formatDateToISO(new Date()).split("T")[0];

    if (iscurrentDateOrStartDateSame === true) return console.log("exit");

    const duration = getDurationInDaysAndHours(
      BookingEndDateAndTime,
      formatDateToISO(new Date()).replace(".000Z", "Z")
    );

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
    const allowKm =
      Number(daysBtwDates?.days) * Number(vehicleBasic?.freeLimit);
    const lateFeeBasedOnKM = (lateKm - allowKm) * vehicleBasic?.extraKmCharge;

    // console.log(
    //   lateKm,
    //   allowKm,
    //   lateFeeBasedOnKM,
    //   daysBtwDates,
    //   vehicleBasic?.freeLimit
    // );

    setLateFees({
      lateFeeBasedOnHour: lateFeeBasedOnHour,
      lateFeeBasedOnKM: lateFeeBasedOnKM,
    });
  };

  useEffect(() => {
    if (EndMeterReading === 0) return;
    calculateLateFeeBeforeRidend();
  }, [meterDebounceValue]);

  // for completing the booking
  const handleEndBooking = async (event) => {
    event.preventDefault();
    if (endRide === 0 && EndMeterReading === 0 && oldMeterReading === 0)
      return handleAsyncError(dispatch, "all fields required.");
    if (vehicleMaster[0]?.bookingStatus === "completed")
      return handleAsyncError(dispatch, "Ride Already Completed!.Refresh Page");
    setFormLoading(true);
    try {
      const data = {
        _id: vehicleMaster[0]?._id,
        userId: vehicleMaster[0]?.userId?._id,
        startMeterReading: oldMeterReading,
        endMeterReading: EndMeterReading,
        rideEndDate: formatDateToISO(new Date()).replace(".000Z", "Z"),
        rideOtp: endRide,
        rideStatus: "completed",
        bookingId: vehicleMaster[0]?.bookingId,
        lateFeeBasedOnHour: lateFees?.lateFeeBasedOnHour,
        lateFeeBasedOnKM: lateFees?.lateFeeBasedOnKM,
      };
      const response = await postData("/rideUpdate", data, token, "put");
      if (response.status === 200) {
        handleAsyncError(dispatch, "Ride completed successfully", "success");
        // updating the timeline for booking
        const timeLineData = {
          currentBooking_id: id,
          timeLine: [
            {
              title: "Booking Completed",
              date: new Date().toLocaleString(),
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
    (async () => {
      try {
        setLoading(true);
        const response = await getData(
          `/getPickupImage?bookingId=${vehicleMaster[0]?.bookingId}`,
          token
        );
        // if (response?.status !== 200)
        //   return handleAsyncError(dispatch, response?.message);
        // console.log(response?.data);
        return setOldMeterReading(response?.data[0]?.startMeterReading);
      } catch (error) {
        return handleAsyncError(dispatch, error?.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [vehicleMaster]);

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
      <div className="relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-md">
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
          <form onSubmit={handleEndBooking}>
            <div className="mb-2 text-left">
              <p className="text-gray-400 mb-1">
                <span className="font-semibold">Start Meter Reading:</span>{" "}
                {!loading ? oldMeterReading : "loading..."}
              </p>
              {lateFees?.lateFeeBasedOnKM > 0 && (
                <p className="text-theme mb-1">
                  <span className="font-semibold text-gray-400">
                    late Fee Based On KM:
                  </span>{" "}
                  ₹{formatPrice(lateFees?.lateFeeBasedOnKM)}
                </p>
              )}
              {lateFees?.lateFeeBasedOnHour > 0 && (
                <p className="text-theme">
                  <span className="font-semibold text-gray-400 mb-2">
                    late Fee Based On Hour:
                  </span>{" "}
                  ₹{formatPrice(lateFees?.lateFeeBasedOnHour)}
                </p>
              )}
              {lateFees?.lateFeeBasedOnKM > 0 &&
                lateFees?.lateFeeBasedOnHour > 0 && (
                  <p className="text-theme">
                    <span className="font-semibold text-gray-400">
                      Total Late Fee:
                    </span>{" "}
                    ₹
                    {formatPrice(
                      lateFees?.lateFeeBasedOnHour + lateFees?.lateFeeBasedOnKM
                    )}
                  </p>
                )}
            </div>
            <div className="mb-2">
              <Input
                item={"endMeterReading"}
                setValueChange={SetEndMeterReading}
                type="number"
              />
            </div>
            <div className="mb-2">
              <Input item={"OTP"} setValueChange={SetEndRide} type="number" />
            </div>
            <button
              type="submit"
              className="bg-theme px-4 py-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none disabled:bg-gray-400"
              disabled={formLoading}
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
