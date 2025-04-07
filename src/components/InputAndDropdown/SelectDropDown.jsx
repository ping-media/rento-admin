import { useEffect, useState } from "react";
import { camelCaseToSpaceSeparated, formatPrice } from "../../utils/index";

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
}) => {
  const [inputSelect, setInputSelect] = useState(value);
  // for giving custom title
  const title = {
    stationId: "Station",
    locationId: "Location",
    userId: "User",
    vehicleMasterId: "Vehicle",
    vehicleTableId: "Vehicle",
  };

  // changing the value and if flg is present than change it
  const handleChangeValue = (e) => {
    setInputSelect(e.target.value);
    if (setIsLocationSelected) {
      setIsLocationSelected(e.target.value);
    }
    if (onChangeFn) {
      onChangeFn(e.target.value);
    }
  };

  useEffect(() => {
    if (value && setIsLocationSelected) {
      setIsLocationSelected(value);
    }
  }, [value]);

  // for resting the value to default
  useEffect(() => {
    // for resetting the value
    if (changetoDefault && changetoDefault === true) {
      setInputSelect("default");
      changeModalClose && changeModalClose(false);
    }
  }, [changetoDefault]);

  return (
    <div className="w-full">
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
      <div className="mt-2">
        <select
          name={item}
          id={item}
          value={inputSelect}
          onChange={(e) => handleChangeValue(e)}
          className="block w-full rounded-md px-5 py-3 ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none capitalize disabled:bg-gray-300 disabled:bg-opacity-30"
          disabled={!options || options?.length == 0 ? true : false}
          required={require}
        >
          <option value="default">
            {(options?.length == 0 && `No ${title[item] || item} Found`) ||
              `Select ${
                camelCaseToSpaceSeparated(title[item]) ||
                camelCaseToSpaceSeparated(item)
              }`}
          </option>
          {options &&
            options?.map((items, index) => {
              const isId = items?.hasOwnProperty("_id");
              const isOtherId = items?.hasOwnProperty("id");
              const isFirstName = items?.hasOwnProperty("firstName");
              const isLocationName = items?.hasOwnProperty("locationName");
              const isStationName = items?.hasOwnProperty("stationName");
              const isVehicleName = items?.hasOwnProperty("vehicleName");
              const isVehicleNumber = items?.hasOwnProperty("vehicleNumber");
              const isTitle = items?.hasOwnProperty("title");
              const isAmount = items?.hasOwnProperty("amount");
              if (isOtherId && isTitle && isAmount) {
                return (
                  <option
                    value={items?.id}
                    key={items?.id}
                    className="capitalize"
                  >
                    {items?.id} | {items?.title} | {formatPrice(items?.amount)}
                  </option>
                );
              } else if (isId && isVehicleNumber) {
                return (
                  <option
                    value={items?._id}
                    key={items?._id}
                    className="capitalize"
                  >
                    {items?.vehicleNumber} | {items?.vehicleName}
                  </option>
                );
              } else if (isId && isFirstName) {
                return (
                  <option
                    value={items?._id}
                    key={items?._id}
                    className="capitalize"
                  >
                    {items?.firstName} | {items?.userType}
                  </option>
                );
              } else if (
                // !location.pathname.includes("/all-bookings/add-new") &&
                !location.pathname.includes("/all-bookings/details/") &&
                isId &&
                isStationName
              ) {
                return (
                  <option
                    value={items?.stationId}
                    key={items?._id}
                    className="capitalize"
                  >
                    {items?.stationName}
                  </option>
                );
              } else if (isId && isLocationName) {
                return (
                  <option
                    value={items?._id}
                    key={items?._id}
                    className="capitalize"
                  >
                    {items?.locationName}
                  </option>
                );
              } else if (isId && isVehicleName) {
                return (
                  <option
                    value={items?._id}
                    key={items?._id}
                    className="capitalize"
                  >
                    {items?.vehicleName}{" "}
                    {location.pathname.includes("/all-bookings/details/") &&
                      `| ${items?.vehicleNumber}`}
                  </option>
                );
              } else {
                return (
                  <option value={items} key={index} className="capitalize">
                    {typeof items === "number"
                      ? items
                      : camelCaseToSpaceSeparated(items)}
                  </option>
                );
              }
            })}
        </select>
      </div>
    </div>
  );
};

export default SelectDropDown;
