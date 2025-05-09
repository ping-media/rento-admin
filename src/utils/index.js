import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import {
  toggleClearModals,
  toggleDeleteModal,
} from "../Redux/SideBarSlice/SideBarSlice";
import { toggleClearVehicle } from "../Redux/VehicleSlice/VehicleSlice.js";
import { handleAsyncError } from "./Helper/handleAsyncError";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    // this function help us to hide the sidebar when user change the page in mobile view but not in large display
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};

const timeStampUserFormated = (timestamp) => {
  // Split the timestamp into its components
  const parts = timestamp.split("_");

  // Extract year, month, day, hour, minute, and second
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Months are 0-based in JS
  const day = parseInt(parts[2], 10);
  const hour = parseInt(parts[3], 10);
  const minute = parseInt(parts[4], 10);
  const second = parseInt(parts[5], 10);

  // Create a Date object
  const date = new Date(year, month, day, hour, minute, second);

  // Format the date and time as desired
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  return date.toLocaleString("en-US", options);
};

//for stoping increasse and decrease in input type number
const handleKeyDown = (event) => {
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
  }
};

const isValidEmail = (email) => {
  // Regular expression for validating an email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const handleDelete = (dispatch, id) => {
  dispatch(toggleDeleteModal());
};

const formatDate = (dateString) => {
  // Parse the date string into a Date object
  const date = new Date(dateString);

  // Get the day, month, and year
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  // Return the formatted string
  return `${day} ${month}, ${year}`;
};

const formatPathNameToTitle = (str) => {
  return str
    .replace(/^\/+/, "") // Remove leading slash if present
    .replace(/\/.*$/, "") // Remove everything after the first slash, including the slash
    .replace(/-/g, " ") // Replace hyphens with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
};

// signout User
const handleSignOutUser = (dispatch) => {
  dispatch(toggleClearModals());
  dispatch(toggleClearVehicle());
  handleAsyncError(dispatch, "signout successfull.", "success");
};

const encryptData = (data) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    import.meta.env.VITE_SECRET_KEY
  ).toString();
};

const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(
    encryptedData,
    import.meta.env.VITE_SECRET_KEY
  );
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
};

const handlePreviousPage = (navigate) => {
  return navigate(-1);
};

const removeAfterSecondSlash = (url) => {
  // Find the position of the second slash
  const secondSlashIndex = url.indexOf("/", url.indexOf("/") + 1);

  // If there is a second slash, return the URL up to the second slash
  if (secondSlashIndex !== -1) {
    return url.slice(0, secondSlashIndex);
  }

  // If there's no second slash, return the original URL
  return url;
};

const modifyUrl = (url) => {
  // Find the index of the first slash
  const firstSlashIndex = url.indexOf("/");

  // Find the index of the second slash
  const secondSlashIndex = url.indexOf("/", firstSlashIndex + 1);

  // If the second slash is found, slice the URL to keep everything up to and including the second slash
  if (firstSlashIndex !== -1 && secondSlashIndex !== -1) {
    // Keep everything from after the first slash up to and including the second slash
    const result = url.slice(firstSlashIndex + 1, secondSlashIndex + 1);
    return result;
  }

  // If there is no second slash, return the original URL with a slash at the end
  return url.endsWith("/") ? url : url + "/";
};

const formatFullDateAndTime = (dateString) => {
  const date = new Date(dateString);

  // Format the date using Intl.DateTimeFormat with short month format
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC", // Ensure IST time zone
  });

  return formatter.format(date);
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-In", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

const camelCaseToSpaceSeparated = (str) => {
  if (typeof str === "string") return str.replace(/([a-z])([A-Z])/g, "$1 $2");
};

const camelCaseToSpaceSeparatedMapped = (str) => {
  return str?.map((key) => {
    if (typeof key === "string") return key.replace(/([a-z])([A-Z])/g, "$1 $2");
  });
};

const convertDateFormat = (dateStr) => {
  // Check if the input date is in the format "yyyy-MM-ddTHH:mm"
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateStr)) {
    // Parse the input date string to a Date object
    const date = new Date(dateStr);
    // Add IST offset (5 hours and 30 minutes)
    const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
    // Format IST date as "yyyy-MM-ddTHH:mm:ssZ"
    const istString = istDate.toISOString().slice(0, 19) + "Z";
    return istString;
  }
  // Check if the input date is in the format "yyyy-MM-ddTHH:mm:ssZ" (UTC)
  else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(dateStr)) {
    // Parse the UTC date string
    const date = new Date(dateStr);
    // Add IST offset (5 hours and 30 minutes)
    const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
    const year = istDate.getFullYear();
    const month = String(istDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(istDate.getDate()).padStart(2, "0");
    const hour = String(istDate.getHours()).padStart(2, "0");
    const minute = String(istDate.getMinutes()).padStart(2, "0");

    // Format as "yyyy-MM-ddTHH:mm"
    return `${year}-${month}-${day}T${hour}:${minute}`;
  } else {
    throw new Error("Invalid date format");
  }
};

const calculateTax = (amount, taxPercentage) => {
  // Ensure the inputs are valid numbers
  if (isNaN(amount) || isNaN(taxPercentage)) {
    return "Invalid input";
  }

  // Calculate the tax based on the given percentage
  const taxAmount = (taxPercentage / 100) * amount;

  // Round the result to 2 decimal places and return it
  return parseInt(taxAmount);
};

const formatDateForInvoice = (dateString) => {
  // Create a Date object from the string
  const date = new Date(dateString);

  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if necessary
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, so add 1
  const year = date.getFullYear();

  // Return the formatted date in "DD/MM/YYYY" format
  return `${day}/${month}/${year}`;
};

const formatTimeStampToDate = (timestamp) => {
  // Convert to milliseconds
  const date = new Date(timestamp * 1000);

  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, "0"); // Adding leading zero
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = String(date.getFullYear()).slice(-2); // Get the last two digits of the year

  // Extract hours, minutes, and seconds
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Determine AM/PM and convert to 12-hour format
  const amPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 0 to 12 for midnight

  // Format the date and time
  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${String(hours).padStart(2, "0")}:${minutes} ${amPm}`;

  // Combine date and time
  const formattedDateTime = `${formattedDate} ${formattedTime}`;

  return formattedDateTime;
};

const getDurationBetweenDates = (startDate, endDate) => {
  // Parse the dates
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate the difference in milliseconds
  const diffInMs = Math.abs(end - start);

  // Convert milliseconds to days, hours, minutes, and seconds
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

  // Return the duration as an object
  return { days, hours, minutes, seconds };
};

const formatReadableDateTime = (dateString) => {
  const date = new Date(dateString);

  // Get the day, month, year, hour, and minutes
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  // Format the month name
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getUTCMonth()];

  // Format hours to 12-hour clock and determine AM/PM
  const formattedHours = hours % 12 || 12; // Convert 0 to 12
  const period = hours >= 12 ? "PM" : "AM";

  // Format minutes with leading zero
  const formattedMinutes = minutes.toString().padStart(2, "0");

  // Construct the formatted string
  return `${day} ${month} ${year} At ${formattedHours}:${formattedMinutes} ${period}`;
};

const getDurationInDays = (date1Str, date2Str) => {
  // Parse the input strings into Date objects
  const date1 = new Date(date1Str);
  const date2 = new Date(date2Str);

  // Check if the dates are valid
  if (isNaN(date1) || isNaN(date2)) {
    return "Invalid date format";
  }

  // Get the difference between the two dates in milliseconds
  const differenceInMs = Math.abs(date2 - date1);

  // Convert milliseconds to days
  const days = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  return days;
};

const formatDateTimeISTForUser = (input) => {
  const date = new Date(input);

  // Convert to IST
  const IST_OFFSET = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istDate = new Date(date.getTime() + IST_OFFSET);

  const year = istDate.getUTCFullYear();
  const month = istDate.toLocaleString("en-US", { month: "short" }); // Get short month name
  const day = istDate.getUTCDate().toString().padStart(2, "0");

  const hours = istDate.getUTCHours();
  const minutes = istDate.getUTCMinutes();
  const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };

  // Format the time as per IST
  const formattedTime = new Date(
    Date.UTC(year, istDate.getUTCMonth(), day, hours, minutes)
  )
    .toLocaleTimeString("en-US", {
      ...timeOptions,
      timeZone: "UTC", // Explicitly use IST offset calculated
    })
    .toUpperCase();

  return `${month} ${day} ${year} : ${formattedTime}`;
};

const changeNumberIntoTime = (hour) => {
  // Validate input
  if (hour < 0 || hour > 23 || isNaN(hour)) {
    throw new Error("Invalid hour. Please provide a number between 0 and 23.");
  }

  // Determine AM or PM
  const period = hour >= 12 ? "PM" : "AM";

  // Convert hour to 12-hour format
  const formattedHour = hour % 12 || 12; // 0 becomes 12 in 12-hour format

  // Return the formatted time
  return `${formattedHour.toString().padStart(2, "0")}:00 ${period}`;
};

const formatHourToTime = (hour) => {
  // Ensure hour is between 0 and 23
  if (hour < 0 || hour > 23 || isNaN(hour)) {
    throw new Error("Invalid hour. Please provide a number between 0 and 23.");
  }
  const formattedHour = hour.toString().padStart(2, "0"); // Ensure 2 digits
  return `${formattedHour}:00`; // Append ":00" for minutes
};

const formatLocalTimeIntoISO = (dateStr) => {
  const utcDateStr = dateStr + "Z";
  const originalDate = new Date(utcDateStr);
  const formattedDateStr = originalDate?.toISOString().replace(".000", "");
  return formattedDateStr;
};

const formatDateToISO = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Format as "YYYY-MM-DDTHH:mm:ssZ"
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
};

const formatDateToISOWithoutSecond = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  // const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:00Z`;
};

const addDaysToDate = (dateString, days) => {
  const date = new Date(dateString);
  if (isNaN(date)) {
    throw new Error(
      "Invalid date format. Please use a valid ISO 8601 date string."
    );
  }
  // Add the specified number of days to the date's timestamp
  const updatedDate = new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  // Return the updated date in UTC ISO 8601 format
  return updatedDate.toISOString().replace(".000Z", "Z");
};

const calculatePriceForExtendBooking = (
  perDayCost,
  extensionDays,
  extraAddonPrice = 0
) => {
  const bookingPrice = Number(perDayCost) * Number(extensionDays);
  const AddonPrice = Number(extraAddonPrice);
  const newAddOnPrice = AddonPrice;
  const newBookingPrice = bookingPrice + newAddOnPrice;
  const tax = calculateTax(newBookingPrice, 18);
  const extendAmount = Number(newBookingPrice) + Number(tax);
  return extendAmount;
};

const addOneMinute = (dateTimeString) => {
  // Parse the input date-time string into a Date object
  const date = new Date(dateTimeString);

  // Add 1 minute (60,000 milliseconds) to the date
  date.setTime(date.getTime() + 60 * 1000);

  // Return the updated date in ISO 8601 format without milliseconds
  return date.toISOString().split(".")[0] + "Z";
};

function timelineFormatDate(input) {
  // Parse the input date string into a Date object
  const date = new Date(input);

  // Array of month names for formatting
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extract the required components
  const day = date.getDate(); // Get the day of the month
  const month = months[date.getMonth()]; // Get the month name
  const year = date.getFullYear(); // Get the year

  // Format the hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const amPm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  // Construct the final formatted string
  return `${day}, ${month} ${year}, ${hours}:${minutes} ${amPm}`;
}

// const isDuration24Hours = (startDate, endDate) => {
//   // Parse the dates
//   const start = new Date(startDate);
//   const end = new Date(endDate);

//   // Calculate the difference in milliseconds
//   const durationInMilliseconds = end - start;

//   // Convert milliseconds to hours
//   const durationInHours = durationInMilliseconds / (1000 * 60 * 60);

//   // Check if the duration is exactly 24 hours
//   return durationInHours === 24;
// };
const isDuration24Hours = (startDate, endDate) => {
  return (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60) >= 24;
};

const getDurationInDaysAndHours = (date1Str, date2Str) => {
  // Parse the input strings into Date objects
  const date1 = new Date(date1Str);
  const date2 = new Date(date2Str);

  // Check if the dates are valid
  if (isNaN(date1) || isNaN(date2)) {
    return "Invalid date format";
  }

  // Get the difference between the two dates in milliseconds
  const differenceInMs = Math.abs(date2 - date1);

  // Convert milliseconds to days and hours
  const totalHours = Math.floor(differenceInMs / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24; // Remaining hours after full days

  return { days, hours };
};

const removeSecondsFromDateAndTime = (dateStr) => {
  // Convert input to a Date object
  let date = new Date(dateStr);

  // Handle invalid date parsing
  if (isNaN(date.getTime())) {
    // Try manually parsing the date in case of incorrect formats
    const parts = dateStr.split(/[\s/:,-]+/); // Split using multiple delimiters
    if (parts.length >= 5) {
      const [month, day, year, hour, minute] = parts.map(Number);
      date = new Date(year, month - 1, day, hour, minute);
    }
  }

  // If still invalid, return an error message
  if (isNaN(date.getTime())) return "Invalid Date Format";

  // Format the date in 12-hour format
  return date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour12: true, // Ensures 12-hour format
  });
};

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getFullYearMonthOptions = () => {
  const year = new Date().getFullYear();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return monthNames.map((month) => `${month} ${year}`);
};

const calculateTotalAddOnPrice = (addOns, days) => {
  return addOns.reduce((total, item) => {
    const multiplied = item.amount * days;

    const finalAmount =
      item.maxAmount > 0 && multiplied > item.maxAmount
        ? item.maxAmount
        : multiplied;

    return total + finalAmount;
  }, 0);
};

const formatMilliseconds = (ms) => {
  return new Date(ms).toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export {
  formatDate,
  useIsMobile,
  timeStampUserFormated,
  handleKeyDown,
  handleSignOutUser,
  isValidEmail,
  handleDelete,
  encryptData,
  decryptData,
  formatPathNameToTitle,
  handlePreviousPage,
  removeAfterSecondSlash,
  modifyUrl,
  formatFullDateAndTime,
  formatPrice,
  camelCaseToSpaceSeparated,
  convertDateFormat,
  calculateTax,
  formatDateForInvoice,
  formatTimeStampToDate,
  camelCaseToSpaceSeparatedMapped,
  getDurationBetweenDates,
  formatReadableDateTime,
  getDurationInDays,
  formatDateTimeISTForUser,
  changeNumberIntoTime,
  formatHourToTime,
  formatLocalTimeIntoISO,
  formatDateToISO,
  addDaysToDate,
  calculatePriceForExtendBooking,
  addOneMinute,
  timelineFormatDate,
  isDuration24Hours,
  getDurationInDaysAndHours,
  removeSecondsFromDateAndTime,
  getRandomNumber,
  formatDateToISOWithoutSecond,
  getFullYearMonthOptions,
  calculateTotalAddOnPrice,
  formatMilliseconds,
};
