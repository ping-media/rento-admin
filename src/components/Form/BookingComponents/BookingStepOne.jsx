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

const BookingStepOne = ({ data, vehicleMaster, token, onNext }) => {
  const [userId, setUserId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [stationId, setStationId] = useState("");
  const [bookingStartDate, setBookingStartDate] = useState("");
  const [bookingEndDate, setBookingEndDate] = useState("");
  const [selectedVehicle, setSlectedVehicle] = useState(null);
  const [loading, setLoading] = useState(null);
  //vehicle suggestion list
  const [suggestedData, setSuggestionData] = useState(null);
  const [collectedData, setCollectedData] = useState(null);
  const [stationData, setStationData] = useState(null);
  const [stationLoading, setStationLoading] = useState(null);
  const [isLocationSelected, setIsLocationSelected] = useState("");
  const { loggedInRole, userStation } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleNext = () => {
    onNext({
      userId,
      vehicleId,
      bookingStartDate,
      bookingEndDate,
      selectedVehicle,
    });
  };

  //updating station based on location id
  useEffect(() => {
    if (vehicleMaster?.length == 1 || isLocationSelected !== "") {
      fetchStationBasedOnLocation(
        vehicleMaster,
        isLocationSelected,
        setStationData,
        token,
        setStationLoading
      );
    }
  }, [isLocationSelected, vehicleMaster]);

  // getting free vehicle btw two dates through this
  useEffect(() => {
    if (
      (loggedInRole === "admin" &&
        bookingStartDate !== "" &&
        bookingEndDate !== "" &&
        isLocationSelected !== "" &&
        stationId !== "") ||
      (loggedInRole === "manager" &&
        bookingStartDate !== "" &&
        bookingEndDate !== "")
    ) {
      (async () => {
        try {
          setLoading(true);
          const changeEndPointBasedOnRole =
            loggedInRole === "manager"
              ? `stationId=${userStation?.stationId}`
              : `locationId=${isLocationSelected}&stationId=${stationId}`;

          const response = await getData(
            `/getVehicleTblData?BookingStartDateAndTime=${bookingStartDate}&BookingEndDateAndTime=${bookingEndDate}&${changeEndPointBasedOnRole}`
          );
          if (response?.status == 200) {
            setSuggestionData(response?.data);
          } else {
            handleAsyncError(dispatch, response?.message);
          }
        } catch (error) {
          handleAsyncError(dispatch, error?.message);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [bookingStartDate, bookingEndDate, vehicleId, isLocationSelected]);

  // fetching stationId and LocationId
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

  // only run this if current login user is admin
  useEffect(() => {
    if (loggedInRole === "admin") {
      fetchCollectedData("locationId", "stationId");
    }
  }, []);

  return (
    <>
      {(loading || stationLoading) && <PreLoader />}
      {/* continue  */}
      {loggedInRole === "admin" && (
        <>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"locationId"}
              options={collectedData?.locationId}
              setIsLocationSelected={setIsLocationSelected}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"stationId"}
              options={stationData && stationData}
              setIsLocationSelected={setStationId}
              require={true}
            />
          </div>
        </>
      )}
      <div className="w-full lg:w-[48%]">
        <InputSearch
          item={"User"}
          name={"userId"}
          token={token}
          require={true}
          setValueChanger={setUserId}
        />
      </div>
      <div className="w-full lg:w-[48%]">
        <InputDateAndTime
          item={"BookingStartDateAndTime"}
          name={"BookingStartDateAndTime"}
          require={true}
          setValueChanger={setBookingStartDate}
        />
      </div>
      <div className="w-full lg:w-[48%]">
        <InputDateAndTime
          item={"BookingEndDateAndTime"}
          namme={"BookingEndDateAndTime"}
          require={true}
          setValueChanger={setBookingEndDate}
        />
      </div>
      <div className="w-full lg:w-[48%]">
        <SelectDropDownVehicle
          item={"Vehicle"}
          name={"vehicleTableId"}
          options={suggestedData}
          setValueChanger={setVehicleId}
          setSelectedChanger={setSlectedVehicle}
          require={true}
        />
      </div>
      <button
        className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
        type="button"
        onClick={handleNext}
        disabled={
          userId === "" ||
          vehicleId === "" ||
          bookingStartDate === "" ||
          bookingEndDate === ""
        }
      >
        Continue
      </button>
    </>
  );
};

export default BookingStepOne;
