import { useDispatch, useSelector } from "react-redux";
import {
  addTempVehicleData,
  removeTempVehicleData,
} from "../../Redux/VehicleSlice/VehicleSlice";
import { fetchUserDataBasedOnQuery } from "../../Data/Function";
import { Add, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

const UserSearchInput = ({
  token,
  inputValue,
  setInputValue,
  selectedUsers,
  setSelectedUsers,
  timeoutRef, // pass useRef from modal
  dispatch,
  handleAsyncError,
  required = false,
}) => {
  const navigate = useNavigate();
  const { tempVehicleData } = useSelector((state) => state.vehicles);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    if (!val) {
      dispatch(removeTempVehicleData());
      return;
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      const data = await fetchUserDataBasedOnQuery(
        `/admin/getAllUsers?search=${val}`,
        token,
      );
      dispatch(addTempVehicleData(data));
    }, 300);
  };

  const handleSelect = (user) => {
    // prevent duplicate
    if (selectedUsers.find((u) => u._id === user._id)) {
      setInputValue("");
      dispatch(removeTempVehicleData());
      return;
    }
    // Check mobile token
    if (!user?.mobileToken) {
      handleAsyncError(
        dispatch,
        `${user.firstName} ${user.lastName} has no mobile token`,
      );
      return;
    }

    setSelectedUsers((prev) => [...prev, user]);
    setInputValue("");
    dispatch(removeTempVehicleData());
  };

  const handleRemove = (id) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(tempVehicleData)) return [];
    return tempVehicleData.filter(
      (u) => !selectedUsers.find((s) => s._id === u._id),
    );
  }, [tempVehicleData, selectedUsers]);

  const showDropdown = inputValue.length > 0;

  return (
    <div className="w-full relative">
      <label className="block text-gray-800 font-semibold text-sm mb-2">
        Select Users {required && <span className="text-red-500">*</span>}
      </label>

      {/* Chips */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selectedUsers.map((u) => (
            <span
              key={u._id}
              className="flex items-center gap-1 bg-theme text-white text-xs px-2.5 py-1 rounded-full"
            >
              {u.firstName} {u.lastName}
              <button
                type="button"
                onClick={() => handleRemove(u._id)}
                className="hover:opacity-70"
              >
                <Close className="!size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={
          selectedUsers.length > 0
            ? "Add more users..."
            : "Search by name or contact..."
        }
        autoComplete="off"
        className="block w-full rounded-md px-5 py-3 ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none"
      />

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full mt-1 w-full rounded-md px-3 py-2 bg-white border-2 z-30 shadow-md max-h-48 overflow-y-auto">
          <ul>
            {!tempVehicleData && (
              <li className="my-2 italic text-gray-400 text-sm">
                Searching...
              </li>
            )}

            {tempVehicleData && filteredUsers.length === 0 && (
              <li
                role="button"
                tabIndex={0}
                className="my-1.5 italic text-gray-400 text-sm cursor-pointer flex items-center gap-1 hover:text-gray-600"
                onClick={() => navigate("/all-users/add-new")}
              >
                <Add className="!size-4" /> Add new user
              </li>
            )}

            {filteredUsers.map((user) => (
              <li
                key={user._id}
                onClick={() => handleSelect(user)}
                className="my-2 cursor-pointer text-gray-500 text-sm hover:text-gray-800 border-b last:border-0 pb-1"
              >
                {user.firstName} {user.lastName}{" "}
                <span className="text-gray-400">
                  | {user.contact} | {user.userType}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserSearchInput;
