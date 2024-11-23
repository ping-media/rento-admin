import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import DeviceHubRoundedIcon from "@mui/icons-material/DeviceHubRounded";

const VehicleInfo = () => {
  const moreInfo = [
    { icon: <ConstructionRoundedIcon />, detail: "11CC" },
    { icon: <BoltRoundedIcon />, detail: "50 BHP" },
    { icon: <SpeedRoundedIcon />, detail: "50 Speed" },
    { icon: <DeviceHubRoundedIcon />, detail: "1 Cylinder" },
  ];
  return (
    <>
      {/* image here  */}
      <div className="bg-gray-300 rounded-xl h-48 flex items-center justify-center mb-5">
        <h3 className="text-center font-bold text-xl">IMAGE HERE</h3>
      </div>
      <div className="grid grid-cols-2 gap-2 lg:gap-4">
        {moreInfo.map((item, index) => (
          <div
            className="bg-white shadow-lg p-3 rounded-xl text-center"
            key={index}
          >
            <div className="bg-theme w-12 h-12 rounded-full mx-auto flex items-center justify-center text-gray-100 mb-3">
              {item?.icon}
            </div>
            <span className="font-semibold">{item?.detail}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default VehicleInfo;
