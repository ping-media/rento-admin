import SelectDropDown from "../../InputAndDropdown/SelectDropDown";

const BookingStepThree = () => {
  return (
    <>
      <div className="w-full lg:w-[48%]">
        <SelectDropDown
          item={"paymentMethod"}
          options={["cash", "online", "partiallyPay"]}
          value={"online"}
        />
      </div>
      <div className="w-full lg:w-[48%]">
        <SelectDropDown
          item={"bookingStatus"}
          options={["pending", "done", "canceled"]}
          value={"done"}
        />
      </div>
      <div className="w-full lg:w-[48%]">
        <SelectDropDown
          item={"paymentStatus"}
          options={["pending", "confirmed"]}
          value={"pending"}
        />
      </div>
      <div className="w-full lg:w-[48%]">
        <SelectDropDown
          item={"rideStatus"}
          options={["pending", "confirmed"]}
          value={"pending"}
        />
      </div>
    </>
  );
};

export default BookingStepThree;
