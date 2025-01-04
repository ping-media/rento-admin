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
    month: "short", // Use short month format
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Use 12-hour format
    timeZone: "UTC", // Ensure UTC time zone
  });

  return formatter.format(date);
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
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
    // Convert "2024-12-20T17:00" to "2025-01-22T14:00:00Z"
    const date = new Date(dateStr); // Parse to Date object
    const utcString = date.toISOString(); // Convert to UTC ISO string

    // Return the UTC formatted string
    return utcString.slice(0, 19) + "Z"; // Remove milliseconds and add Z for UTC
  }
  // Check if the input date is in the format "yyyy-MM-ddTHH:mm:ssZ"
  else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(dateStr)) {
    // Convert "2025-01-22T14:00:00Z" to "2024-12-20T17:00"
    const date = new Date(dateStr); // Parse to Date object
    const localString = date.toLocaleString("en-GB", {
      timeZone: "UTC",
      hour12: false,
    });

    // Format and return as "yyyy-MM-ddTHH:mm"
    const [day, month, year, hour, minute] = localString.split(/[\s,\/:]/);
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
  return parseInt(taxAmount); // This will return a string, but it ensures two decimal places
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
  const formattedTime = `${String(hours).padStart(
    2,
    "0"
  )}:${minutes}:${seconds} ${amPm}`;

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
};
