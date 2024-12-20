import { useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import SelectDropDown from "../InputAndDropdown/SelectDropDown";
import Spinner from "../Spinner/Spinner";
import { useParams } from "react-router-dom";
import { endPointBasedOnKey, userType } from "../../Data/commonData";
import { useEffect, useState } from "react";
import { getData } from "../../Data";
import InputSearch from "../InputAndDropdown/InputSearch";

const BookingForm = ({ handleFormSubmit, loading }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [collectedData, setCollectedData] = useState(null);
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();

  const fetchCollectedData = async (vehicleTbUrl) => {
    const vehicleTblResponse = await getData(
      endPointBasedOnKey[vehicleTbUrl],
      token
    );

    if (vehicleTblResponse) {
      return setCollectedData({
        vehicleTableId: vehicleTblResponse?.data,
      });
    }
  };
  console.log(collectedData);
  useEffect(() => {
    fetchCollectedData("vehicleTableId");
  }, []);

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex flex-wrap gap-4">
        {/* for updating the value of the existing one & for creating new one */}
        <>
          <div className="w-full lg:w-[48%]">
            <InputSearch
              item={"User"}
              name={"userId"}
              type="number"
              token={token}
              value={id ? vehicleMaster[0]?.userId : ""}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"vehicleTableId"}
              options={collectedData?.vehicleTableId}
              value={id ? vehicleMaster[0]?.vehicleTableId : ""}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"BookingStartDateAndTime"}
              value={id ? vehicleMaster[0]?.BookingStartDateAndTime : ""}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"BookingEndDateAndTime"}
              value={id ? vehicleMaster[0]?.BookingEndDateAndTime : ""}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"totalPrice"}
              type="number"
              value={id && Number(vehicleMaster[0]?.bookingPrice?.totalPrice)}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"bookingPrice"}
              type="number"
              value={id && Number(vehicleMaster[0]?.bookingPrice?.bookingPrice)}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"tax"}
              type="number"
              value={id && Number(vehicleMaster[0]?.bookingPrice?.tax)}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"extraAddonPrice"}
              type="number"
              value={
                id && Number(vehicleMaster[0]?.bookingPrice?.extraAddonPrice)
              }
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"vehiclePrice"}
              type="number"
              value={id && Number(vehicleMaster[0]?.bookingPrice?.vehiclePrice)}
              require={true}
            />
          </div>
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
              options={["pending", "confirmed"]}
              value={id ? vehicleMaster[0]?.bookingStatus : "confirmed"}
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
