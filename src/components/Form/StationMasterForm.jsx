import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import Spinner from "../Spinner/Spinner";
import SelectDropDown from "../InputAndDropdown/SelectDropDown";
import { getData } from "../../Data";
import { endPointBasedOnKey, States } from "../../Data/commonData";
import PreLoader from "../Skeleton/PreLoader";
import { useParams } from "react-router-dom";
import InputSearch from "../InputAndDropdown/InputSearch";
import { formatHourToTime } from "../../utils/index";
import GoogleSearchLocation from "../../components/InputAndDropdown/GoogleSearchLocation";

const StationMasterForm = ({ handleFormSubmit, loading }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [collectedData, setCollectedData] = useState(null);
  const [zipCodeValue, setZipcodeValue] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();

  const fetchCollectedData = async (locationUrl, stationUrl) => {
    const locationResponse = await getData(
      endPointBasedOnKey[locationUrl],
      token
    );
    const stationResponse = await getData(
      endPointBasedOnKey[stationUrl],
      token
    );

    if (locationResponse && stationResponse) {
      return setCollectedData({
        locationId: locationResponse?.data,
        stationId: stationResponse?.data,
      });
    }
  };

  useEffect(() => {
    fetchCollectedData("locationId", "stationId");
  }, []);

  return collectedData != null ? (
    <form onSubmit={handleFormSubmit}>
      <p className="text-xs mt-1 text-gray-500 font-semibold italic mb-1">
        Note: (Always add time in round, Like 10:00 AM, 11:00 AM etc.)
      </p>
      <div className="flex flex-wrap gap-4">
        {/* for updating the value of the existing one  */}

        <>
          <div className="w-full lg:w-[48%]">
            <InputSearch
              item={"User"}
              name={"userId"}
              token={token}
              value={id ? vehicleMaster[0]?.userId?._id : ""}
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
              item={"openStartTime"}
              type="time"
              value={id && formatHourToTime(vehicleMaster[0]?.openStartTime)}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"openEndTime"}
              type="time"
              value={id && formatHourToTime(vehicleMaster[0]?.openEndTime)}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"stationName"}
              value={id && vehicleMaster[0]?.stationName}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            {/* sending lat & long in backend  */}
            <input
              type="hidden"
              name="latitude"
              value={id ? Number(vehicleMaster[0]?.latitude) : latitude}
            />
            <input
              type="hidden"
              name="longitude"
              value={id ? Number(vehicleMaster[0]?.longitude) : longitude}
            />
            {/* seaching address & lat & long  */}
            <GoogleSearchLocation
              item={"address"}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              value={id && vehicleMaster[0]?.address}
            />
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
            <input
              type="hidden"
              name="stationId"
              value={id ? vehicleMaster[0]?.stationId : zipCodeValue}
            />
            <Input
              item={"pinCode"}
              type="number"
              value={id && Number(vehicleMaster[0]?.pinCode)}
              setValueChange={setZipcodeValue}
            />
          </div>
        </>

        <button
          className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <Spinner message={"uploading"} />
          ) : id ? (
            "Update"
          ) : (
            "Add New"
          )}
        </button>
      </div>
    </form>
  ) : (
    <PreLoader />
  );
};

export default StationMasterForm;
