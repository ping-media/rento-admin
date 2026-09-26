import { useEffect, useMemo, useRef, useState } from "react";
import { tableIcons } from "../../Data/Icons";
import { useDispatch } from "react-redux";
import {
  resetBookingVehicleName,
  setBookingVehicleName,
} from "../../Redux/PaginationSlice/PaginationSlice";
import { useAutoFocus } from "../../utils/Helper/useAutoFocus";

const getSortedVehicles = (vehicles = []) => {
  const getPriority = (vehicle) => {
    const isBooked = vehicle?.vehicleStatus === "booked";
    const isMaintenance = vehicle?.vehicleStatus === "maintenance";
    const isVehicleInBooking = vehicle?.pendingRideWarning !== null;

    if (!isBooked && !isMaintenance && !isVehicleInBooking) {
      return 0; // Free
    }

    if (isVehicleInBooking) {
      return 1; // In Booking
    }

    if (isBooked) {
      return 2; // Booked
    }

    if (isMaintenance) {
      return 3; // Maintenance
    }

    return 4;
  };

  return [...vehicles].sort((a, b) => getPriority(a) - getPriority(b));
};

const SelectDropDownVehicle = ({
  item,
  name,
  require,
  options,
  value = "",
  setValueChanger,
  setSelectedChanger,
  isModalClose,
  isLabel = true,
  onSearch,
  loading = false,
  defaultSelected = null,
  disabled = false,
  blockedOptions = [],
  onUnblock = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputSelect, setInputSelect] = useState(defaultSelected?._id || value);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const dispatch = useDispatch();

  useAutoFocus(searchInputRef, isOpen);

  useEffect(() => {
    if (defaultSelected?._id) {
      setInputSelect(defaultSelected._id);
    }
  }, [defaultSelected?._id]);

  const handleOptionClick = (val) => {
    if (inputSelect === val._id) {
      setIsOpen(false);
      return;
    }

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
    if (isModalClose === false && !defaultSelected?._id) {
      setInputSelect("");
    }
  }, [isModalClose]);

  // clearing the input instead the select input box
  useEffect(() => {
    if (isModalClose === false) {
      setSearchTerm("");
    }
  }, [isModalClose]);

  // Debounce effect for search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm);
      } else {
        dispatch(setBookingVehicleName(searchTerm));
      }
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
      if (!onSearch) {
        dispatch(resetBookingVehicleName());
      }
    };
  }, [dispatch]);

  const selectedOption =
    options?.find((opt) => opt._id === inputSelect) ||
    (defaultSelected ?? undefined);

  const sortedOptions = useMemo(() => {
    if (options == null) return [];
    return getSortedVehicles(options);
  }, [options]);

  return (
    <div className="w-full" ref={dropdownRef}>
      {isLabel && (
        <label
          htmlFor={item}
          className="block text-gray-800 font-semibold text-sm capitalize"
        >
          Select {item}
          {require && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

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
          disabled={disabled}
        >
          {inputSelect && selectedOption
            ? `${selectedOption?.vehicleNumber || ""} | ${selectedOption?.vehicleName || ""}`
            : `Select ${item}`}
        </button>
        <div
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-600 ${isOpen ? "rotate-180" : "rotate-0"}`}
        >
          {tableIcons.downArrow}
        </div>
        {isOpen && (
          <div className="absolute z-50 bg-white mt-2 w-full max-h-40 lg:max-h-40 overflow-y-auto rounded-md shadow-md border border-gray-300">
            <input
              type="text"
              ref={searchInputRef}
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full p-2 border-b border-gray-200 outline-none text-sm"
            />

            {loading ? (
              <div className="px-4 py-2 text-sm text-gray-500 italic">
                Searching...
              </div>
            ) : options?.length ? (
              sortedOptions?.map((opt) => {
                const isBooked = opt?.vehicleStatus === "booked";
                const isMaintenance = opt?.vehicleStatus === "maintenance";
                const isVehicleInBooking = opt?.pendingRideWarning !== null;
                const isUnavailable =
                  isBooked || isMaintenance || isVehicleInBooking;

                return (
                  <div
                    key={opt._id}
                    onClick={() => !isUnavailable && handleOptionClick(opt)}
                    className={`px-4 py-2 text-sm capitalize flex items-center justify-between gap-2
          ${
            isUnavailable
              ? "cursor-not-allowed opacity-60 bg-gray-50"
              : "hover:bg-gray-100 cursor-pointer"
          }`}
                  >
                    <span>
                      {opt.vehicleNumber} | {opt.vehicleName}
                    </span>

                    {isMaintenance && (
                      <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                        Maintenance
                      </span>
                    )}
                    {isBooked && (
                      <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                        Booked{" "}
                        {opt?.bookingConflict?.bookingId
                          ? `#${opt.bookingConflict.bookingId}`
                          : ""}
                      </span>
                    )}
                    {isVehicleInBooking && (
                      <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                        In Booking{" "}
                        {opt?.pendingRideWarning?.bookingId
                          ? `#${opt.pendingRideWarning.bookingId}`
                          : ""}
                      </span>
                    )}
                  </div>
                );
              })
            ) : searchTerm.trim() ? (
              <div className="px-4 py-2 text-gray-500 text-sm">
                No vehicles found.
              </div>
            ) : (
              <div className="px-4 py-2 text-gray-500 text-sm italic">
                Start typing to search for a vehicle.
              </div>
            )}

            {blockedOptions.length > 0 && (
              <div className="border-t border-gray-200">
                {blockedOptions.slice(0, 3).map((v) => {
                  const isBooked = !!v.bookingId;

                  if (isBooked) {
                    return (
                      <div
                        key={v.vehicleId}
                        className="w-full px-4 py-2 text-sm capitalize flex items-center justify-between gap-2 bg-gray-100 opacity-60 cursor-not-allowed"
                      >
                        <span className="normal-case text-gray-700">
                          {v.vehicleNumber} ({v.bookingId})
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-semibold text-gray-600 bg-gray-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                            Booked
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={v.vehicleId}
                      className="w-full px-4 py-2 text-sm capitalize flex items-center justify-between gap-2 bg-red-50"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUnblock && onUnblock(v);
                      }}
                    >
                      <span className="normal-case text-gray-700">
                        {v.vehicleNumber}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                          Blocked
                        </span>
                      </div>
                    </button>
                  );
                })}
                {blockedOptions.length > 3 && (
                  <div className="px-4 py-1 text-xs text-gray-400">
                    +{blockedOptions.length - 3} more, refine your search
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectDropDownVehicle;
