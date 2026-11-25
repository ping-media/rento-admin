import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";
import { postData } from "../../Data";
import { tableIcons } from "../../Data/Icons";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";

const ChangePasswordModal = ({ isActive, setIsActive }) => {
  const { token } = useSelector((state) => state.user);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (isActive) {
      setError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [isActive]);

  if (!isActive) return null;

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    if (newPassword === currentPassword) {
      setError("New password must be different from the current password");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await postData(
        `/change-password`,
        { currentPassword, newPassword },
        token,
      );

      // your backend returns the status inside the body, so check it too
      const result = res?.data ?? res;
      if (result?.status && result.status !== 200) {
        throw new Error(result.message || "Failed to change password");
      }

      setIsActive(false);
      handleAsyncError(dispatch, "Password changed successfully.", "success");
    } catch (err) {
      setError(
        err?.response?.message || err.message || "Failed to change password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4">
      <div className="relative top-[10%] mx-auto shadow-xl rounded-md bg-white w-full lg:max-w-lg">
        <div className="flex justify-between border-b p-2">
          <h2 className="text-theme text-lg uppercase font-semibold">
            Change Password
          </h2>
          <button
            onClick={() => setIsActive(false)}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            disabled={loading}
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

        <div className="p-6 pt-4">
          <div className="flex flex-col gap-3 text-left">
            <PasswordField
              label="Current Password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
            />

            <PasswordField
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              disabled={loading}
            />

            <PasswordField
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
          )}

          <div className="text-center mt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto bg-theme text-white px-6 py-2 rounded-md disabled:opacity-60"
            >
              {loading ? <Spinner /> : "Change Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;

const PasswordField = ({
  label,
  value,
  onChange,
  autoComplete,
  disabled,
  placeholder = "Enter password",
}) => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative text-gray-500">
        <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
          {tableIcons.lock}
        </div>
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
          className="w-full pl-[3.4rem] pr-12 py-2.5 appearance-none bg-transparent outline-none border border-gray-300 focus:border-theme text-gray-800 rounded-lg placeholder-gray-400"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-3 my-auto h-6 flex items-center pr-2"
          onClick={() => setShow((prev) => !prev)}
          disabled={disabled}
        >
          {!show ? tableIcons.eyeOpen : tableIcons.eyeClose}
        </button>
      </div>
    </div>
  );
};
