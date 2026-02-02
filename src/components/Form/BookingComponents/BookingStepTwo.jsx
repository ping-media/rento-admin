import { useEffect, useRef, useState } from "react";
import Input from "../../InputAndDropdown/Input";
import PreLoader from "../../Skeleton/PreLoader";
import { formatPrice, getDurationBetweenDates } from "../../../utils/index";
import SelectDropDown from "../../InputAndDropdown/SelectDropDown";
import { getData, postData } from "../../../Data/index";
import { useSelector } from "react-redux";
import SelectDropDownCoupon from "../../InputAndDropdown/SelectDropDownCoupon";

const BookingStepTwo = ({
  data,
  priceCalculate,
  gst,
  setCoupon,
  coupon,
  plan,
  setPlan,
  stepTwoData: parentStepTwoData,
  setStepTwoData: setParentStepTwoData,
}) => {
  const [stepTwoData, setStepTwoData] = useState(null);
  const { vehiclesFilter } = useSelector((state) => state.pagination);
  const { extraAddOn } = useSelector((state) => state.general);
  const [CouponData, setCouponData] = useState(null);
  const [inputSelect, setInputSelect] = useState("");
  const [CouponLoading, setCouponLoading] = useState(false);
  const [isPlanApplied, setIsPlanApplied] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const { token, loggedInRole } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [bookingDuration, setBookingDuration] = useState(0);
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  const appliedCouponRef = useRef(null);

  // Sync with parent stepTwoData
  useEffect(() => {
    if (parentStepTwoData) {
      setStepTwoData(parentStepTwoData);
    }
  }, [parentStepTwoData]);

  const isData =
    data && data?.selectedVehicle?._daysBreakdown?.length > 0
      ? data?.selectedVehicle?._daysBreakdown
      : [];

  const dayBreakDown =
    isData?.length > 0
      ? isData?.filter((days) => days?.isWeekend === true)
      : [];

  const handleAddonToggle = (checked, item) => {
    if (checked) {
      setSelectedAddOns((prev) => [...prev, item]);
    } else {
      setSelectedAddOns((prev) => prev.filter((i) => i._id !== item._id));
    }
  };

  // for calculating price
  useEffect(() => {
    // if (!data && CouponLoading) return;
    if (!data) return;
    const { bookingStartDate, bookingEndDate, selectedVehicle } = data;
    if (!bookingStartDate || !bookingEndDate || !selectedVehicle) return;

    try {
      setLoading(true);

      // reset coupon if try to add extra helemet after apply coupon
      if (coupon?.className !== "" && coupon?.couponId !== "") {
        setInputSelect("");
        removeCoupon();
      }
      const durationBetweenStartAndEnd = getDurationBetweenDates(
        bookingStartDate,
        bookingEndDate,
      );
      setBookingDuration(durationBetweenStartAndEnd?.days);
      if (selectedVehicle?.vehiclePlan?.length > 0) {
        const isPlanMatch = selectedVehicle?.vehiclePlan?.filter(
          (plan) =>
            Number(plan.planDuration) ===
            Number(durationBetweenStartAndEnd?.days),
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
        selectedAddOns,
      );

      setStepTwoData(newData);
      setParentStepTwoData && setParentStepTwoData(newData);
    } finally {
      setLoading(false);
    }
  }, [
    data?.bookingStartDate,
    data?.bookingEndDate,
    data?.selectedVehicle,
    selectedAddOns,
    // CouponLoading,
  ]);

  // for fetching coupon
  // const fetchCoupons = useCallback(async () => {
  //   try {
  //     setCouponLoading(true);

  //     const endpoint = couponName
  //       ? `/getCoupons?search=${couponName}&page=1&limit=25`
  //       : `/getCoupons?page=1&limit=25`;

  //     const response = await getData(endpoint, token);

  //     if (response?.status === 200) {
  //       setCouponData(response.data);
  //     }
  //   } finally {
  //     setCouponLoading(false);
  //   }
  // }, [couponName]);

  // useEffect(() => {
  //   fetchCoupons();
  // }, [fetchCoupons]);

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
  }, [vehiclesFilter?.couponName]);

  // for apply coupon
  useEffect(() => {
    if (coupon?.couponName === "" && coupon?.couponId === "") return;
    if (appliedCouponRef.current === coupon?.couponId) return;
    if (!stepTwoData) return;

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
                : Number(stepTwoData?.bookingPrice),
            isExtra: applyLoading,
          },
          token,
        );
        if (response?.status === 200) {
          appliedCouponRef.current = coupon?.couponId;

          const discountAmount = Math.round(Number(response?.data?.discount));
          const finalAmount = Math.round(
            Number(response?.data?.finalAmount) + stepTwoData?.extraAddonPrice,
          );
          if (finalAmount === 0) {
            setCoupon({ ...coupon, isDiscountZero: true });
          }
          if (coupon?.totalPrice === 0) {
            setCoupon({
              ...coupon,
              discountAmount: discountAmount,
              totalPrice: Number(stepTwoData?.bookingPrice),
              discountPrice: finalAmount,
            });
          }
          const updatedStepTwoData = {
            ...stepTwoData,
            totalPrice: finalAmount,
          };
          setStepTwoData(updatedStepTwoData);
          setParentStepTwoData && setParentStepTwoData(updatedStepTwoData);
        }
      } finally {
        setApplyLoading(false);
      }
    })();
    // }, [coupon]);
  }, [coupon?.couponId, coupon?.couponName, stepTwoData?.bookingPrice]);

  // reset coupon
  const removeCoupon = () => {
    appliedCouponRef.current = null;

    setStepTwoData({
      ...stepTwoData,
      totalPrice: Number(coupon?.totalPrice + stepTwoData?.extraAddonPrice),
    });
    // setCouponName("");
    setCoupon({
      couponName: "",
      couponId: "",
      totalPrice: 0,
      discountAmount: 0,
      discountPrice: 0,
      isDiscountZero: false,
    });
  };

  // Add these handler functions after the removeCoupon function
  const handleBookingPriceChange = (e) => {
    const newBookingPrice = Number(e.target.value) || 0;

    // Recalculate tax if GST is active
    let newTax = 0;
    if (gst?.status === "active") {
      newTax = Math.round((newBookingPrice * gst.percentage) / 100);
    }

    // Recalculate total price
    const newTotalPrice =
      newBookingPrice +
      stepTwoData.extraAddonPrice +
      newTax +
      stepTwoData.addonTax;

    const updatedStepTwoData = {
      ...stepTwoData,
      bookingPrice: newBookingPrice,
      vehiclePrice: newBookingPrice,
      tax: newTax,
      totalPrice: newTotalPrice,
    };

    setStepTwoData(updatedStepTwoData);
    setParentStepTwoData && setParentStepTwoData(updatedStepTwoData);

    // Reset coupon if applied
    if (coupon?.couponName !== "" && coupon?.couponId !== "") {
      removeCoupon();
    }
  };

  const handleTotalPriceChange = (e) => {
    const newTotalPrice = Number(e.target.value) || 0;

    const updatedStepTwoData = {
      ...stepTwoData,
      totalPrice: newTotalPrice,
    };

    setStepTwoData(updatedStepTwoData);
    setParentStepTwoData && setParentStepTwoData(updatedStepTwoData);

    // Reset coupon if applied
    if (coupon?.couponName !== "" && coupon?.couponId !== "") {
      removeCoupon();
    }
  };

  if (applyLoading) {
    return <PreLoader />;
  }

  return !loading && stepTwoData !== null ? (
    <>
      {bookingDuration > 0 && (
        <div className="w-full">
          <p className="text-right text-sm font-semibold">
            ({bookingDuration} Day(s) Booking)
          </p>
        </div>
      )}
      <div className="w-full lg:w-[48%]">
        <label
          htmlFor={"bookingPrice"}
          className="block text-gray-800 font-semibold text-sm capitalize text-left"
        >
          Price
        </label>
        <Input
          item={"bookingPrice"}
          type="number"
          value={Number(stepTwoData?.bookingPrice) ?? ""}
          require
          disabled={
            loggedInRole === "admin"
              ? coupon?.couponName !== "" && coupon?.couponId !== ""
              : true
          }
          isLabel={false}
          onChange={
            loggedInRole === "admin" ? handleBookingPriceChange : undefined
          }
        />
        {isPlanApplied && (
          <p className="text-sm font-semibold mt-1">
            Plan Applied ({plan?.selectedPlan[0]?.planName || "--"})
          </p>
        )}
        {!isPlanApplied && dayBreakDown?.length > 0 && (
          <p className="text-xs font-semibold text-gray-500 mt-1">
            Weekend Price Applied (₹{dayBreakDown[0]?.dailyRate || "--"} X
            {dayBreakDown?.length} day(s))
          </p>
        )}
      </div>
      {gst?.status === "active" && (
        <>
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
              item={"addonTax"}
              type="number"
              value={Number(stepTwoData?.addonTax) ?? ""}
              require={true}
              disabled={true}
            />
          </div>
        </>
      )}
      <div className="w-full lg:w-[48%]">
        <label
          htmlFor={"bookingPrice"}
          className="block text-gray-800 font-semibold text-sm capitalize text-left"
        >
          Total Price
        </label>
        <Input
          item={"totalPrice"}
          type="number"
          value={Number(stepTwoData?.totalPrice) || ""}
          require={true}
          disabled={
            loggedInRole === "admin"
              ? coupon?.couponName !== "" && coupon?.couponId !== ""
              : true
          }
          isLabel={false}
          onChange={
            loggedInRole === "admin" ? handleTotalPriceChange : undefined
          }
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
          // onSearchChange={setCouponName}
        />
      </div>
      <div className="w-full lg:w-[48%]">
        <SelectDropDown
          placeholder="Payment Mode"
          item={"paymentMethod"}
          options={["online", "partiallyPay", "cash"]}
          value={"cash"}
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
