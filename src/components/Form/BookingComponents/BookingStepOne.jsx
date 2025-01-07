import { useEffect, useState } from "react";
import InputDateAndTime from "../../InputAndDropdown/InputDateAndTime";
import InputSearch from "../../InputAndDropdown/InputSearch";
import SelectDropDownVehicle from "../../InputAndDropdown/SelectDropDownVehicle";
import { getData } from "../../../Data/index";
import { handleAsyncError } from "../../../utils/Helper/handleAsyncError";
import { useDispatch } from "react-redux";

const BookingStepOne = ({ vehicleMaster, token, onNext }) => {
  const [userId, setUserId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [bookingStartDate, setBookingStartDate] = useState("");
  const [bookingEndDate, setBookingEndDate] = useState("");
  const [selectedVehicle, setSlectedVehicle] = useState(null);
  //vehicle suggestion list
  const [suggestedData, setSuggestionData] = useState(null);
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

  useEffect(() => {
    if (bookingStartDate !== "" && bookingEndDate !== "") {
      (async () => {
        const response = await getData(
          `/getVehicleTblData?BookingStartDateAndTime=${bookingStartDate}&BookingEndDateAndTime=${bookingEndDate}`
        );
        if (response?.status == 200) {
          setSuggestionData(response?.data);
        } else {
          handleAsyncError(dispatch, response?.message);
        }
      })();
    }
  }, [bookingStartDate, bookingEndDate]);

  return (
    <>
      <div className="w-full lg:w-[48%]">
        <InputSearch
          item={"User"}
          name={"userId"}
          token={token}
          // value={""}
          require={true}
          setValueChanger={setUserId}
        />
      </div>
      <div className="w-full lg:w-[48%]">
        <InputDateAndTime
          item={"BookingStartDateAndTime"}
          name={"BookingStartDateAndTime"}
          // value={""}
          require={true}
          setValueChanger={setBookingStartDate}
        />
      </div>
      <div className="w-full lg:w-[48%]">
        <InputDateAndTime
          item={"BookingEndDateAndTime"}
          namme={"BookingEndDateAndTime"}
          // value={""}
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
