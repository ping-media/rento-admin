import PhotoView from "../../components/Form/User Components/PhotoView";
import React from "react";

const VehicleImages = ({ pickupImage }) => {
  return (
    <div className="flex items-center gap-2 flex-wrap" id="vehicle-gallery">
      {Object.entries(pickupImage.files || {})?.map(([key, value]) => (
        <PhotoView
          item={value}
          className="w-14 lg:w-20 h-14 lg:h-20"
          uniqueId="vehicle-gallery"
          key={key}
        />
      ))}
    </div>
  );
};

export default VehicleImages;
