import React, { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { formatDate, formatTimeWithoutSeconds } from "../../utils/index";
import { parse } from "date-fns";
import { format } from "date-fns-tz";

const formatIntoISO = (input) => {
  const parsedDate = parse(input, "dd MMM, yyyy h:mm a", new Date());
  return format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss'Z'", { timeZone: "UTC" });
};

const DatePicker = ({
  value,
  name,
  setValueChanger,
  timeValue,
  setTimeValueChanger,
  setISOValue,
}) => {
  const datePickerRef = useRef(null);
  const timePickerRef = useRef(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");

  const availableTimes = [];
  for (let hour = 0; hour < 24; hour++) {
    const period = hour < 12 ? "AM" : "PM";
    const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
    const hourString = adjustedHour;
    const minuteString = "00";
    const timeString = `${hourString}:${minuteString} ${period}`;
    availableTimes.push(timeString);
  }

  const handleDateSelect = (date) => {
    if (!date) return;
    setValueChanger(date);

    if (setISOValue) {
      const combinedDateTime = `${formatDate(date)} ${formatTimeWithoutSeconds(timeValue)}`;
      const isoValue = formatIntoISO(combinedDateTime);
      setISOValue(isoValue);
    }
  };

  const handleTimeSelect = (time) => {
    setTimeValueChanger(time);

    if (setISOValue) {
      const combinedDateTime = `${formatDate(new Date(value))} ${formatTimeWithoutSeconds(time)}`;
      const isoValue = formatIntoISO(combinedDateTime);
      setISOValue(isoValue);
    }

    setCalendarVisible(false);
  };

  const handleClickOutside = (event) => {
    if (
      datePickerRef.current &&
      !datePickerRef.current.contains(event.target)
    ) {
      setCalendarVisible(false);
    }
  };

  const checkDropdownPosition = () => {
    if (datePickerRef.current) {
      const rect = datePickerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setDropdownPosition(
        spaceBelow < 350 && spaceAbove > 350 ? "top" : "bottom",
      );
      // setDropdownPosition(
      //   spaceBelow < 300 && spaceAbove > spaceBelow ? "top" : "bottom",
      // );
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    if (calendarVisible) checkDropdownPosition();
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarVisible]);

  useEffect(() => {
    if (calendarVisible && timePickerRef.current) {
      const activeButton = timePickerRef.current.querySelector(".active");
      if (activeButton) {
        timePickerRef.current.scrollTop =
          activeButton.offsetTop - timePickerRef.current.offsetTop;
      }
    }
  }, [calendarVisible, timeValue]);

  return (
    <div className="relative" ref={datePickerRef}>
      <button
        type="button"
        className="flex items-center justify-between px-5 py-3 ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none rounded-lg relative w-full"
        onClick={() => setCalendarVisible(!calendarVisible)}
      >
        <div className="w-full flex items-center justify-between gap-0.5">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>
          </span>
          <input
            type="text"
            className="outline-none w-full cursor-pointer"
            placeholder="Select date & time"
            value={`${formatDate(new Date(value))} ${formatTimeWithoutSeconds(
              timeValue,
            )}`}
            name={name}
            readOnly
          />
        </div>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-5 h-5 ${calendarVisible && "rotate-180"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      {calendarVisible && (
        <div
          className={`absolute bg-white shadow-md rounded-md mt-1 z-50 border border-gray-300 w-full lg:w-[28rem] p-2 flex ${
            dropdownPosition === "top" ? "bottom-full mb-2" : "top-full"
          }`}
        >
          {/* Calendar */}
          <div className="w-2/3 border-r pr-1">
            <DayPicker
              selected={new Date(value)}
              onSelect={handleDateSelect}
              // disabled={{ before: new Date(value) }}
              mode="single"
              modifiersClassNames={{
                selected: "bg-theme text-white rounded-full",
                today: "text-red-500",
                disabled: "text-gray-400",
              }}
              className="w-full overflow-hidden"
            />
          </div>

          {/* Time Picker */}
          <div className="w-1/3 pl-1">
            <div className="text-center font-semibold">Time</div>
            <div ref={timePickerRef} className="overflow-y-auto max-h-48">
              {availableTimes.map((time, index) => (
                <button
                  key={index}
                  type="button"
                  className={`block w-full text-left p-2 rounded-md disabled:text-gray-400 ${
                    time === formatTimeWithoutSeconds(timeValue)
                      ? "bg-red-500 text-white active"
                      : "hover:bg-red-100"
                  }`}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
