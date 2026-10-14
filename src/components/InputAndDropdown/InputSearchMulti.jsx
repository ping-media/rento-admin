import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Close } from "@mui/icons-material";
import { getData } from "../../Data";
import PreLoader from "../Skeleton/PreLoader";
import { useUserSearch } from "../../hooks/use-user-search";
import UserOptionList from "./UserOptionList";

const InputSearchMulti = ({
  item,
  placeholder,
  value = "", // comma separated ids (or array) when editing
  disabled = false,
  require = false,
  name,
  token,
  setValueChanger, // receives an array of ids
}) => {
  const [selected, setSelected] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const navigate = useNavigate();
  const { inputValue, isSearching, tempVehicleData, filteredUsers, search } =
    useUserSearch(token);

  const selectedIds = selected.map((u) => u._id);
  const availableUsers = filteredUsers.filter(
    (u) => !selectedIds.includes(u._id),
  );

  const updateSelected = (next) => {
    setSelected(next);
    setValueChanger && setValueChanger(next.map((u) => u._id));
  };

  const handleSelect = (user) => {
    updateSelected([...selected, user]);
    search(""); // clears input and closes the list
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

  if (userLoading) return <PreLoader />;

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
              className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
            >
              {u.firstName} | {u.contact}
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
    </div>
  );
};

export default InputSearchMulti;
