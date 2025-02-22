import { useState } from "react";

const VehicleInfo = ({ vehicleImage, vehicleName }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  return (
    <>
      {/* image here  */}
      {vehicleImage ? (
        <div
          className={`rounded-xl h-48 border flex items-center justify-center mb-5 ${
            isImageLoading ? "animate-pulse bg-gray-200" : ""
          }`}
        >
          <img
            src={vehicleImage}
            className="w-full h-full object-contain"
            loading="lazy"
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
            alt={vehicleName || "VEHICLE_IMAGE"}
          />
        </div>
      ) : (
        <div className="bg-gray-300 rounded-xl h-48 flex items-center justify-center mb-5">
          <h3 className="text-center font-bold text-xl">VEHICLE IMAGE HERE</h3>
        </div>
      )}
    </>
  );
};

export default VehicleInfo;
