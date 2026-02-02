import { useEffect, useState } from "react";
import InputDateAndTime from "../../InputAndDropdown/InputDateAndTime";
import InputSearch from "../../InputAndDropdown/InputSearch";
import SelectDropDownVehicle from "../../InputAndDropdown/SelectDropDownVehicle";
import { getData } from "../../../Data/index";
import { handleAsyncError } from "../../../utils/Helper/handleAsyncError";
import { useDispatch, useSelector } from "react-redux";
import PreLoader from "../../Skeleton/PreLoader";
import { endPointBasedOnKey } from "../../../Data/commonData";
import SelectDropDown from "../../InputAndDropdown/SelectDropDown";
import { fetchStationBasedOnLocation } from "../../../Data/Function";
import { isDuration24Hours } from "../../../utils/index";

export const BookingForm = () => {
  const { loggedInRole, userStation, token } = useSelector(
    (state) => state.user,
  );

  const [stationId, setStationId] = useState("");
  const [loading, setLoading] = useState(null);
  const [collectedData, setCollectedData] = useState(null);
  const [stationData, setStationData] = useState(null);
  const [isLocationSelected, setIsLocationSelected] = useState("");

  //updating station based on location id
  useEffect(() => {
    if (isLocationSelected !== "") {
      fetchStationBasedOnLocation(
        vehicleMaster,
        isLocationSelected,
        setStationData,
        token,
        setLoading,
      );
    }
  }, [isLocationSelected]);

  // fetching stationId and LocationId
  const fetchCollectedData = async (locationUrl) => {
    const locationResponse = await getData(
      endPointBasedOnKey[locationUrl],
      token,
    );

    if (locationResponse) {
      return setCollectedData({
        locationId: locationResponse?.data,
      });
    }
  };

  useEffect(() => {
    if (loggedInRole === "admin") {
      fetchCollectedData("locationId");
    }
  }, []);

  return (
    <>
      {loading && <PreLoader />}

      {loggedInRole === "admin" && (
        <>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"locationId"}
              options={collectedData?.locationId?.filter(
                (location) => location?.locationStatus !== "inactive",
              )}
              setIsLocationSelected={setIsLocationSelected}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"stationId"}
              options={
                stationData &&
                stationData.filter((station) => station?.status !== "inactive")
              }
              setIsLocationSelected={setStationId}
              require={true}
            />
          </div>
        </>
      )}
    </>
  );
};
