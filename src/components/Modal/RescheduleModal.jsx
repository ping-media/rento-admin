import { useDispatch, useSelector } from "react-redux";
import { toggleRescheduleModal } from "../../Redux/SideBarSlice/SideBarSlice";
import Spinner from "../Spinner/Spinner";
import DatePicker from "../DateTimePicker/DateTimePicker";
import { useEffect, useMemo, useState } from "react";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { parse, parseISO, format as Fromat } from "date-fns";
import { format, formatInTimeZone } from "date-fns-tz";
import { postData } from "../../Data/index";
import { updateBookingDates } from "../../Redux/VehicleSlice/VehicleSlice";

// getting current date and time in input format
const formattedDate = () => {
  const date = new Date();
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatIntoISO = (input) => {
  const parsedDate = parse(input, "dd MMM, yyyy h:mm a", new Date());
  return format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss'Z'", { timeZone: "UTC" });
};

const formatDateReadable = (dateString) => {
  const parsedDate = parseISO(dateString);
  return Fromat(parsedDate, "dd MMM, yyyy");
};

const formatTimeUTC = (timeString) => {
  const fullDateTime = `1970-01-01T${timeString}`;
  return formatInTimeZone(fullDateTime, "UTC", "hh:mm a");
};

const RescheduleModal = () => {
  const dispatch = useDispatch();
  const { isRescheduleModalActive } = useSelector((state) => state.sideBar);
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const { token } = useSelector((state) => state.user);
  const [formLoading, setFormLoading] = useState(false);
  //   data
  const [pickupDate, setPickupDate] = useState(formattedDate());
  const [dropoffDate, setDropoffDate] = useState(formattedDate());
  const [pickupTime, setPickupTime] = useState(new Date().toLocaleTimeString());
  const [dropoffTime, setDropoffTime] = useState(
    new Date().toLocaleTimeString()
  );

  //   adding booking date and time in input field
  const bookingDetails = useMemo(() => {
    if (!vehicleMaster?.[0]) return null;
    const startDate = vehicleMaster[0].BookingStartDateAndTime;
    const endDate = vehicleMaster[0].BookingEndDateAndTime;

    return {
      pickupDate: formatDateReadable(startDate?.split("T")[0]),
      pickupTime: formatTimeUTC(startDate?.split("T")[1]),
      dropoffDate: formatDateReadable(endDate?.split("T")[0]),
      dropoffTime: formatTimeUTC(endDate?.split("T")[1]),
    };
  }, [vehicleMaster]);

  useEffect(() => {
    if (bookingDetails) {
      setPickupDate(bookingDetails.pickupDate);
      setPickupTime(bookingDetails.pickupTime);
      setDropoffDate(bookingDetails.dropoffDate);
      setDropoffTime(bookingDetails.dropoffTime);
    }
  }, [bookingDetails]);

  //   updating the booking or Reschedule the booking
  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData(e.target);
    const result = Object.fromEntries(formData.entries());
    const bookingId = vehicleMaster[0]?._id;

    try {
      if (!bookingId) {
        handleAsyncError(dispatch, "Unable to update booking! try again.");
        return;
      }
      //   formData.append("_id", bookingId);
      const dbBookingStartDateAndTime = formatIntoISO(
        result?.BookingStartDateAndTime
      );
      const dbBookingEndDateAndTime = formatIntoISO(
        result?.BookingEndDateAndTime
      );

      const response = await postData(
        "/reschedule-booking",
        {
          _id: bookingId,
          BookingStartDateAndTime: dbBookingStartDateAndTime,
          BookingEndDateAndTime: dbBookingEndDateAndTime,
        },
        token
      );
      if (response?.success) {
        let data = null;
        if (response?.isStartUpdate) {
          data = {
            ...data,
            BookingStartDateAndTime: dbBookingStartDateAndTime,
          };
        }
        if (response?.isEndUpdate) {
          data = { ...data, BookingEndDateAndTime: dbBookingEndDateAndTime };
        }
        handleAsyncError(dispatch, "Reschedule Successfully", "success");
        dispatch(updateBookingDates(data));
        dispatch(toggleRescheduleModal());
      }
    } catch (error) {
      console.warn("Error while updating booking", error?.message);
      handleAsyncError(dispatch, "Unable to reschedule booking! try again");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div
      className={`fixed ${
        !isRescheduleModalActive ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-20 mx-auto shadow-xl rounded-md bg-white max-w-md">
        <div className="flex justify-between border-b p-2">
          <h2 className="text-theme font-semibold text-lg uppercase">
            Reschedule Ride
          </h2>
          <button
            onClick={() => dispatch(toggleRescheduleModal())}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            disabled={formLoading}
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

        <div className="p-6 pt-2">
          <form onSubmit={handleUpdateBooking}>
            <div className="w-full mb-3">
              <label htmlFor="pickup-time" className="text-gray-500 block mb-1">
                Pick-up Date And Time
              </label>
              <DatePicker
                value={pickupDate}
                timeValue={pickupTime}
                setValueChanger={setPickupDate}
                setTimeValueChanger={setPickupTime}
                name="BookingStartDateAndTime"
              />
            </div>
            <div className="w-full mb-5">
              <label htmlFor="pickup-time" className="text-gray-500 block mb-1">
                Drop-off Date And Time
              </label>
              <DatePicker
                value={dropoffDate}
                timeValue={dropoffTime}
                setValueChanger={setDropoffDate}
                setTimeValueChanger={setDropoffTime}
                name="BookingEndDateAndTime"
              />
            </div>
            <button
              type="submit"
              className="bg-theme px-4 py-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none disabled:bg-gray-400 w-full flex items-center justify-center outline-none"
              disabled={formLoading}
            >
              {!formLoading ? (
                "Update Booking"
              ) : (
                <Spinner message={"loading..."} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;
