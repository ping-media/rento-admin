import React, { useEffect, useState } from "react";
import DatePicker from "./DateTimePicker";
import { parse } from "date-fns";
import { format } from "date-fns-tz";
import { formatDate, formatTimeWithoutSeconds } from "../../utils/index";

// getting current date and time in input format
const formattedDate = (addDays = 0) => {
  const date = new Date();

  if (Number.isFinite(addDays) && addDays > 0) {
    date.setDate(date.getDate() + addDays);
  }

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

export const DateRange = ({
  pickupLabel = "Pick-up Date And Time",
  pickupName = "BookingStartDateAndTime",
  dropoffLabel = "Drop-off Date And Time",
  dropoffName = "BookingEndDateAndTime",
  className,
  error,
  setBookingStartDate,
  setBookingEndDate,
  duration = 1,
}) => {
  //   data
  const [pickupDate, setPickupDate] = useState(formattedDate());
  const [dropoffDate, setDropoffDate] = useState(formattedDate(duration));
  const [pickupTime, setPickupTime] = useState(new Date().toLocaleTimeString());
  const [dropoffTime, setDropoffTime] = useState(
    new Date().toLocaleTimeString(),
  );

  // Update dropoff date when duration changes
  useEffect(() => {
    setDropoffDate(formattedDate(duration));
  }, [duration]);

  //   updating the parent state with prefill values
  useEffect(() => {
    if (!setBookingStartDate || !setBookingEndDate) return;

    const combinedPickupDateTime = `${formatDate(pickupDate)} ${formatTimeWithoutSeconds(pickupTime)}`;

    const combinedDropoffDateTime = `${formatDate(dropoffDate)} ${formatTimeWithoutSeconds(dropoffTime)}`;

    setBookingStartDate(formatIntoISO(combinedPickupDateTime));
    setBookingEndDate(formatIntoISO(combinedDropoffDateTime));
  }, [
    pickupDate,
    pickupTime,
    dropoffDate,
    dropoffTime,
    setBookingStartDate,
    setBookingEndDate,
  ]);

  return (
    <>
      <div className={`w-full ${className}`}>
        <label htmlFor="pickup-time" className="text-gray-500 block mb-1">
          {pickupLabel}
        </label>
        <DatePicker
          value={pickupDate}
          timeValue={pickupTime}
          setValueChanger={setPickupDate}
          setTimeValueChanger={setPickupTime}
          setISOValue={setBookingStartDate}
          name={pickupName}
        />

        <p
          className={`italic text-sm ${
            error ? "text-theme" : "text-gray-400"
          } my-1`}
        >
          {error}
        </p>
      </div>
      <div className={`w-full ${className}`}>
        <label htmlFor="pickup-time" className="text-gray-500 block mb-1">
          {dropoffLabel}
        </label>
        <DatePicker
          value={dropoffDate}
          timeValue={dropoffTime}
          setValueChanger={setDropoffDate}
          setTimeValueChanger={setDropoffTime}
          setISOValue={setBookingEndDate}
          name={dropoffName}
        />

        <p
          className={`italic text-sm ${
            error ? "text-theme" : "text-gray-400"
          } my-1`}
        >
          {error}
        </p>
      </div>
    </>
  );
};
