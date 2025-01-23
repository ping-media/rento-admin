import React, { useRef, useState } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const GoogleSearchLocation = () => {
  const [address, setAddress] = useState(""); // State for the selected address
  const autocompleteRef = useRef(null); // Ref for the autocomplete instance

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace(); // Get place details
      if (place && place.formatted_address) {
        setAddress(place.formatted_address); // Set the selected address
        console.log("Selected Place Details:", place);
      }
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_KEY}
      libraries={["places"]}
    >
      <div style={{ width: "300px", margin: "0 auto", padding: "10px" }}>
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            placeholder="Search address"
            className={`block rounded-md ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none disabled:bg-gray-400 disabled:bg-opacity-20`}
          />
        </Autocomplete>
        <div style={{ marginTop: "10px" }}>
          <strong>Selected Address:</strong> {address}
        </div>
      </div>
    </LoadScript>
  );
};

export default GoogleSearchLocation;
