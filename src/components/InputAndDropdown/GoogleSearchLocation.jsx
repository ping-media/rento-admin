import React, { useRef, useState, useEffect } from "react";
import { LoadScriptNext, Autocomplete } from "@react-google-maps/api";
import { camelCaseToSpaceSeparated } from "../../utils/index";

const libraries = ["places"];
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAP_KEY;

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
  const [input, setInput] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingError, setIsLoadingError] = useState(false);
  const autocompleteRef = useRef(null);

  // Set initial value properly
  useEffect(() => {
    if (value) {
      setInput(value);
    }
  }, [value]);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      try {
        const place = autocompleteRef.current.getPlace();

        // Make sure place has the necessary properties
        if (place && place.geometry && place.geometry.location) {
          const latitude = place.geometry.location.lat();
          const longitude = place.geometry.location.lng();

          // Use the most appropriate address component
          const formattedAddress =
            place.formatted_address || place.vicinity || place.name || input;
          setInput(formattedAddress);

          // Update coordinates only if they're valid
          if (latitude && longitude) {
            setLatitude && setLatitude(latitude);
            setLongitude && setLongitude(longitude);
          }
        }
      } catch (error) {
        console.error("Error processing place:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);

    // If input is cleared, reset coordinates
    if (e.target.value === "" && (setLatitude || setLongitude)) {
      setLatitude && setLatitude("");
      setLongitude && setLongitude("");
    }
  };

  const handleScriptLoad = () => {
    setIsLoaded(true);
    setIsLoadingError(false);
  };

  const handleScriptError = (error) => {
    console.error("Google Maps Script Error:", error);
    setIsLoadingError(true);
    setIsLoaded(false);
  };

  return (
    <div className={`${bodyWidth}`}>
      <label
        htmlFor={item}
        className="block text-gray-800 font-semibold text-sm capitalize text-left"
      >
        Enter {camelCaseToSpaceSeparated(item)}
        {require && <span className="text-red-500">*</span>}
      </label>

      <div className="mt-2">
        <LoadScriptNext
          googleMapsApiKey={googleMapsApiKey}
          libraries={libraries}
          onLoad={handleScriptLoad}
          onError={handleScriptError}
          loadingElement={<div>Loading Maps...</div>}
          language="en"
        >
          {isLoaded ? (
            <Autocomplete
              onLoad={(autocomplete) => {
                autocompleteRef.current = autocomplete;
              }}
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
                placeholder={`Enter ${camelCaseToSpaceSeparated(item)}`}
                value={input}
                onChange={handleInputChange}
                disabled={disabled}
                required={require}
              />
            </Autocomplete>
          ) : (
            <input
              type={type}
              id={`${item}-placeholder`}
              className={`block ${customClass} rounded-md ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none ${
                item != "email"
                  ? item == "vehicleNumber"
                    ? "uppercase"
                    : "capitalize"
                  : ""
              } disabled:bg-gray-400 disabled:bg-opacity-20`}
              value={input}
              onChange={handleInputChange}
              disabled={true}
              placeholder={
                isLoadingError ? "Failed to load Google Maps" : "Loading..."
              }
            />
          )}
        </LoadScriptNext>
      </div>
    </div>
  );
};

export default React.memo(GoogleSearchLocation);
