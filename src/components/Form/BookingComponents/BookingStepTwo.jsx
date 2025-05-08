import { useEffect, useState } from "react";
import Input from "../../InputAndDropdown/Input";
import PreLoader from "../../Skeleton/PreLoader";
import {
  formatPrice,
  getDurationBetweenDates,
  // getDurationInDays,
} from "../../../utils/index";
import SelectDropDown from "../../InputAndDropdown/SelectDropDown";
import { getData, postData } from "../../../Data/index";
import { useSelector } from "react-redux";
import SelectDropDownCoupon from "../../InputAndDropdown/SelectDropDownCoupon";

const BookingStepTwo = ({
  data,
  priceCalculate,
  setCoupon,
  coupon,
  plan,
  setPlan,
}) => {
  const [stepTwoData, setStepTwoData] = useState(null);
  const { vehiclesFilter } = useSelector((state) => state.pagination);
  const { extraAddOn } = useSelector((state) => state.general);
  const [CouponData, setCouponData] = useState(null);
  const [inputSelect, setInputSelect] = useState("");
  const [CouponLoading, setCouponLoading] = useState(false);
  const [isPlanApplied, setIsPlanApplied] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [bookingDuration, setBookingDuration] = useState(0);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  // const extraHelmetCharge = 50;

  const handleAddonToggle = (checked, item) => {
    if (checked) {
      setSelectedAddOns((prev) => [...prev, item]);
    } else {
      setSelectedAddOns((prev) => prev.filter((i) => i._id !== item._id));
    }
  };

  // for calculating price
  useEffect(() => {
    if (!data) return;
    try {
      setLoading(true);
      const { bookingStartDate, bookingEndDate, selectedVehicle } = data;

      if (!bookingStartDate || !bookingEndDate || !selectedVehicle) return;
      // reset coupon if try to add extra helemet after apply coupon
      if (coupon?.className !== "" && coupon?.couponId !== "") {
        setInputSelect("");
        removeCoupon();
      }
      const durationBetweenStartAndEnd = getDurationBetweenDates(
        bookingStartDate,
        bookingEndDate
      );
      setBookingDuration(durationBetweenStartAndEnd?.days);
      // let newSelectedVehicle = selectedVehicle;
      // if (plan?.data?.length > 0) {
      //   const hasPlan = plan?.data?.filter(
      //     (plan) => Number(plan?.planDuration) === Number(bookingDuration)
      //   );
      //   if (hasPlan) {
      //     setPlan((prev) => ({ ...prev, selectedPlan: hasPlan }));
      //     const planPrice =
      //       hasPlan?.length > 0 ? Number(hasPlan[0]?.planPrice) : 0;
      //     if (planPrice > 0) {
      //       setIsPlanApplied(true);
      //       newSelectedVehicle = { ...newSelectedVehicle, planPrice };
      //     }
      //   }
      // } else {
      //   setIsPlanApplied(false);
      // }
      if (selectedVehicle?.vehiclePlan?.length > 0) {
        const isPlanMatch = selectedVehicle?.vehiclePlan?.filter(
          (plan) =>
            Number(plan.planDuration) ===
            Number(durationBetweenStartAndEnd?.days)
        );
        if (isPlanMatch?.length > 0) {
          setIsPlanApplied(true);
          setPlan((prev) => ({ ...prev, selectedPlan: isPlanMatch }));
        } else {
          setIsPlanApplied(false);
        }
      } else {
        setIsPlanApplied(false);
      }

      const newData = priceCalculate(
        bookingStartDate,
        bookingEndDate,
        selectedVehicle,
        selectedAddOns
        // Number(extraAddonPrice)
      );
      setStepTwoData(newData);
    } finally {
      setLoading(false);
    }
  }, [
    data?.bookingStartDate,
    data?.bookingEndDate,
    data?.selectedVehicle,
    selectedAddOns,
    // extraAddonPrice,
  ]);

  // for fetching coupon
  useEffect(() => {
    (async () => {
      try {
        setCouponLoading(true);
        let endpoint = "/getCoupons?page=1&limit=25";
        if (vehiclesFilter.couponName) {
          endpoint = `/getCoupons?search=${vehiclesFilter.couponName}&page=1&limit=25`;
        }
        const response = await getData(endpoint, token);
        if (response?.status === 200) {
          setCouponData(response?.data);
        }
      } finally {
        setCouponLoading(false);
      }
    })();
  }, [vehiclesFilter]);

  // for apply coupon

  useEffect(() => {
    if (coupon?.couponName === "" && coupon?.couponId === "") return;
    (async () => {
      try {
        setApplyLoading(true);
        const response = await postData(
          "/applyCoupon",
          {
            couponName: coupon?.couponName,
            totalAmount:
              coupon?.totalPrice > 0
                ? Number(coupon?.totalPrice)
                : Number(
                    stepTwoData?.bookingPrice + stepTwoData?.extraAddonPrice
                  ),
            isExtra: applyLoading,
          },
          token
        );
        if (response?.status === 200) {
          const discountAmount = Math.round(Number(response?.data?.discount));
          const finalAmount = Math.round(Number(response?.data?.finalAmount));
          if (finalAmount === 0) {
            setCoupon({ ...coupon, isDiscountZero: true });
          }
          if (coupon?.totalPrice === 0) {
            setCoupon({
              ...coupon,
              discountAmount: discountAmount,
              totalPrice: Number(stepTwoData?.totalPrice),
              discountPrice: finalAmount,
            });
          }
          setStepTwoData({ ...stepTwoData, totalPrice: finalAmount });
        }
      } finally {
        setApplyLoading(false);
      }
    })();
  }, [coupon]);

  // reset coupon
  const removeCoupon = () => {
    setStepTwoData({
      ...stepTwoData,
      totalPrice: Number(coupon?.totalPrice),
    });
    setCoupon({
      couponName: "",
      couponId: "",
      totalPrice: 0,
      discountAmount: 0,
      discountPrice: 0,
      isDiscountZero: false,
    });
  };

  // const handleNext = () => {
  //   onNext();
  // };

  return !loading && stepTwoData !== null ? (
    <>
      {applyLoading && <PreLoader />}
      {bookingDuration > 0 && (
        <div className="w-full">
          <p className="text-right text-sm font-semibold">
            ({bookingDuration} Day(s) Booking)
          </p>
        </div>
      )}
      <div className="w-full lg:w-[48%]">
        <Input
          item={"bookingPrice"}
          type="number"
          value={Number(stepTwoData?.bookingPrice) ?? ""}
          require={true}
          disabled={true}
        />
        {isPlanApplied && (
          <p className="text-sm font-semibold mt-1">
            Plan Applied ({plan?.selectedPlan[0]?.planName || "--"})
          </p>
        )}
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
          value={Number(stepTwoData?.totalPrice) || ""}
          require={true}
          disabled={true}
        />
      </div>
      <div className="w-full mb-2">
        <h2 className="font-semibold text-md">Extra Add-On</h2>
        {extraAddOn?.data?.length > 0 &&
          extraAddOn?.data
            ?.filter((addon) => addon?.status !== "inactive")
            ?.map((item, index) => {
              const isChecked = selectedAddOns.some((i) => i._id === item._id);
              return (
                <div
                  className="flex items-center gap-1 mb-1 lg:mb-2"
                  key={index}
                >
                  <input
                    type="checkbox"
                    id={item?.name}
                    className="w-4 h-4 accent-red-600"
                    checked={isChecked}
                    onChange={(e) => handleAddonToggle(e.target.checked, item)}
                  />
                  <label
                    htmlFor={item?.name}
                    className="text-sm cursor-pointer capitalize"
                  >
                    {item?.name}
                    <span className="text-gray-500 italic">
                      (₹{formatPrice(item?.amount)}/day)
                    </span>
                  </label>
                </div>
              );
            })}
        {/* <div className="flex items-center gap-1">
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
        </div> */}
      </div>
      <div className="w-full lg:w-[48%]">
        <SelectDropDownCoupon
          item={"coupon"}
          options={CouponData}
          inputSelect={inputSelect}
          setInputSelect={setInputSelect}
          coupon={coupon}
          setCoupon={setCoupon}
          removeCoupon={removeCoupon}
          loading={CouponLoading}
        />
      </div>
      <div className="w-full lg:w-[48%]">
        <SelectDropDown
          placeholder="Payment Mode"
          item={"paymentMethod"}
          options={["online", "partiallyPay", "cash"]}
          value={"online"}
          require={true}
          isSearchEnable={false}
        />
      </div>
    </>
  ) : (
    <PreLoader />
  );
};

export default BookingStepTwo;
