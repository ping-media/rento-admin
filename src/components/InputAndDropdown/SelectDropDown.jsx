import { useEffect, useRef, useState } from "react";
import { camelCaseToSpaceSeparated, formatPrice } from "../../utils/index";
import { tableIcons } from "../../Data/Icons";

const SelectDropDown = ({
  item,
  options,
  value = "",
  setIsLocationSelected,
  require = false,
  onChangeFn,
  changetoDefault = false,
  changeModalClose,
  placeholder,
  isSearchEnable = true,
}) => {
  const [inputSelect, setInputSelect] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef();

  const title = {
    stationId: "Station",
    locationId: "Location",
    userId: "User",
    vehicleMasterId: "Vehicle",
    vehicleTableId: "Vehicle",
  };

  const isDisabled = !options || options.length === 0;

  const handleChangeValue = (selectedValue) => {
    setInputSelect(selectedValue);
    setIsOpen(false);
    if (setIsLocationSelected) setIsLocationSelected(selectedValue);
    if (onChangeFn) onChangeFn(selectedValue);
  };

  useEffect(() => {
    if (changetoDefault === true) {
      setInputSelect("default");
      changeModalClose?.(false);
    }
  }, [changetoDefault]);

  useEffect(() => {
    if (value && setIsLocationSelected) {
      setIsLocationSelected(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getLabel = (item) => {
    const isId = item?.hasOwnProperty("_id");
    const isOtherId = item?.hasOwnProperty("id");
    const isFirstName = item?.hasOwnProperty("firstName");
    const isLocationName = item?.hasOwnProperty("locationName");
    const isStationName = item?.hasOwnProperty("stationName");
    const isVehicleName = item?.hasOwnProperty("vehicleName");
    const isVehicleNumber = item?.hasOwnProperty("vehicleNumber");
    const isTitle = item?.hasOwnProperty("title");
    const isAmount = item?.hasOwnProperty("amount");

    if (isOtherId && isTitle && isAmount) {
      return `${item.id} | ${item.title} | ${formatPrice(item.amount)}`;
    } else if (isId && isVehicleNumber) {
      return `${item.vehicleNumber} | ${item.vehicleName}`;
    } else if (isId && isFirstName) {
      return `${item.firstName} | ${item.userType}`;
    } else if (
      !location.pathname.includes("/all-bookings/details/") &&
      isId &&
      isStationName
    ) {
      return `${item.stationName}`;
    } else if (isId && isLocationName) {
      return `${item.locationName}`;
    } else if (isId && isVehicleName) {
      return `${item.vehicleName}${
        location.pathname.includes("/all-bookings/details/")
          ? ` | ${item.vehicleNumber}`
          : ""
      }`;
    } else {
      return typeof item === "number" ? item : camelCaseToSpaceSeparated(item);
    }
  };

  const getValue = (item) => {
    if (item == null) return "";
    if (item?.stationId && item?.hasOwnProperty("stationName"))
      return item?.stationId;
    return item?._id || item?.id || item;
  };

  const filteredOptions = options?.filter((opt) => {
    const label = getLabel(opt);
    return String(label).toLowerCase().includes(searchTerm.toLowerCase());
  });

  // const displayLabel =
  //   inputSelect === "default" || !inputSelect
  //     ? isDisabled
  //       ? `No ${title[item] || item} Found`
  //       : `Select ${
  //           camelCaseToSpaceSeparated(title[item]) ||
  //           camelCaseToSpaceSeparated(placeholder || item)
  //         }`
  //     : getLabel(options.find((o) => getValue(o) === inputSelect));
  const matchedOption = options?.find((o) => getValue(o) === inputSelect);
  const displayLabel =
    !matchedOption || inputSelect === "default"
      ? isDisabled
        ? `No ${title[item] || item} Found`
        : `Select ${
            camelCaseToSpaceSeparated(title[item]) ||
            camelCaseToSpaceSeparated(placeholder || item)
          }`
      : getLabel(matchedOption);

  return (
    <div className="w-full" ref={dropdownRef}>
      <label
        htmlFor={item}
        className="block text-gray-800 font-semibold text-sm capitalize text-left"
      >
        Select{" "}
        {placeholder ||
          camelCaseToSpaceSeparated(title[item]) ||
          camelCaseToSpaceSeparated(item)}
        {require && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input type="hidden" name={item} value={inputSelect} />
      <div className="mt-2 relative">
        <div
          className={`block w-full rounded-md px-5 py-3 ring-1 ring-inset ring-gray-400 ${
            isDisabled
              ? "bg-gray-300 bg-opacity-30 cursor-not-allowed"
              : "bg-white cursor-pointer"
          } text-gray-800 capitalize focus:outline-none focus:ring-0`}
          onClick={() => {
            if (!isDisabled) setIsOpen((prev) => !prev);
          }}
        >
          {displayLabel}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-600">
            {tableIcons.downArrow}
          </div>
        </div>

        {isOpen && !isDisabled && (
          <div className="absolute z-10 mt-2 w-full max-h-40 overflow-y-auto bg-white shadow-lg border border-gray-300 rounded-md">
            {isSearchEnable && (
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border-b border-gray-300 outline-none focus:ring-0 focus:outline-none"
              />
            )}
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize"
              onClick={() => handleChangeValue("default")}
            >
              {isDisabled
                ? `No ${title[item] || item} Found`
                : `Select ${
                    camelCaseToSpaceSeparated(title[item]) ||
                    camelCaseToSpaceSeparated(placeholder || item)
                  }`}
            </div>
            {filteredOptions?.map((opt, i) => (
              <div
                key={getValue(opt) + i}
                onClick={() => handleChangeValue(getValue(opt))}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize"
              >
                {getLabel(opt)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectDropDown;
