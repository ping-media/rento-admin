import PhotoView from "../../components/Form/User Components/PhotoView";
import React from "react";

const VehicleImages = ({ pickupImage }) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {Object.entries(pickupImage?.files || {})?.map(([key, value]) => (
        <PhotoView
          item={value}
          className="w-20 h-20"
          uniqueId={key}
          key={key}
        />
      ))}
    </div>
  );
};

export default VehicleImages;
