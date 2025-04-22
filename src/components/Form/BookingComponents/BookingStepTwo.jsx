import { useEffect, useState } from "react";
import Input from "../../InputAndDropdown/Input";
import PreLoader from "../../Skeleton/PreLoader";
import { formatPrice } from "../../../utils/index";
import SelectDropDown from "../../InputAndDropdown/SelectDropDown";
import { getData, postData } from "../../../Data/index";
import { useSelector } from "react-redux";
import SelectDropDownCoupon from "../../InputAndDropdown/SelectDropDownCoupon";

const BookingStepTwo = ({ data, priceCalculate, setCoupon, coupon }) => {
  const [stepTwoData, setStepTwoData] = useState(null);
  const { vehiclesFilter } = useSelector((state) => state.pagination);
  const [CouponData, setCouponData] = useState(null);
  const [inputSelect, setInputSelect] = useState("");
  const [CouponLoading, setCouponLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [extraAddonPrice, setExtraAddonPrice] = useState(0);
  const extraHelmetCharge = 50;

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
                : Number(stepTwoData?.totalPrice),
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
          value={Number(stepTwoData?.totalPrice) || ""}
          require={true}
          disabled={true}
        />
      </div>
      <div className="w-full mb-2">
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
