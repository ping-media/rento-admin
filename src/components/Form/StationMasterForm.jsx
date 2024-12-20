import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import Spinner from "../Spinner/Spinner";
import SelectDropDown from "../InputAndDropdown/SelectDropDown";
import { getData } from "../../Data";
import { endPointBasedOnKey, States } from "../../Data/commonData";
import PreLoader from "../Skeleton/PreLoader";
import { useParams } from "react-router-dom";

const StationMasterForm = ({ handleFormSubmit, loading }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [collectedData, setCollectedData] = useState(null);
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();

  const fetchCollectedData = async (userUrl, locationUrl, stationUrl) => {
    const userResponse = await getData(endPointBasedOnKey[userUrl], token);
    const locationResponse = await getData(
      endPointBasedOnKey[locationUrl],
      token
    );
    const stationResponse = await getData(
      endPointBasedOnKey[stationUrl],
      token
    );

    if (userResponse && locationResponse && stationResponse) {
      return setCollectedData({
        userId: userResponse?.data,
        locationId: locationResponse?.data,
        stationId: stationResponse?.data,
      });
    }
  };
  useEffect(() => {
    fetchCollectedData("userId", "locationId", "stationId");
  }, []);

  return collectedData != null ? (
    <form onSubmit={handleFormSubmit}>
      <div className="flex flex-wrap gap-4">
        {/* for updating the value of the existing one  */}

        <>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"userId"}
              options={collectedData?.userId}
              value={id && vehicleMaster[0]?.userId}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"locationId"}
              options={collectedData?.locationId}
              value={id && vehicleMaster[0]?.locationId}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"stationName"}
              value={id && vehicleMaster[0]?.stationName}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input item={"address"} value={id && vehicleMaster[0]?.address} />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input item={"city"} value={id && vehicleMaster[0]?.city} />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"state"}
              options={States}
              value={id && vehicleMaster[0]?.state}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"pinCode"}
              type="number"
              value={id && Number(vehicleMaster[0]?.pinCode)}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"latitude"}
              type="number"
              value={id ? Number(vehicleMaster[0]?.latitude) : 12.971599}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"longitude"}
              type="number"
              value={id ? Number(vehicleMaster[0]?.longitude) : 77.594566}
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

export default StationMasterForm;
