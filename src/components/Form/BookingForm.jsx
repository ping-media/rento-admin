import { useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import SelectDropDown from "../InputAndDropdown/SelectDropDown";
import Spinner from "../Spinner/Spinner";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import InputSearch from "../InputAndDropdown/InputSearch";
import InputVehicleSearch from "../InputAndDropdown/InputVehicleSearch";
import InputDateAndTime from "../InputAndDropdown/InputDateAndTime";
import { calculateTax, getDurationBetweenDates } from "../../utils";
import BookingStepOne from "./BookingComponents/BookingStepOne";
import BookingStepTwo from "./BookingComponents/BookingStepTwo";
import BookingStepThree from "./BookingComponents/BookingStepThree";

const BookingForm = ({ handleFormSubmit, loading }) => {
  // const [collectedData, setCollectedData] = useState(null);
  const { token } = useSelector((state) => state.user);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    stepOneData: {},
    stepTwoData: {},
    StepThreeData: {},
  });
  const handleNext = (data) => {
    if (currentStep === 1) setFormData({ ...formData, stepOneData: data });
    if (currentStep === 2) setFormData({ ...formData, stepTwoData: data });
    setCurrentStep(currentStep + 1);
  };

  const changePriceAccordingtoData = ({
    bookingStartDate,
    bookingEndDate,
    selectedVehicle,
  }) => {
    const durationBetweenStartAndEnd = getDurationBetweenDates(
      bookingStartDate,
      bookingEndDate
    );
    const bookingPrice =
      Number(durationBetweenStartAndEnd?.days) *
      Number(selectedVehicle?.perDayCost);
    const extraAddonPrice = 0;
    const tax = calculateTax(bookingPrice, 18);
    const totalPrice = bookingPrice + tax;
    const combinedData = { bookingPrice, extraAddonPrice, tax, totalPrice };
    return setFormData({ ...formData, stepTwoData: combinedData });
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  console.log(formData);

  const handleSubmit = (data) => {
    // Save the last step's data and handle final submission
    setFormData({ ...formData, stepThreeData: data });
    console.log("Form submitted: ", { ...formData, stepThreeData: data });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex flex-wrap gap-4">
        {/* for updating the value of the existing one & for creating new one */}
        <>
          {currentStep === 1 && (
            <BookingStepOne
              token={token}
              onNext={handleNext}
              priceCalculate={changePriceAccordingtoData}
            />
          )}

          {currentStep === 2 && (
            <BookingStepTwo
              data={formData?.stepTwoData}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}

          {currentStep === 3 && (
            <BookingStepThree onPrevious={handlePrevious} />
          )}
        </>
      </div>
      {currentStep === 3 && (
        <button
          className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
          type="submit"
          disabled={loading}
        >
          {loading ? <Spinner message={"uploading"} /> : "Publish"}
        </button>
      )}
    </form>
  );
};

export default BookingForm;
