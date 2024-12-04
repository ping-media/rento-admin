import { useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import SelectDropDown from "../InputAndDropdown/SelectDropDown";
import Spinner from "../Spinner/Spinner";
import { useParams } from "react-router-dom";
import { endPointBasedOnKey, userType } from "../../Data/commonData";
import { useEffect, useState } from "react";
import { getData } from "../../Data";

const BookingForm = ({ handleFormSubmit, loading }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [collectedData, setCollectedData] = useState(null);
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();

  const fetchCollectedData = async (vehicleUrl, vehicleTbUrl, userUrl) => {
    const userResponse = await getData(endPointBasedOnKey[userUrl], token);
    const vehicleTblResponse = await getData(
      endPointBasedOnKey[vehicleTbUrl],
      token
    );
    const vehicleResponse = await getData(
      endPointBasedOnKey[vehicleUrl],
      token
    );

    if (userResponse && vehicleTblResponse && vehicleResponse) {
      return setCollectedData({
        userId: userResponse?.data,
        vehicleTableId: vehicleTblResponse?.data,
        vehicleMasterId: vehicleResponse?.data,
      });
    }
  };
  useEffect(() => {
    fetchCollectedData("vehicleMasterId", "vehicleTableId", "userIdAll");
  }, []);
  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex flex-wrap gap-4">
        {/* for updating the value of the existing one & for creating new one */}
        <>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"vehicleMasterId"}
              options={collectedData?.vehicleMasterId}
              value={id ? vehicleMaster[0]?.vehicleMasterId : ""}
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
            <SelectDropDown
              item={"userId"}
              options={collectedData?.userId}
              value={id ? vehicleMaster[0]?.userId : ""}
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
              value={id ? vehicleMaster[0]?.bookingPrice?.totalPrice : ""}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"bookingPrice"}
              type="number"
              value={id ? vehicleMaster[0]?.bookingPrice?.bookingPrice : ""}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"tax"}
              type="number"
              value={id ? vehicleMaster[0]?.bookingPrice?.tax : ""}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"roundPrice"}
              type="number"
              value={id ? vehicleMaster[0]?.bookingPrice?.roundPrice : ""}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"extraAddonPrice"}
              type="number"
              value={id ? vehicleMaster[0]?.bookingPrice?.extraAddonPrice : ""}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"vehiclePrice"}
              type="number"
              value={id ? vehicleMaster[0]?.bookingPrice?.vehiclePrice : ""}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"bookingStatus"}
              options={["pending", "confirmed"]}
              value={id ? vehicleMaster[0]?.bookingStatus : ""}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"paymentStatus"}
              options={["pending", "confirmed"]}
              value={id ? vehicleMaster[0]?.paymentStatus : ""}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"rideStatus"}
              options={["pending", "confirmed"]}
              value={id ? vehicleMaster[0]?.rideStatus : ""}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"paymentMethod"}
              options={["cash", "online"]}
              value={id ? vehicleMaster[0]?.paymentMethod : ""}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"payInitFrom"}
              type="number"
              value={id ? vehicleMaster[0]?.payInitFrom : "Razor pay"}
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
