import PhotoView from "../../components/Form/User Components/PhotoView";
import React from "react";
import { useSelector } from "react-redux";

const VehicleImages = () => {
  const { vehiclePickupImage } = useSelector((state) => state.vehicles);
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {Object.entries(vehiclePickupImage[0]?.files || {})?.map(
        ([key, value]) => (
          <PhotoView
            item={value}
            className="w-20 h-20"
            uniqueId={key}
            key={key}
          />
        )
      )}
    </div>
  );
};

export default VehicleImages;
