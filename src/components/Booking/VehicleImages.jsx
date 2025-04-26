import PhotoView from "../../components/Form/User Components/PhotoView";
// import { tableIcons } from "../../Data/Icons";
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
          // <div
          //   className={`relative w-auto border-2 rounded-md p-1 h-full`}
          //   key={key}
          // >
          //   <a
          //     href={value?.imageUrl}
          //     data-pswp-width="1920"
          //     data-pswp-height="1080"
          //     target="_blank"
          //     rel="noreferrer"
          //     className="flex items-center gap-1"
          //   >
          //     {value?.imageUrl ? (
          //       <img
          //         src={value?.imageUrl}
          //         className="w-16 h-16 object-cover"
          //         alt={value?.fileName}
          //       />
          //     ) : (
          //       tableIcons?.image
          //     )}
          //   </a>
          // </div>
        )
      )}
    </div>
  );
};

export default VehicleImages;
