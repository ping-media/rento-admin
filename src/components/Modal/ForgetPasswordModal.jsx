import { useDispatch, useSelector } from "react-redux";
import { toggleForgetPasswordModal } from "../../Redux/SideBarSlice/SideBarSlice";
import { useState } from "react";
import { handleSendOtp, postData } from "../../Data/index";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import Input from "../../components/InputAndDropdown/Input";
import Spinner from "../../components/Spinner/Spinner";
import { isValidEmail } from "../../utils/index";

const ForgetPasswordModal = ({ userType = "", email = "" }) => {
  const dispatch = useDispatch();
  const { isForgetModalActive } = useSelector((state) => state.sideBar);
  const [formLoading, setFormLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [emailInput, setEmailInput] = useState(email);
  const { token } = useSelector((state) => state.user);

  // apply vehicle for Maintenance
  const handleChangeVehicle = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("userType", userType);
    try {
      setFormLoading(true);
      const response = await postData("/forgetPassword", formData, token);
      if (response?.status === 200) {
        dispatch(toggleForgetPasswordModal());
        return handleAsyncError(dispatch, response?.message, "success");
      } else {
        return handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setFormLoading(false);
    }
  };

  //   for sending the otp
  const handleSendEmailOtp = async () => {
    if (emailInput && emailInput === "")
      return handleAsyncError(dispatch, "email should not empty");
    const data = {
      email: emailInput,
    };
    return handleSendOtp(
      "/emailOtp",
      data,
      token,
      dispatch,
      handleAsyncError,
      setOtpLoading
    );
  };

  return (
    <div
      className={`fixed ${
        !isForgetModalActive ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-20 lg:top-40 mx-auto shadow-xl rounded-md bg-white max-w-lg">
        <div className="flex justify-between p-2">
          <h2 className="text-theme font-semibold text-lg uppercase">
            {`${
              location.pathname.includes("/all-users/") ? "Change" : "Forget"
            } Password`}
          </h2>
          <button
            onClick={() => dispatch(toggleForgetPasswordModal())}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            disabled={formLoading || false}
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

        <div className="p-6 pt-0 text-center">
          <form onSubmit={handleChangeVehicle}>
            <div className="mb-2">
              <Input
                item={"email"}
                type="email"
                value={emailInput}
                setValueChange={setEmailInput}
                require={true}
              />
            </div>
            <div className="mb-2">
              <Input item={"password"} type="password" require={true} />
            </div>
            {userType !== "admin" && isValidEmail(emailInput) === true && (
              <div className="mb-2">
                <Input item={"otp"} type="number" require={true} />
                <div className="text-left mt-2">
                  <button
                    type="button"
                    className="border-2 rounded-md text-theme hover:bg-theme hover:text-gray-100 border-theme p-1 disabled:border-gray-400 disabled:text-gray-400"
                    disabled={otpLoading}
                    onClick={handleSendEmailOtp}
                  >
                    {!otpLoading ? (
                      "Send OTP"
                    ) : (
                      <Spinner textColor="black" message={"sending..."} />
                    )}
                  </button>
                </div>
              </div>
            )}
            <button
              type="submit"
              className="bg-theme px-4 py-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none disabled:bg-gray-400"
              disabled={formLoading}
            >
              {!formLoading ? (
                `${
                  location.pathname.includes("/all-users/")
                    ? "Change"
                    : "Forget"
                } Password`
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

export default ForgetPasswordModal;
