import React, { useEffect, useState, useRef } from "react";
import DatePicker from "./DateTimePicker";
import { isValid, parse } from "date-fns";
import { format } from "date-fns-tz";
import { formatDate } from "../../utils/index";

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
  const normalized = input.replace(/\bSept\b/g, "Sep");
  const parsedDate = parse(normalized, "dd MMM, yyyy h:mm a", new Date());
  if (!isValid(parsedDate)) {
    throw new Error(`Invalid date: ${input}`);
  }
  return format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss'Z'", { timeZone: "UTC" });
};

const formatTimeWithoutSeconds = (timeStr) => {
  const [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  // Convert to 24-hour format
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  // Round up to next 30-minute slot
  if (minutes > 0 && minutes <= 30) {
    minutes = 30;
  } else if (minutes > 30) {
    hours = (hours + 1) % 24;
    minutes = 0;
  }

  // Convert back to 12-hour format
  let formattedHour = hours % 12;
  formattedHour = formattedHour === 0 ? 12 : formattedHour;
  const formattedMinutes = minutes === 0 ? "00" : "30";
  const formattedPeriod = hours >= 12 ? "PM" : "AM";

  return `${formattedHour}:${formattedMinutes} ${formattedPeriod}`;
};

const normalizeSept = (str) => str.replace(/\bSept\b/g, "Sep");

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
  const prevPickupRef = useRef({ date: pickupDate, time: pickupTime });

  // Update dropoff date when duration changes
  // Update dropoff date when duration changes — based on pickup date, not today
  useEffect(() => {
    const formattedPickup = normalizeSept(
      `${formatDate(pickupDate)} ${formatTimeWithoutSeconds(pickupTime)}`,
    );
    const pickupParsed = parse(
      formattedPickup,
      "dd MMM, yyyy h:mm a",
      new Date(),
    );

    if (!isNaN(pickupParsed)) {
      const newDropoff = new Date(pickupParsed);
      newDropoff.setDate(newDropoff.getDate() + Number(duration));

      setDropoffDate(
        newDropoff.toLocaleDateString("en-US", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      );

      // Keep same time as pickup
      const newHours = newDropoff.getHours();
      const newMinutes = newDropoff.getMinutes();
      const period = newHours >= 12 ? "PM" : "AM";
      const h12 = newHours % 12 === 0 ? 12 : newHours % 12;
      const mm = newMinutes === 0 ? "00" : "30";
      setDropoffTime(`${h12}:${mm} ${period}`);
    }
  }, [duration]);

  // Sync dropoff when pickup changes (maintain duration gap)
  useEffect(() => {
    const prev = prevPickupRef.current;
    const dateChanged = prev.date !== pickupDate;
    const timeChanged = prev.time !== pickupTime;

    if (dateChanged || timeChanged) {
      // Parse current pickup into a Date object
      const formattedPickup = normalizeSept(
        `${formatDate(pickupDate)} ${formatTimeWithoutSeconds(pickupTime)}`,
      );
      const pickupParsed = parse(
        formattedPickup,
        "dd MMM, yyyy h:mm a",
        new Date(),
      );

      if (!isNaN(pickupParsed)) {
        // Add duration days to get new dropoff
        const newDropoff = new Date(pickupParsed);
        newDropoff.setDate(newDropoff.getDate() + Number(duration));

        // Sync dropoff date string
        setDropoffDate(
          newDropoff.toLocaleDateString("en-US", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        );

        // Sync dropoff time string (same time as pickup)
        const newHours = newDropoff.getHours();
        const newMinutes = newDropoff.getMinutes();
        const period = newHours >= 12 ? "PM" : "AM";
        const h12 = newHours % 12 === 0 ? 12 : newHours % 12;
        const mm = newMinutes === 0 ? "00" : "30";
        setDropoffTime(`${h12}:${mm} ${period}`);
      }

      prevPickupRef.current = { date: pickupDate, time: pickupTime };
    }
  }, [pickupDate, pickupTime]);

  // Update parent state
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
          setDropTimeValueChanger={setDropoffTime}
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
