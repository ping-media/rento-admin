import { useState } from "react";
import { useDispatch } from "react-redux";
import { postData } from "../Data";
import { handleAsyncError } from "../utils/Helper/handleAsyncError";
import { generateTempPassword, passwordRules } from "../utils/Helper/password";
import { isValidEmail } from "../utils/Helper/email";

export const useConvertCustomerToManager = ({ token, onSuccess } = {}) => {
  const dispatch = useDispatch();
  const [target, setTarget] = useState(null);
  const [password, setPassword] = useState("");
  const [credentials, setCredentials] = useState(null); // { email, password } after success
  const [converting, setConverting] = useState(false);

  const targetEmail = target?.email?.trim() || "";
  const isPasswordValid = passwordRules(password).every((rule) => rule.valid);
  const targetName = `${target?.firstName ?? ""} | ${target?.contact ?? ""}`;
  const modalView = credentials
    ? "done"
    : isValidEmail(targetEmail)
      ? "confirm"
      : "noEmail";

  const start = (user) => {
    if (user === null)
      return handleAsyncError(dispatch, "unable to get customer! try again");
    setPassword(generateTempPassword()); // pre-filled when the modal opens
    setTarget(user);
  };

  const close = () => {
    setTarget(null);
    setPassword("");
    setCredentials(null);
  };

  const regeneratePassword = () => setPassword(generateTempPassword());

  const convert = async () => {
    if (!target || converting || !isPasswordValid) return;
    setConverting(true);
    try {
      const response = await postData(
        "/change-user-role",
        { _id: target._id, password },
        token,
      );
      if (response?.status === 200 || response?.success) {
        handleAsyncError(dispatch, "Customer changed to manager", "success");
        setCredentials({
          email: response?.data?.email || targetEmail,
          password,
        });
        onSuccess?.(response);
      } else {
        handleAsyncError(
          dispatch,
          response?.message || "Unable to change customer to manager",
        );
      }
    } catch (error) {
      handleAsyncError(dispatch, error?.message);
    } finally {
      setConverting(false);
    }
  };

  return {
    isOpen: !!target,
    target,
    targetName,
    password,
    isPasswordValid,
    credentials,
    converting,
    modalView,
    setPassword,
    regeneratePassword,
    start,
    close,
    convert,
  };
};
