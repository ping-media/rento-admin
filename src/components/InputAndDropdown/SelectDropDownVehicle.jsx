import { useEffect, useRef, useState } from "react";
import { tableIcons } from "../../Data/Icons";
import { useDispatch } from "react-redux";
import {
  resetBookingVehicleName,
  setBookingVehicleName,
} from "../../Redux/PaginationSlice/PaginationSlice";

const SelectDropDownVehicle = ({
  item,
  name,
  require,
  options,
  value = "",
  setValueChanger,
  setSelectedChanger,
  isModalClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputSelect, setInputSelect] = useState(value);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const dispatch = useDispatch();

  const handleOptionClick = (val) => {
    setInputSelect(val._id);
    setIsOpen(false);
    setValueChanger && setValueChanger(val._id);
    setSelectedChanger && setSelectedChanger(val);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // clearing the state when user close modal
  useEffect(() => {
    isModalClose === false && setInputSelect("");
  }, [isModalClose]);

  // Debounce effect for search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      dispatch(setBookingVehicleName(searchTerm));
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm]);

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    return () => {
      dispatch(resetBookingVehicleName());
    };
  }, []);

  return (
    <div className="w-full" ref={dropdownRef}>
      <label
        htmlFor={item}
        className="block text-gray-800 font-semibold text-sm capitalize"
      >
        Select {item}
        {require && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="mt-2 relative">
        <input
          type="hidden"
          name={name}
          value={inputSelect?._id}
          required={require}
        />
        <button
          className="text-left block w-full rounded-md px-5 py-3 ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none capitalize bg-white cursor-pointer disabled:bg-gray-300/30"
          type="button"
          onClick={handleToggleDropdown}
          disabled={!options || options?.length == 0 ? true : false}
        >
          {inputSelect
            ? `${
                options?.find((opt) => opt._id === inputSelect)
                  ?.vehicleNumber || ""
              } | ${
                options?.find((opt) => opt._id === inputSelect)?.vehicleName ||
                ""
              }`
            : `Select ${item}`}
        </button>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-600">
          {tableIcons.downArrow}
        </div>
        {isOpen && (
          <div className="absolute z-50 bg-white mt-2 w-full max-h-28 lg:max-h-40 overflow-y-auto rounded-md shadow-md border border-gray-300">
            <input
              type="text"
              ref={searchInputRef}
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full px-3 py-2 border-b border-gray-200 outline-none text-sm"
            />
            {options?.length ? (
              options.map((opt) => (
                <div
                  key={opt._id}
                  onClick={() => handleOptionClick(opt)}
                  className="px-4 py-2 hover:bg-gray-100 text-sm capitalize cursor-pointer"
                >
                  {opt.vehicleNumber} | {opt.vehicleName}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 text-sm">
                No options found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectDropDownVehicle;
