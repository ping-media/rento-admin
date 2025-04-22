import { useEffect, useState } from "react";
import { convertDateFormat } from "../../utils";

const InputDateAndTime = ({
  item,
  value = "",
  require = false,
  name,
  setValueChanger,
}) => {
  const [dateAndTime, setDateAndTime] = useState("");
  const [inputValue, setInputValue] = useState("");

  //changing the value of time
  const handleValueChange = (e) => {
    setInputValue(e.target.value);
    const databaseDate = convertDateFormat(e.target.value);
    setDateAndTime(databaseDate);
    setValueChanger && setValueChanger(databaseDate);
  };

  useEffect(() => {
    if (value) {
      const dataBaseDate = convertDateFormat(value);
      setDateAndTime(dataBaseDate);
    }
  }, [value]);

  return (
    <div className="w-full relative">
      <label
        htmlFor={name}
        className="block text-gray-800 font-semibold text-sm capitalize"
      >
        Enter {item} {require && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-2">
        <input type="hidden" name={name} value={dateAndTime} />
        <input
          type="datetime-local"
          id={name}
          className={`block w-full rounded-md px-5 py-3 ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none ${
            item != "email"
              ? item == "vehicleNumber"
                ? "uppercase"
                : "capitalize"
              : ""
          } disabled:bg-gray-400 disabled:bg-opacity-20`}
          value={inputValue}
          onChange={(e) => handleValueChange(e)}
          placeholder={`${item}`}
          required={require}
          step="3600"
        />
      </div>
    </div>
  );
};

export default InputDateAndTime;

// import { useEffect, useRef, useState } from "react";
// import { convertDateFormat } from "../../utils";
// import { tableIcons } from "../../Data/Icons";

// const InputDateAndTime = ({
//   item,
//   value = "",
//   require = false,
//   name,
//   setValueChanger,
// }) => {
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [dateAndTime, setDateAndTime] = useState("");
//   const [inputValue, setInputValue] = useState("");
//   const [showTimeDropdown, setShowTimeDropdown] = useState(false);
//   const timeInputRef = useRef();

//   // Generate 12-hour format time options (1:00 AM to 12:00 PM)
//   const hourOptions = Array.from({ length: 24 }, (_, i) => {
//     const hour = i % 12 === 0 ? 12 : i % 12;
//     const ampm = i < 12 ? "AM" : "PM";
//     return `${hour.toString().padStart(2, "0")}:00 ${ampm}`;
//   });

//   const convertTo24Hour = (time12h) => {
//     const [time, modifier] = time12h.split(" ");
//     let [hours, minutes] = time.split(":");
//     hours = parseInt(hours, 10);
//     if (modifier === "PM" && hours < 12) hours += 12;
//     if (modifier === "AM" && hours === 12) hours = 0;
//     return `${hours.toString().padStart(2, "0")}:${minutes}`;
//   };

//   const handleDateOrTimeChange = (newDate, newTime12) => {
//     if (!newDate || !newTime12) return;
//     const time24 = convertTo24Hour(newTime12);
//     const combined = `${newDate}T${time24}`;
//     setInputValue(combined);
//     const databaseDate = convertDateFormat(combined);
//     setDateAndTime(databaseDate);
//     setValueChanger && setValueChanger(databaseDate);
//   };

//   const handleDateChange = (e) => {
//     const newDate = e.target.value;
//     setDate(newDate);
//     handleDateOrTimeChange(newDate, time);
//   };

//   const handleTimeSelect = (selectedTime) => {
//     setTime(selectedTime);
//     handleDateOrTimeChange(date, selectedTime);
//     setShowTimeDropdown(false);
//   };

//   useEffect(() => {
//     if (value) {
//       const databaseDate = convertDateFormat(value);
//       setDateAndTime(databaseDate);

//       const [valDate, valTime] = value.split("T");
//       const [h, m] = valTime?.split(":") || [];
//       const hour = parseInt(h, 10);
//       const ampm = hour >= 12 ? "PM" : "AM";
//       const hour12 = hour % 12 === 0 ? 12 : hour % 12;
//       const formatted = `${hour12.toString().padStart(2, "0")}:${m} ${ampm}`;

//       setDate(valDate || "");
//       setTime(formatted);
//       setInputValue(value);
//     }
//   }, [value]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (timeInputRef.current && !timeInputRef.current.contains(e.target)) {
//         setShowTimeDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="w-full relative">
//       <label
//         htmlFor={name}
//         className="block text-gray-800 font-semibold text-sm capitalize"
//       >
//         Enter {item} {require && <span className="text-red-500">*</span>}
//       </label>
//       <div className="mt-2 flex gap-2 relative">
//         <input type="hidden" name={name} value={dateAndTime} />

//         <input
//           type="date"
//           className="block w-1/2 rounded-md px-5 py-3 ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none"
//           value={date}
//           onChange={handleDateChange}
//           required={require}
//         />

//         <div className="w-1/2 relative" ref={timeInputRef}>
//           <input
//             type="text"
//             readOnly
//             placeholder="Select Time"
//             className="block w-full rounded-md px-5 py-3 ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none cursor-pointer"
//             value={time}
//             onClick={() => setShowTimeDropdown(!showTimeDropdown)}
//           />
//           {showTimeDropdown && (
//             <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white ring-1 ring-gray-300 shadow-lg">
//               {hourOptions.map((hour) => (
//                 <li
//                   key={hour}
//                   onClick={() => handleTimeSelect(hour)}
//                   className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
//                 >
//                   {hour}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//         <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-600">
//           {tableIcons.downArrow}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InputDateAndTime;
