import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Close } from "@mui/icons-material";
import { getData, postData } from "../../Data";
import { useUserSearch } from "../../hooks/use-user-search";
import UserOptionList from "./UserOptionList";
import { useDispatch } from "react-redux";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import ConfirmActionModal from "../Modal/ConfirmActionModal";
import PasswordField from "./PasswordField";
import {
  PASSWORD_RULE_TEXT,
  generateTempPassword,
  validatePassword,
} from "../../utils/Helper/password";
import CopyButton from "../Buttons/CopyButton";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const InputSearchMulti = ({
  item,
  placeholder,
  value = "", // comma separated ids (or array) when editing
  disabled = false,
  require = false,
  name,
  token,
  setValueChanger, // receives an array of ids
  isAdmin = true,
  skipRouteFilter = false,
}) => {
  const [convertTarget, setConvertTarget] = useState(null);
  const [password, setPassword] = useState("");
  const passwordError = validatePassword(password);
  const [credentials, setCredentials] = useState(null); // { email, password } after success
  const targetEmail = convertTarget?.email?.trim() || "";
  const hasValidEmail = EMAIL_REGEX.test(targetEmail);
  const modalView = credentials
    ? "done"
    : hasValidEmail
      ? "confirm"
      : "noEmail";
  const targetName = `${convertTarget?.firstName ?? ""} | ${convertTarget?.contact ?? ""}`;
  const [converting, setConverting] = useState(false);
  const [selected, setSelected] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { inputValue, isSearching, tempVehicleData, filteredUsers, search } =
    useUserSearch({ token, isManagerSearch: isAdmin, skipRouteFilter });

  const selectedIds = selected.map((u) => u._id);
  const availableUsers = filteredUsers.filter(
    (u) => !selectedIds.includes(u._id),
  );

  const updateSelected = (next) => {
    setSelected(next);
    setValueChanger && setValueChanger(next.map((u) => u._id));
  };

  const handleSelect = (user) => {
    // customers can't be assigned directly, ask to convert them first
    if (user.userType === "customer") {
      setPassword(generateTempPassword()); // pre-filled when the modal opens
      setConvertTarget(user);
      return;
    }
    updateSelected([...selected, user]);
    search(""); // clears input and closes the list
  };

  const closeConvertModal = () => {
    setConvertTarget(null);
    setPassword("");
    setCredentials(null);
  };

  const handleConvert = async () => {
    if (!convertTarget || converting || passwordError) return;
    setConverting(true);
    try {
      const response = await postData(
        "/change-user-role",
        { _id: convertTarget._id, password },
        token,
      );
      if (response?.status === 200 || response?.success) {
        handleAsyncError(dispatch, "Customer changed to manager", "success");
        // keep the modal open and switch it to the credentials view
        setCredentials({
          email: response?.data?.email || targetEmail,
          password,
        });
        // closeConvertModal();
        search(inputValue); // refresh the list, they now show up as a manager
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

  const handleRemove = (id) => {
    updateSelected(selected.filter((u) => u._id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && inputValue === "" && selected.length > 0) {
      handleRemove(selected[selected.length - 1]._id);
    }
  };

  const valueKey = Array.isArray(value) ? value.join(",") : String(value || "");

  // when editing: load the already assigned users
  useEffect(() => {
    const ids = valueKey ? valueKey.split(",").filter(Boolean) : [];
    if (ids.length === 0 || ids.every((id) => selectedIds.includes(id))) return;

    (async () => {
      setUserLoading(true);
      const responses = await Promise.all(
        ids.map((id) => getData(`/admin/getAllUsers?_id=${id}`, token)),
      );
      setSelected(
        responses
          .filter((r) => r.status == 200 && r.data?.[0])
          .map((r) => r.data[0]),
      );
      setUserLoading(false);
    })();
  }, [valueKey]);

  if (userLoading) return <InputSearchSkeleton />;

  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-gray-800 font-semibold text-sm capitalize"
      >
        {placeholder || `Enter ${item}`}{" "}
        {require && <span className="text-red-500">*</span>}
      </label>

      <div className="mt-2 relative">
        <input type="hidden" name={name} value={selectedIds.join(",")} />

        <div className="flex flex-wrap items-center gap-2 w-full rounded-md px-3 py-2 ring-1 ring-inset ring-gray-400">
          {selected.map((u) => (
            <span
              key={u._id}
              className="flex max-w-full items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
            >
              <span className="truncate">
                {u.firstName} | {u.contact}
              </span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemove(u._id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Close className="!size-4" />
                </button>
              )}
            </span>
          ))}

          <input
            id={name}
            type="text"
            className="flex-1 min-w-[140px] py-1 outline-none disabled:bg-transparent"
            value={inputValue}
            onChange={(e) => search(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selected.length ? "" : `${placeholder || item}`}
            disabled={disabled}
            required={require && selected.length === 0}
            autoComplete="off"
          />
        </div>

        {isSearching && inputValue.length > 0 && (
          <UserOptionList
            className="top-full mt-1"
            users={availableUsers}
            loaded={!!tempVehicleData}
            onSelect={handleSelect}
            addLabel="Add Manager"
            onAddCustomer={() => navigate("/all-managers/add-new")}
          />
        )}
      </div>

      <ConfirmActionModal
        active={!!convertTarget}
        position="responsive"
        title={
          modalView === "done"
            ? "Manager login ready"
            : modalView === "noEmail"
              ? "Email required"
              : "Change Customer to Manager?"
        }
        message={
          modalView === "done"
            ? "Share these login details with the manager. The password can't be viewed again, so copy it before closing."
            : modalView === "noEmail"
              ? `${targetName} has no valid email. Managers log in with email and password, so add an email to this customer first.`
              : `Do you want to change ${targetName} from customer to manager? Their login password is set below.`
        }
        confirmText="Yes, change"
        cancelText={modalView === "confirm" ? "Cancel" : "Close"}
        showConfirm={modalView === "confirm"}
        persistent={modalView === "done"}
        loading={converting}
        confirmDisabled={!!passwordError}
        onConfirm={handleConvert}
        onCancel={closeConvertModal}
      >
        {modalView === "confirm" && (
          <div className="mt-4">
            <PasswordField
              id="newManagerPassword"
              label="Manager login password"
              value={password}
              onChange={setPassword}
              onGenerate={() => setPassword(generateTempPassword())}
              onEnter={handleConvert}
              error={passwordError}
              hint={PASSWORD_RULE_TEXT}
              defaultVisible
            />
          </div>
        )}

        {modalView === "noEmail" && (
          <Link
            to={`/all-users/${convertTarget?._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-theme underline underline-offset-2"
          >
            Open customer profile
          </Link>
        )}

        {modalView === "done" && (
          <div className="mt-4 rounded-md border border-theme/40 bg-theme/10 p-4">
            <p className="text-xs uppercase text-gray-500">Email</p>
            <p className="break-all text-sm font-semibold text-gray-800">
              {credentials.email}
            </p>
            <p className="mt-3 text-xs uppercase text-gray-500">Password</p>
            <p className="select-all break-all font-mono text-sm font-semibold text-gray-800">
              {credentials.password}
            </p>
            <CopyButton
              textToCopy={`Email: ${credentials.email}\nPassword: ${credentials.password}`}
              label="Copy email & password"
              className="mt-4 w-full rounded-lg bg-theme px-4 py-3 text-sm font-semibold text-white hover:bg-theme-dark"
            />
          </div>
        )}
      </ConfirmActionModal>
    </div>
  );
};

export default InputSearchMulti;

const InputSearchSkeleton = () => (
  <div className="w-full animate-pulse" aria-busy="true">
    <div className="h-4 w-40 rounded bg-gray-200" />
    <div className="mt-2 h-12 w-full rounded-md bg-gray-200" />
  </div>
);
