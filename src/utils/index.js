import { useEffect, useState } from "react";
import { toggleClearModals } from "../Redux/SideBarSlice/SideBarSlice";
import { toggleClearVehicle } from "../Redux/AdsSlice/VehicleSlice";
import { handleAsyncError } from "./Helper/handleAsyncError";
// import CryptoJS from "crypto-js";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;
};

const formatDate = (date) => {
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat("en-CA", options);
  const parts = formatter.formatToParts(date);

  const day = parts.find((part) => part.type === "day").value;
  const month = parts.find((part) => part.type === "month").value;
  const year = parts.find((part) => part.type === "year").value;

  return `${day} ${month} ${year}`;
};

const formatTime = (date) => {
  const options = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  const timeString = new Intl.DateTimeFormat("en-CA", options).format(date);

  // Extract hour and minute parts from the formatted time string
  const [timePart, period] = timeString.split(" ");
  const [hour, minute] = timePart.split(":");

  let currentTime;
  if (hour === "12") {
    currentTime = `12:${minute} ${period}`;
  } else {
    currentTime = `${hour < 10 ? "0" + hour : hour}:${minute} ${period}`;
  }

  return currentTime;
};

const generateGeoHash = (latitude, longitude) => {
  const geohash = geohashForLocation([latitude, longitude]);
  return geohash;
};

const formatDateLikeApp = (inputDate) => {
  // Create a new Date object from the input string
  const date = new Date(inputDate);

  // Extract the day, month, and year
  const day = date.getUTCDate();
  const month = date.toLocaleString("default", { month: "short" }); // Get the short month name
  const year = date.getUTCFullYear();

  // Format and return the new date string
  return `${day} ${month}., ${year}`;
};

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

// json web token function
// const encodeUserData = (data) => {
//   // Options can include expiration, algorithm, etc.
//   try {
//     return CryptoJS.AES.encrypt(
//       data,
//       import.meta.env.VITE_SECRET_KEY
//     ).toString();
//   } catch (error) {
//     return { message: error.message, type: "error" };
//   }
// };

// const decodeUserData = (token) => {
//   try {
//     const data = CryptoJS.AES.decrypt(token, import.meta.env.VITE_SECRET_KEY);
//     return data.toString(CryptoJS.enc.Utf8);
//   } catch (error) {
//     return {
//       message: `Token is invalid or expired:${error.message}`,
//       type: "error",
//     };
//   }
// };

const isValidEmail = (email) => {
  // Regular expression for validating an email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// signout User
const handleSignOutUser = (dispatch) => {
  dispatch(toggleClearModals());
  dispatch(toggleClearAds());
  handleAsyncError(dispatch, "signout successfull.", "success");
};

export {
  formatTimestamp,
  formatDate,
  formatTime,
  generateGeoHash,
  formatDateLikeApp,
  useIsMobile,
  timeStampUserFormated,
  handleKeyDown,
  handleSignOutUser,
  isValidEmail,
  // encodeUserData,
  // decodeUserData,
};
