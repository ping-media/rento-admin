import { useState } from "react";
import Input from "../../InputAndDropdown/Input";

const BookingStepTwo = ({ data, onNext, onPrevious }) => {
  const [extaAddonPrice, setExtaAddonPrice] = useState("");

  const handleNext = () => {
    // onNext({ data });
  };
  return (
    <>
      <div className="w-full lg:w-[48%]">
        <Input
          item={"bookingPrice"}
          type="number"
          value={data && data?.bookingPrice}
          require={true}
          //   setValueChange={setBookingPrice}
        />
      </div>
      <div className="w-full lg:w-[48%]">
        <Input
          item={"extraAddonPrice"}
          type="number"
          value={data && data?.extaAddonPrice}
          //   setBookingPrice={setExtraAddonPrice}
        />
      </div>

      <div className="w-full lg:w-[48%]">
        <Input
          item={"tax"}
          type="number"
          value={data && data?.tax}
          require={true}
          disabled={true}
        />
      </div>
      <div className="w-full lg:w-[48%]">
        <Input
          item={"totalPrice"}
          type="number"
          value={data && data?.totalPrice}
          require={true}
          disabled={true}
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
          type="button"
          onClick={onPrevious}
        >
          Previous
        </button>
        <button
          className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
          type="button"
          onClick={handleNext}
        >
          Continue
        </button>
      </div>
    </>
  );
};

export default BookingStepTwo;
