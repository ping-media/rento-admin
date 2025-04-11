import { useEffect, useState } from "react";
import Input from "../../InputAndDropdown/Input";
import PreLoader from "../../Skeleton/PreLoader";
import { formatPrice } from "../../../utils/index";
import SelectDropDown from "../../InputAndDropdown/SelectDropDown";

const BookingStepTwo = ({ data, onNext, priceCalculate }) => {
  const [stepTwoData, setStepTwoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extraAddonPrice, setExtraAddonPrice] = useState(0);
  const extraHelmetCharge = 50;

  useEffect(() => {
    if (!data) return;

    try {
      setLoading(true);
      const { bookingStartDate, bookingEndDate, selectedVehicle } = data;

      if (!bookingStartDate || !bookingEndDate || !selectedVehicle) return;

      const newData = priceCalculate(
        bookingStartDate,
        bookingEndDate,
        selectedVehicle,
        Number(extraAddonPrice)
      );
      setStepTwoData(newData);
    } finally {
      setLoading(false);
    }
  }, [
    data?.bookingStartDate,
    data?.bookingEndDate,
    data?.selectedVehicle,
    extraAddonPrice,
  ]);

  const handleNext = () => {
    onNext();
  };
  return !loading && stepTwoData != null ? (
    <>
      <div className="w-full lg:w-[48%]">
        <Input
          item={"bookingPrice"}
          type="number"
          value={Number(stepTwoData?.bookingPrice) ?? ""}
          require={true}
          disabled={true}
        />
      </div>
      <div className="w-full lg:w-[48%]">
        <Input
          item={"tax"}
          type="number"
          value={Number(stepTwoData?.tax) ?? ""}
          require={true}
          disabled={true}
        />
      </div>
      <div className="w-full lg:w-[48%]">
        <Input
          item={"totalPrice"}
          type="number"
          value={Number(stepTwoData?.totalPrice) ?? ""}
          require={true}
          disabled={true}
        />
      </div>
      <div className="w-full lg:w-[48%]">
        <SelectDropDown
          placeholder="Payment Mode"
          item={"paymentMethod"}
          options={["online", "partiallyPay", "cash"]}
          value={"online"}
          require={true}
        />
      </div>
      <div className="w-full">
        <div className="flex items-center gap-1">
          <input type="hidden" name="extraAddonPrice" value={extraAddonPrice} />
          <input
            type="checkbox"
            id="extraHelmet"
            className="w-4 h-4 accent-red-600"
            checked={extraAddonPrice > 0}
            onChange={(e) =>
              setExtraAddonPrice(e.target.checked ? extraHelmetCharge : 0)
            }
          />
          <label htmlFor="extraHelmet" className="text-sm cursor-pointer">
            Extra Helmet{" "}
            <span className="text-gray-500 italic">
              (₹{formatPrice(extraHelmetCharge)}/day)
            </span>
          </label>
        </div>
      </div>

      {/* <div className="w-full flex items-center gap-3">
        <button
          className="lg:w-[25%] bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
          type="button"
          onClick={onPrevious}
        >
          Previous
        </button>
        <button
          className="lg:w-[25%] bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
          type="button"
          onClick={handleNext}
        >
          Continue
        </button>
      </div> */}
    </>
  ) : (
    <PreLoader />
  );
};

export default BookingStepTwo;
