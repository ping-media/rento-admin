const VehicleInfo = ({ vehicleImage, vehicleName }) => {
  return (
    <>
      {/* image here  */}
      {vehicleImage ? (
        <div className="rounded-xl h-64 border flex items-center justify-center mb-5">
          <img
            src={vehicleImage}
            className="w-full h-full object-contain"
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
