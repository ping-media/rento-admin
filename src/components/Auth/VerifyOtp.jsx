import { useEffect, useRef, useState } from "react";
import webLogo from "../../assets/logo/logo.png";
import { useNavigate } from "react-router-dom";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../../Redux/currentUserSlice/CurrentUserSlice";
import handleSendOtp from "../../utils/sendOtp/sendotp";
import { handleCreateNewUser } from "../../utils/data";
import handleCheckUser from "../../utils/data/handleCheckUser";
i//mport Spinner from "../Spinner/Spinner";
// import { encodeUserData } from "../../utils";

const VerifyOtp = ({
  otp,
  phone,
  data,
  length,
  isTimerActive,
  seconds,
  setSecondChanger,
  setTimerActive,
}) => {
  const [otpInput, setOtpInput] = useState(new Array(length).fill(""));
  const [onOtpSubmit, setOnOtpSubmit] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    const newOtp = [...otpInput];
    // allow only one input
    newOtp[index] = value.substring(value.length - 1);
    setOtpInput(newOtp);
    //submit trigger
    const combinedOtp = newOtp.join("");
    // console.log(combinedOtp);
    if (combinedOtp.length == length) setOnOtpSubmit(combinedOtp);

    // move to next input if current field is filled
    if (value && index < length - 1 && inputRef.current[index + 1]) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleClick = (index) => {
    inputRef.current[index].setSelectionRange(1, 1);
  };
  //   move focus to previous input if current field is empty
  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otpInput[index] &&
      index > 0 &&
      inputRef.current[index - 1]
    ) {
      // Move focus to the previous input field on backspace
      inputRef.current[index - 1].focus();
    }
  };

  // autofill otp only for dev mode
  const handleOtpDev = () => {
    if (otp) {
      const pastedData = otp.toString().slice(0, 6);
      const newOtp = [...otpInput];
      for (let i = 0; i < 6 && i < 6; i++) {
        newOtp[i] = pastedData[i];
        if (inputRef.current[i]) {
          inputRef.current[i].focus();
        }
      }
      setOtpInput(newOtp);
      setOnOtpSubmit(otp);
    }
  };

  useEffect(() => {
    //move focus to the first input
    if (inputRef.current[0]) {
      inputRef.current[0].focus();
    }
    //for sending otp to phone number
    const sendOtpToNumber = async () => {
      const isOtpSend = await handleSendOtp(otp, phone);
      if (isOtpSend?.type == "error") {
        handleAsyncError(dispatch, isOtpSend?.message);
      }
    };
    // autofill otp only for dev mode
    handleOtpDev();
    // active this for production
    // sendOtpToNumber();
  }, []);

  useEffect(() => {
    //setting interval between another otp request
    let interval = null;
    if (isTimerActive && seconds > 0) {
      interval = setInterval(() => {
        setSecondChanger((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, seconds]);

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (otp) {
      //here we are joining the user entered otp to match with generated password
      if (otp == onOtpSubmit) {
        // create new user after verify otp
        let checkUser = null;
        if (Object.keys(data).length === 0) {
          const newUser = await handleCreateNewUser(phone);
          if (newUser.type == "success") {
            checkUser = await handleCheckUser(phone);
            dispatch(
              signInSuccess({
                id: checkUser?.data?.UserId,
                phone: checkUser?.data?.UserPhoneNumber,
                userName: checkUser?.data?.UserName,
                userAddress: checkUser?.data?.UserAddress,
                addressLat: checkUser?.data?.AddressLat,
                addressLng: checkUser?.data?.AddressLng,
                userProfileImage: checkUser?.data?.UserProfileImageUri,
                isbusinessPartner: checkUser?.data?.businessPartner
                  ? true
                  : false,
              })
            );
          }
        } else {
          dispatch(signInSuccess(data));
        }
        handleAsyncError(dispatch, "login successfully..", "success");
        setLoading(false);
        // if it is new user than send on profile otherwise on ads page
        navigate("/my-ads");
      }
    } else {
      handleAsyncError(dispatch, "Wrong OTP! Try Again..");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="w-[95%] mx-auto lg:w-full">
        <div className="flex flex-col items-center justify-center lg:hidden mb-5">
          <img
            src={webLogo}
            className="w-32 mx-auto mb-5 drop-shadow-2xl"
            alt="LOGO"
          />
        </div>
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-100 lg:text-black">
          Enter OTP
        </h1>
        <p className="text-gray-200 lg:text-gray-600 text-center mb-4">
          Code sent to +91-({phone}){/* Code sent to +91-() */}
        </p>
        <div className="flex items-center justify-around gap-2 lg:gap-4 mx-auto mt-2 mb-4">
          {otpInput.map((value, index) => (
            <input
              key={index}
              type="text"
              value={value}
              ref={(input) => (inputRef.current[index] = input)}
              onChange={(e) => handleChange(index, e)}
              onClick={() => handleClick(index)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="rounded-lg border border-gray-300 cursor-text w-10 lg:w-14 aspect-square flex items-center justify-center focus:outline-theme-blue text-center"
              maxLength={1}
            />
          ))}
        </div>
        <div className="flex items-center flex-col justify-between mb-5">
          <p className="lg:text-gray-600 text-sm text-gray-200">
            Didn't receive code?
          </p>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-2 text-sm font-medium text-center rounded text-gray-100 lg:text-gray-500 hover:text-blue-500 disabled:text-gray-300"
              onClick={() => sendOtpToNumber()}
              disabled={isTimerActive}
            >
              {seconds == 0
                ? "Request Again"
                : `Request Again (00:00:${seconds})`}
            </button>
          </div>
        </div>
        <button
          className="w-full px-4 py-2 text-lg font-medium text-white bg-theme-blue-light lg:bg-theme-blue rounded-md hover:bg-blue-500 transition duration-200 ease-in-out outline-none disabled:bg-gray-500"
          type="submit"
          disabled={loading}
        >
          {/* {loading ? <Spinner message={"loading.."} /> : "Verify"} */}
        </button>
      </div>
    </form>
  );
};

export default VerifyOtp;
