import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import Spinner from "../Spinner/Spinner";
import SelectDropDown from "../InputAndDropdown/SelectDropDown";
import { getData } from "../../Data";
import { endPointBasedOnKey } from "../../Data/commonData";
import PreLoader from "../Skeleton/PreLoader";
import { useParams } from "react-router-dom";

const VehicleForm = ({ handleFormSubmit, loading }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [collectedData, setCollectedData] = useState(null);
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();

  const fetchCollectedData = async (stationUrl, vehicleMasterUrl) => {
    const stationResponse = await getData(
      endPointBasedOnKey[stationUrl],
      token
    );
    const vehicleMasterResponse = await getData(
      endPointBasedOnKey[vehicleMasterUrl],
      token
    );

    if (vehicleMasterResponse && stationResponse) {
      return setCollectedData({
        stationId: stationResponse?.data,
        vehicleMasterId: vehicleMasterResponse?.data,
      });
    }
  };
  useEffect(() => {
    fetchCollectedData("stationId", "vehicleMasterId");
    console.log(collectedData);
  }, []);

  return collectedData != null ? (
    <form onSubmit={handleFormSubmit}>
      <div className="flex flex-wrap gap-4">
        {/* for updating the value of the existing one  */}

        <>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"stationId"}
              options={collectedData?.stationId}
              value={id && vehicleMaster[0]?.stationId}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"vehicleMasterId"}
              options={collectedData?.vehicleMasterId}
              value={id && vehicleMaster[0]?.vehicleMasterId}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"vehicleNumber"}
              value={id && vehicleMaster[0]?.vehicleNumber}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input item={"freeKms"} value={id && vehicleMaster[0]?.freeKms} />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"extraKmsCharges"}
              value={id && vehicleMaster[0]?.extraKmsCharges}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"vehicleModel"}
              value={id && vehicleMaster[0]?.vehicleModel}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"vehicleColor"}
              value={id && vehicleMaster[0]?.vehicleColor}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"perDayCost"}
              type="number"
              value={id && vehicleMaster[0]?.perDayCost}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"lastServiceDate"}
              type="date"
              value={id && vehicleMaster[0]?.lastServiceDate}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input item={"kmsRun"} value={id && vehicleMaster[0]?.kmsRun} />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"isBooked"}
              options={["true", "false"]}
              value={id && vehicleMaster[0]?.isBooked}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"condition"}
              options={["new", "old"]}
              value={id && vehicleMaster[0]?.condition}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"vehicleBookingStatus"}
              options={["available", "booked"]}
              value={id && vehicleMaster[0]?.vehicleBookingStatus}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"vehicleStatus"}
              options={["active", "inActive"]}
              value={id && vehicleMaster[0]?.vehicleStatus}
            />
          </div>
        </>

        <button
          className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
          type="submit"
          disabled={loading}
        >
          {loading ? <Spinner message={"uploading"} /> : "Publish"}
        </button>
      </div>
    </form>
  ) : (
    <PreLoader />
  );
};

export default VehicleForm;
