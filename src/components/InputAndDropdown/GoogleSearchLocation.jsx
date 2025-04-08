import React, { useRef, useState } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { camelCaseToSpaceSeparated } from "../../utils/index";

const GoogleSearchLocation = ({
  item,
  type = "text",
  disabled = false,
  require = false,
  setLatitude,
  setLongitude,
  value,
  customClass = "w-full px-5 py-3",
  bodyWidth = "w-full",
}) => {
  const [input, setInput] = useState((value && value) || "");
  const autocompleteRef = useRef(null);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.formatted_address) {
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();
        setInput(place.vicinity);
        setLatitude && setLatitude(latitude);
        setLongitude && setLongitude(longitude);
      }
    }
  };

  return (
    <div className={`${bodyWidth}`}>
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_KEY}
        libraries={["places"]}
      >
        <div className={`w-full`}>
          <label
            htmlFor={item}
            className="block text-gray-800 font-semibold text-sm capitalize text-left"
          >
            Enter {camelCaseToSpaceSeparated(item)}
            {require && <span className="text-red-500">*</span>}
          </label>
          <div className="mt-2">
            <Autocomplete
              onLoad={(autocomplete) =>
                (autocompleteRef.current = autocomplete)
              }
              onPlaceChanged={handlePlaceChanged}
            >
              <input
                type={type}
                id={item}
                className={`block ${customClass} rounded-md ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none ${
                  item != "email"
                    ? item == "vehicleNumber"
                      ? "uppercase"
                      : "capitalize"
                    : ""
                } disabled:bg-gray-400 disabled:bg-opacity-20`}
                name={item}
                placeholder={`${item}`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={disabled}
                required={require}
              />
            </Autocomplete>
          </div>
        </div>
      </LoadScript>
    </div>
  );
};

export default GoogleSearchLocation;
