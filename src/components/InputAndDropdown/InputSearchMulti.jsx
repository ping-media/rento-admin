import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Close } from "@mui/icons-material";
import { getData, postData } from "../../Data";
import { useUserSearch } from "../../hooks/use-user-search";
import UserOptionList from "./UserOptionList";
import { useDispatch } from "react-redux";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import ConfirmActionModal from "../Modal/ConfirmActionModal";

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
      setConvertTarget(user);
      return;
    }
    updateSelected([...selected, user]);
    search(""); // clears input and closes the list
  };

  const handleConvert = async () => {
    if (!convertTarget || converting) return;
    setConverting(true);
    try {
      const response = await postData(
        "/change-user-role",
        { _id: convertTarget._id },
        token,
      );
      if (response?.status === 200 || response?.success) {
        handleAsyncError(dispatch, "Customer changed to manager", "success");
        setConvertTarget(null);
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
        title="Change Customer to Manager?"
        message={`Do you want to change ${convertTarget?.firstName ?? ""} | ${convertTarget?.contact ?? ""} from customer to manager?`}
        confirmText="Yes, change"
        loading={converting}
        onConfirm={handleConvert}
        onCancel={() => setConvertTarget(null)}
      />
    </div>
  );
};

export default InputSearchMulti;

// const ConfirmActionModal = ({
//   active,
//   title,
//   message,
//   confirmText = "Confirm",
//   cancelText = "Cancel",
//   loading = false,
//   onConfirm,
//   onCancel,
// }) => (
//   <ModalWrapper
//     active={active}
//     onClose={() => !loading && onCancel()}
//     size="sm"
//     position="center"
//     showClose={false}
//     zIndexClass="z-50"
//   >
//     <div className="p-6">
//       <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
//       <p className="mt-2 text-sm text-gray-600">{message}</p>

//       <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
//         <button
//           type="button"
//           onClick={() => !loading && onCancel()}
//           disabled={loading}
//           className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 disabled:opacity-60 sm:w-auto sm:py-2.5"
//         >
//           {cancelText}
//         </button>
//         <button
//           type="button"
//           onClick={onConfirm}
//           disabled={loading}
//           className="w-full rounded-lg bg-theme px-4 py-3 text-sm font-semibold text-white hover:bg-theme-dark disabled:bg-gray-400 sm:w-auto sm:py-2.5"
//         >
//           {loading ? <Spinner /> : confirmText}
//         </button>
//       </div>
//     </div>
//   </ModalWrapper>
// );

const InputSearchSkeleton = () => (
  <div className="w-full animate-pulse" aria-busy="true">
    <div className="h-4 w-40 rounded bg-gray-200" />
    <div className="mt-2 h-12 w-full rounded-md bg-gray-200" />
  </div>
);
