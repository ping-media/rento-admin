import { useState } from "react";
import InputDateAndTime from "../../InputAndDropdown/InputDateAndTime";
import InputSearch from "../../InputAndDropdown/InputSearch";
import InputVehicleSearch from "../../InputAndDropdown/InputVehicleSearch";

const BookingStepOne = ({ vehicleMaster, token, onNext, priceCalculate }) => {
  const [userId, setUserId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [bookingStartDate, setBookingStartDate] = useState("");
  const [bookingEndDate, setBookingEndDate] = useState("");
  const [selectedVehicle, setSlectedVehicle] = useState(null);
  //vehicle suggestion list
  const [suggestedData, setSuggestionData] = useState(null);

  const handleNext = () => {
    onNext({
      userId,
      vehicleId,
      bookingStartDate,
      bookingEndDate,
      selectedVehicle,
    });
    priceCalculate({
      userId,
      vehicleId,
      bookingStartDate,
      bookingEndDate,
      selectedVehicle,
    });
  };
  return (
    <>
      <div className="w-full lg:w-[48%]">
        <InputSearch
          item={"User"}
          name={"userId"}
          token={token}
          value={""}
          require={true}
          setValueChanger={setUserId}
        />
      </div>
      <div className="w-full lg:w-[48%]">
        <InputVehicleSearch
          item={"Vehicle"}
          name={"vehicleTableId"}
          token={token}
          value={""}
          require={true}
          suggestedData={suggestedData}
          setSuggestionData={setSuggestionData}
          setValueChanger={setVehicleId}
          setSlectedVehicle={setSlectedVehicle}
        />
      </div>
      <div className="w-full lg:w-[48%]">
        <InputDateAndTime
          item={"BookingStartDateAndTime"}
          name={"BookingStartDateAndTime"}
          value={""}
          require={true}
          setValueChanger={setBookingStartDate}
        />
      </div>
      <div className="w-full lg:w-[48%]">
        <InputDateAndTime
          item={"BookingEndDateAndTime"}
          namme={"BookingEndDateAndTime"}
          value={""}
          require={true}
          setValueChanger={setBookingEndDate}
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
