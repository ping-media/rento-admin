import { useSelector } from "react-redux";
import SelectDropDown from "../../InputAndDropdown/SelectDropDown";

const BookingStepThree = ({ id }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  return (
    <>
      <div className="w-full lg:w-[48%]">
        <SelectDropDown
          item={"paymentMethod"}
          placeholder={"Payment Mode"}
          options={["online", "partiallyPay", "cash"]}
          value={id ? vehicleMaster[0]?.paymentMethod : "online"}
        />
      </div>
      <div className="w-full lg:w-[48%]">
        <SelectDropDown
          item={"bookingStatus"}
          options={["pending", "done", "canceled"]}
          value={id ? vehicleMaster[0]?.bookingStatus : "done"}
        />
      </div>
      <div className="w-full lg:w-[48%]">
        <SelectDropDown
          item={"paymentStatus"}
          options={["pending", "partiallyPay", "paid", "failed", "refunded"]}
          value={id ? vehicleMaster[0]?.paymentStatus : "pending"}
        />
      </div>
      <div className="w-full lg:w-[48%]">
        <SelectDropDown
          item={"rideStatus"}
          options={["pending", "ongoing", "completed", "canceled"]}
          value={id ? vehicleMaster[0]?.rideStatus : "pending"}
        />
      </div>
    </>
  );
};

export default BookingStepThree;
