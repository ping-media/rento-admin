import { useState } from "react";

const SelectDropDown = ({ item, options, value = "" }) => {
  const [inputSelect, setInputSelect] = useState(value);
  // for giving custom title
  const title = {
    stationId: "Station",
    locationId: "Location",
    userId: "User",
    vehicleMasterId: "Vehicle",
  };

  return (
    <div className="w-full">
      <label
        htmlFor={item}
        className="block text-gray-800 font-semibold text-sm capitalize"
      >
        Select {title[item] || item}
      </label>
      <div className="mt-2">
        <select
          name={item}
          id={item}
          value={inputSelect}
          onChange={(e) => setInputSelect(e.target.value)}
          className="block w-full rounded-md px-5 py-3 ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none capitalize"
        >
          <option value="">Select {title[item] || item}</option>
          {options &&
            options.map((items, index) => {
              const isId = items?.hasOwnProperty("_id");
              const isFirstName = items?.hasOwnProperty("firstName");
              const isLocationName = items?.hasOwnProperty("locationName");
              const isStationName = items?.hasOwnProperty("stationName");
              const isVehicleName = items?.hasOwnProperty("vehicleName");

              if (isId && isFirstName) {
                return (
                  <option
                    value={items?._id}
                    key={items?._id}
                    className="capitalize"
                  >
                    {items?.firstName} | {items?.userType}
                  </option>
                );
              } else if (isId && isStationName) {
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
                    <span className="mr-2">{items?.vehicleBrand}</span>
                    {items?.vehicleName}
                  </option>
                );
              } else {
                return (
                  <option value={items} key={index} className="capitalize">
                    {items}
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
