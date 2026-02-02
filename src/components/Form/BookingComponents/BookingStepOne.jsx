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
import { DateRange } from "../../../components/DateTimePicker/DateRange";
import { BookingPlan } from "./BookingPlan";

const BookingStepOne = ({
  data,
  vehicleMaster,
  token,
  onNext,
  setFormData,
}) => {
  const [userId, setUserId] = useState(data?.userId || "");
  const [vehicleId, setVehicleId] = useState(data?.vehicleId || "");
  const [stationId, setStationId] = useState(data?.stationId || "");
  const [bookingStartDate, setBookingStartDate] = useState(
    data?.bookingStartDate || "",
  );
  const [bookingEndDate, setBookingEndDate] = useState(
    data?.bookingEndDate || "",
  );
  const [selectedVehicle, setSlectedVehicle] = useState(
    data?.selectedVehicle || null,
  );
  const [isLocationSelected, setIsLocationSelected] = useState(
    data?.isLocationSelected || "",
  );
  const [duration, setDuration] = useState(data?.duration || 1);

  // const [userId, setUserId] = useState("");
  // const [vehicleId, setVehicleId] = useState("");
  // const [stationId, setStationId] = useState("");
  // const [bookingStartDate, setBookingStartDate] = useState("");
  // const [bookingEndDate, setBookingEndDate] = useState("");
  // const [selectedVehicle, setSlectedVehicle] = useState(null);
  const [loading, setLoading] = useState(null);
  //vehicle suggestion list
  const [suggestedData, setSuggestionData] = useState(null);
  const [collectedData, setCollectedData] = useState(null);
  const [stationData, setStationData] = useState(null);
  const [error, setError] = useState("");
  // const [isLocationSelected, setIsLocationSelected] = useState("");
  // const [duration, setDuration] = useState(1);

  const { loggedInRole, userStation } = useSelector((state) => state.user);
  const { vehiclesFilter } = useSelector((state) => state.pagination);
  const dispatch = useDispatch();

  // Update parent formData whenever any value changes
  useEffect(() => {
    setFormData({
      userId,
      vehicleId,
      stationId,
      bookingStartDate,
      bookingEndDate,
      selectedVehicle,
      isLocationSelected,
      duration,
    });
  }, [
    userId,
    vehicleId,
    stationId,
    bookingStartDate,
    bookingEndDate,
    selectedVehicle,
    isLocationSelected,
    duration,
  ]);

  // const handleNext = () => {
  //   onNext({
  //     userId,
  //     vehicleId,
  //     bookingStartDate,
  //     bookingEndDate,
  //     selectedVehicle,
  //   });
  // };

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

  // getting free vehicle btw two dates through this
  useEffect(() => {
    const fetchData = async () => {
      if (
        (loggedInRole === "admin" &&
          bookingStartDate &&
          bookingEndDate &&
          isLocationSelected &&
          stationId) ||
        (loggedInRole === "manager" && bookingStartDate && bookingEndDate)
      ) {
        const isDateValid = isDuration24Hours(bookingStartDate, bookingEndDate);
        if (!isDateValid) {
          setError("There should be a gap of 1 day between dates.");
          return;
        } else {
          setError("");
        }

        try {
          setLoading(true);
          const changeEndPointBasedOnRole =
            loggedInRole === "manager"
              ? `stationId=${userStation?.stationId}`
              : `stationId=${stationId}`;

          let endpoint = `/getAllVehiclesAvailable?BookingStartDateAndTime=${bookingStartDate}&BookingEndDateAndTime=${bookingEndDate}&${changeEndPointBasedOnRole}&page=1&limit=50`;

          if (vehiclesFilter?.bookingVehicleName !== "") {
            endpoint = `/getAllVehiclesAvailable?BookingStartDateAndTime=${bookingStartDate}&BookingEndDateAndTime=${bookingEndDate}&${changeEndPointBasedOnRole}&search=${vehiclesFilter?.bookingVehicleName}&page=1&limit=50`;
          }

          const response = await getData(endpoint);

          if (response?.status === 200) {
            setSuggestionData(response?.data);
          } else {
            handleAsyncError(dispatch, response?.message);
          }
        } catch (error) {
          handleAsyncError(dispatch, error?.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [
    bookingStartDate,
    bookingEndDate,
    isLocationSelected,
    stationId,
    loggedInRole,
    userStation?.stationId,
    dispatch,
    vehiclesFilter,
  ]);

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
      {/* continue  */}
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
      {/* <div className="w-full lg:w-[48%]">
        <InputDateAndTime
          item={"BookingStartDateAndTime"}
          name={"BookingStartDateAndTime"}
          require={true}
          setValueChanger={setBookingStartDate}
        />
        <p
          className={`italic text-sm ${
            error ? "text-theme" : "text-gray-400"
          } my-1`}
        >
          {error}
        </p>
      </div>
      <div className="w-full lg:w-[48%]">
        <InputDateAndTime
          item={"BookingEndDateAndTime"}
          namme={"BookingEndDateAndTime"}
          require={true}
          setValueChanger={setBookingEndDate}
        />
        <p
          className={`italic text-sm ${
            error ? "text-theme" : "text-gray-400"
          } my-1`}
        >
          {error}
        </p>
      </div> */}
      <DateRange
        {...{ error, setBookingStartDate, setBookingEndDate, duration }}
        className="lg:w-[48%]"
      />
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
        <SelectDropDownVehicle
          item={"Vehicle"}
          name={"vehicleTableId"}
          options={suggestedData}
          setValueChanger={setVehicleId}
          setSelectedChanger={setSlectedVehicle}
          require={true}
        />
      </div>

      <BookingPlan {...{ duration, setDuration }} />

      {/* <button
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
      </button> */}
    </>
  );
};

export default BookingStepOne;
