import { useEffect, useState } from "react";
import Input from "../../InputAndDropdown/Input";
import PreLoader from "../../Skeleton/PreLoader";

const BookingStepTwo = ({ data, onNext, onPrevious, priceCalculate }) => {
  const [stepTwoData, setStepTwoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extraAddonPrice, setExtraAddonPrice] = useState("");

  useEffect(() => {
    if (!data) return;

    let timeoutId; // To store the timeout reference

    const { bookingStartDate, bookingEndDate, selectedVehicle } = data;

    const calculatePrice = () => {
      setLoading(true);
      const newData = priceCalculate(
        bookingStartDate,
        bookingEndDate,
        selectedVehicle,
        Number(extraAddonPrice)
      );
      setStepTwoData(newData);
      setLoading(false);
    };

    calculatePrice(); // Initial calculation
    timeoutId = setTimeout(() => {
      calculatePrice();
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [data, extraAddonPrice]);

  const handleNext = () => {
    onNext();
  };
  return !loading && stepTwoData != null ? (
    <>
      <div className="w-full lg:w-[48%]">
        <Input
          item={"bookingPrice"}
          type="number"
          value={stepTwoData && stepTwoData?.bookingPrice}
          require={true}
          //   setValueChange={setBookingPrice}
        />
      </div>
      <div className="w-full lg:w-[48%]">
        <Input
          item={"extraAddonPrice"}
          type="number"
          value={stepTwoData && stepTwoData?.extaAddonPrice}
          setValueChange={setExtraAddonPrice}
        />
      </div>

      <div className="w-full lg:w-[48%]">
        <Input
          item={"tax"}
          type="number"
          value={stepTwoData && stepTwoData?.tax}
          require={true}
          disabled={true}
        />
      </div>
      <div className="w-full lg:w-[48%]">
        <Input
          item={"totalPrice"}
          type="number"
          value={stepTwoData && stepTwoData?.totalPrice}
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
  ) : (
    <PreLoader />
  );
};

export default BookingStepTwo;
