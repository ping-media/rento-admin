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
import GeneralAddOn from "../../components/general/GeneralAddOn";
import PaymentToggler from "../station/PaymentToggler";
import DatePicker from "../../components/DateTimePicker/DateTimePicker";

const StationMasterForm = ({ handleFormSubmit, loading }) => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [collectedData, setCollectedData] = useState(null);
  const [zipCodeValue, setZipcodeValue] = useState(null);
  // station open and close time
  const [openStationTime, setOpenStationTime] = useState(null);
  const [closeStationTime, setCloseStationTime] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [cityValue, setCityValue] = useState("");

  const fetchCollectedData = async (locationUrl, stationUrl) => {
    const locationResponse = await getData(
      `${endPointBasedOnKey[locationUrl]}?fetchAll=true`,
      token,
    );
    const stationResponse = await getData(
      `${endPointBasedOnKey[stationUrl]}?fetchAll=true`,
      token,
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

  // updating the station opening and closing time here
  useEffect(() => {
    if (id) {
      if (vehicleMaster?.[0]?.openStartTime) {
        const stationOpenTime = formatHourToTime(
          vehicleMaster[0].openStartTime,
        );
        setOpenStationTime(stationOpenTime);
      }
      if (vehicleMaster?.[0]?.openEndTime) {
        const stationCloseTime = formatHourToTime(vehicleMaster[0].openEndTime);
        setCloseStationTime(stationCloseTime);
      }
    }
  }, [id, vehicleMaster?.[0]?.openStartTime, vehicleMaster?.[0]?.openEndTime]);

  if (vehicleMaster?.length === 0) {
    return <PreLoader />;
  }

  return collectedData != null ? (
    <>
      {/* station form  */}
      <form onSubmit={handleFormSubmit} className="mb-5">
        {/* <p className="text-xs mt-1 text-gray-500 font-semibold italic mb-1">
          Note: (Always add time in round, Like 10:00 AM, 11:00 AM etc.)
        </p> */}

        <div className="flex flex-wrap gap-4">
          <>
            <div className="w-full lg:w-[48%]">
              <InputSearch
                item={"User"}
                placeholder={"Select Manager"}
                name={"userId"}
                token={token}
                value={id ? vehicleMaster[0]?.userId?.[0]?._id : ""}
                require={true}
              />
            </div>
            <div className="w-full lg:w-[48%]">
              <SelectDropDown
                item={"locationId"}
                options={collectedData?.locationId?.filter(
                  (location) => location?.locationStatus !== "inactive",
                )}
                value={id && vehicleMaster[0]?.locationId}
                setCity={setCityValue}
                require={true}
                placeholder={"City"}
              />
            </div>
            <div className="w-full lg:w-[48%]">
              <TimePicker
                label="Select Station Open Time"
                timeValue={openStationTime}
                setValueChange={setOpenStationTime}
                item="openStartTime"
              />
              {/* <Input
                item={"openStartTime"}
                type="time"
                value={id && formatHourToTime(vehicleMaster[0]?.openStartTime)}
                require={true}
                placeholder={"Select Station Open Time"}
                isFull={false}
              /> */}
            </div>
            <div className="w-full lg:w-[48%]">
              <TimePicker
                label="Select Station Close Time"
                timeValue={closeStationTime}
                setValueChange={setCloseStationTime}
                item="openEndTime"
              />
              {/* <Input
                item={"openEndTime"}
                type="time"
                value={id && formatHourToTime(vehicleMaster[0]?.openEndTime)}
                require={true}
                placeholder={"Select Station Close Time"}
                isFull={false}
              /> */}
            </div>
            <div className="w-full lg:w-[48%]">
              <Input
                item={"stationName"}
                value={id && vehicleMaster[0]?.stationName}
                require={true}
              />
            </div>
            <div className="w-full lg:w-[48%]">
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
              <input
                type="hidden"
                name="mapLink"
                value={id ? vehicleMaster[0]?.mapLink || mapUrl : mapUrl}
              />
              <input
                type="hidden"
                name="city"
                value={id ? vehicleMaster[0]?.city || cityValue : cityValue}
              />
              {/* seaching address & lat & long  */}
              <GoogleSearchLocation
                item={"address"}
                setLatitude={setLatitude}
                setLongitude={setLongitude}
                setUrl={setMapUrl}
                value={id && vehicleMaster[0]?.address}
              />
            </div>
            <div className="w-full lg:w-[48%]">
              <SelectDropDown
                item={"state"}
                options={States}
                value={id && vehicleMaster[0]?.state}
                require={true}
              />
            </div>
            <div className="w-full lg:w-[48%]">
              <SelectDropDown
                item={"weekendPriceIncrease"}
                options={["active", "inactive"]}
                value={id && vehicleMaster[0]?.weekendPriceIncrease}
                isSearchEnable={false}
                require={true}
              />
            </div>
            <div className="w-full lg:w-[48%]">
              <SelectDropDown
                item={"weekendPriceType"}
                options={["percentage", "fixed"]}
                value={id && vehicleMaster[0]?.weekendPriceType}
                isSearchEnable={false}
                require={true}
              />
            </div>
            <div className="w-full lg:w-[48%]">
              <Input
                item={"weekendPercentage"}
                value={id && vehicleMaster[0]?.weekendPercentage}
                type="number"
                placeholder="Weekend Amount or Percentage"
                require={true}
              />
            </div>
            <div className="w-full lg:w-[48%]">
              <SelectDropDown
                item={"isGstActive"}
                options={["active", "inactive"]}
                value={id && vehicleMaster[0]?.isGstActive}
                isSearchEnable={false}
                require={true}
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
                require={true}
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

      {id && <PaymentToggler />}

      {/* addon form  */}
      {id && <GeneralAddOn />}
    </>
  ) : (
    <PreLoader />
  );
};

export default StationMasterForm;

const TimePicker = ({
  label,
  timeValue,
  setValueChange,
  item,
  isRequire = true,
}) => {
  return (
    <div className="w-full relative">
      <label
        htmlFor={"openStartTime"}
        className="block text-gray-800 font-semibold text-sm capitalize text-left"
      >
        {label} {isRequire && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-2">
        <DatePicker
          timeValue={timeValue}
          setTimeValueChanger={setValueChange}
          name={item}
          timeOnly
          hourlyOnly
        />
      </div>
    </div>
  );
};
