import { useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import SelectDropDown from "../InputAndDropdown/SelectDropDown";
import Spinner from "../Spinner/Spinner";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import InputSearch from "../InputAndDropdown/InputSearch";
import InputVehicleSearch from "../InputAndDropdown/inputVehicleSearch";
import InputDateAndTime from "../InputAndDropdown/InputDateAndTime";
import { calculateTax } from "../../utils";

const BookingForm = ({ handleFormSubmit, loading }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [collectedData, setCollectedData] = useState(null);
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();
  const [bookingPrice, setBookingPrice] = useState(0);
  const [extraAddonPrice, setExtraAddonPrice] = useState(0);
  const [inputTax, setInputTax] = useState(0);
  const [inputTotal, setInputTotal] = useState(0);

  useEffect(() => {
    // Create a debounced effect using setTimeout
    const debounceTimeout = setTimeout(() => {
      if (bookingPrice !== 0 || extraAddonPrice !== 0) {
        const bookingTax = calculateTax(Number(bookingPrice), 18);
        const extraTax =
          extraAddonPrice !== 0 ? calculateTax(Number(extraAddonPrice), 18) : 0;

        if (bookingTax) {
          const totalPrice =
            Number(bookingPrice) + Number(extraTax) + Number(bookingTax);
          setInputTax(bookingTax);
          setInputTotal(totalPrice);
          // console.log(bookingTax, totalPrice);
        }
      } else {
        setInputTax(0);
        setInputTotal(0);
      }
    }, 300); // Debounce delay (in milliseconds)

    // Cleanup the timeout when component unmounts or when inputs change
    return () => clearTimeout(debounceTimeout);
  }, [bookingPrice, extraAddonPrice, inputTax, inputTotal]);

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex flex-wrap gap-4">
        {/* for updating the value of the existing one & for creating new one */}
        <>
          <div className="w-full lg:w-[48%]">
            <InputSearch
              item={"User"}
              name={"userId"}
              token={token}
              value={id ? vehicleMaster[0]?.userId : ""}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <InputVehicleSearch
              item={"Vehicle"}
              name={"vehicleTableId"}
              token={token}
              value={id ? vehicleMaster[0]?.vehicleTableId : ""}
              suggestedData={collectedData}
              setSuggestionData={setCollectedData}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <InputDateAndTime
              item={"BookingStartDateAndTime"}
              value={id ? vehicleMaster[0]?.BookingStartDateAndTime : ""}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <InputDateAndTime
              item={"BookingEndDateAndTime"}
              value={id ? vehicleMaster[0]?.BookingEndDateAndTime : ""}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"bookingPrice"}
              type="number"
              value={id && Number(vehicleMaster[0]?.bookingPrice?.bookingPrice)}
              require={true}
              setValueChange={setBookingPrice}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"extraAddonPrice"}
              type="number"
              value={
                id && Number(vehicleMaster[0]?.bookingPrice?.extraAddonPrice)
              }
              setBookingPrice={setExtraAddonPrice}
            />
          </div>
          {inputTax && inputTotal && (
            <>
              <div className="w-full lg:w-[48%]">
                <Input
                  item={"tax"}
                  type="number"
                  value={
                    id
                      ? Number(vehicleMaster[0]?.bookingPrice?.tax)
                      : Number(inputTax)
                  }
                  require={true}
                  disabled={true}
                />
              </div>
              <div className="w-full lg:w-[48%]">
                <Input
                  item={"totalPrice"}
                  type="number"
                  value={
                    id
                      ? Number(vehicleMaster[0]?.bookingPrice?.totalPrice)
                      : Number(inputTotal)
                  }
                  require={true}
                  disabled={true}
                />
              </div>
            </>
          )}
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"paymentMethod"}
              options={["cash", "online", "partiallyPay"]}
              value={id ? vehicleMaster[0]?.paymentMethod : "cash"}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"bookingStatus"}
              options={["pending", "done"]}
              value={id ? vehicleMaster[0]?.bookingStatus : "done"}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"paymentStatus"}
              options={["pending", "confirmed"]}
              value={id ? vehicleMaster[0]?.paymentStatus : "pending"}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"rideStatus"}
              options={["pending", "confirmed"]}
              value={id ? vehicleMaster[0]?.rideStatus : "pending"}
            />
          </div>
          {id && (
            <>
              <div className="w-full lg:w-[48%]">
                <Input
                  item={"payInitFrom"}
                  value={id ? vehicleMaster[0]?.payInitFrom : "cash"}
                />
              </div>
              <div className="w-full lg:w-[48%]">
                <Input
                  item={"paySuccessId"}
                  type="number"
                  value={id ? vehicleMaster[0]?.paySuccessId : "assa"}
                />
              </div>
            </>
          )}
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

export default BookingForm;
