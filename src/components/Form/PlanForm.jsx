import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import SelectDropDown from "../InputAndDropdown/SelectDropDown";
import Spinner from "../Spinner/Spinner";
import { useParams } from "react-router-dom";
import { getData } from "../../Data";
import { endPointBasedOnKey } from "../../Data/commonData";
// import { activeStatus, options, userType } from "../../Data/commonData";

const PlanForm = ({ handleFormSubmit, loading }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [collectedData, setCollectedData] = useState([]);
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);

  const fetchCollectedData = async (stationUrl, vehicleMasterUrl) => {
    const stationResponse = await getData(
      endPointBasedOnKey[stationUrl],
      token
    );
    const vehicleResponse = await getData(
      endPointBasedOnKey[vehicleMasterUrl],
      token
    );

    if (stationResponse && vehicleResponse) {
      return setCollectedData({
        stationId: stationResponse?.data,
        vehicleMasterId: vehicleResponse?.data,
      });
    }
  };
  useEffect(() => {
    fetchCollectedData("stationId", "vehicleMasterId");
  }, []);

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex flex-wrap gap-4">
        {/* for updating the value of the existing one & for creating new one */}
        <>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"stationId"}
              options={(collectedData && collectedData?.stationId) || []}
              value={id ? vehicleMaster[0]?.stationId : ""}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"vehicleMasterId"}
              options={(collectedData && collectedData?.vehicleMasterId) || []}
              value={id ? vehicleMaster[0]?.vehicleMasterId : ""}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"planName"}
              value={id ? vehicleMaster[0]?.planName : ""}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"planDuration"}
              value={id ? vehicleMaster[0]?.planDuration : ""}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"planPrice"}
              value={id ? vehicleMaster[0]?.planPrice : ""}
            />
          </div>
        </>
      </div>
      <button
        className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
        type="submit"
        disabled={loading}
      >
        {loading ? <Spinner message={"uploading"} /> : "Publish"}
      </button>
    </form>
  );
};

export default PlanForm;
