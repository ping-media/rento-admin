import React, { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { formatDate } from "../../utils/index";

const DatePicker = ({
  value,
  name,
  setValueChanger,
  isLabel = true,
  title,
}) => {
  const datePickerRef = useRef(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");

  const handleDateSelect = (date) => {
    setValueChanger(date);
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
        spaceBelow < 300 && spaceAbove > spaceBelow ? "top" : "bottom"
      );
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    if (calendarVisible) checkDropdownPosition();
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarVisible]);

  return (
    <div className="relative" ref={datePickerRef}>
      {isLabel && (
        <label
          htmlFor={item}
          className="block text-gray-800 font-semibold text-sm capitalize text-left"
        >
          {`Enter ${title || camelCaseToSpaceSeparated(item)}`}{" "}
          {require && <span className="text-red-500">*</span>}
        </label>
      )}
      <button
        type="button"
        className="flex items-center justify-between border-2 px-1.5 py-2.5 focus:border-theme rounded-lg relative w-full"
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
            placeholder="Select date"
            value={value ? formatDate(new Date(value)) : ""}
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
          className={`absolute bg-white shadow-md rounded-md mt-1 z-30 lg:z-10 border border-gray-300 w-full lg:w-96 p-2 ${
            dropdownPosition === "top" ? "bottom-full mb-2" : "top-full"
          }`}
        >
          <DayPicker
            selected={value ? new Date(value) : undefined}
            onSelect={handleDateSelect}
            mode="single"
            modifiersClassNames={{
              selected: "bg-theme text-white rounded-full",
              today: "text-red-500",
              disabled: "text-gray-400",
            }}
            className="w-full overflow-hidden"
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
