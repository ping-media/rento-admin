import { formatFullDateAndTime, formatPrice } from "../../utils/index";
import StatusChange from "../../components/Table/StatusChange";
import { tableIcons } from "../../Data/Icons";
import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";

const BookingCard = ({ item }) => {
  const navigate = useNavigate();

  const bookingPrice =
    item?.bookingPrice?.isDiscountZero === true ||
    (item?.bookingPrice?.discountTotalPrice &&
      item?.bookingPrice?.discountTotalPrice !== 0)
      ? item?.bookingPrice?.discountTotalPrice
      : item?.bookingPrice?.totalPrice;

  const extendAmount = item.bookingPrice?.extendAmount || [];
  const extendPrice = useMemo(() => {
    return extendAmount.reduce((sum, extend) => {
      if (extend?.status === "paid") {
        return (
          sum +
          Number(extend?.amount || 0) +
          Number(extend?.addOnAmount || 0) +
          Number(extend?.tax || 0) +
          Number(extend?.addonTax || 0)
        );
      }
      return sum;
    }, 0);
  }, [extendAmount]);

  const diffAmount = item.bookingPrice?.diffAmount || [];
  const diffPrice = useMemo(() => {
    return diffAmount.reduce((sum, diff) => {
      if (diff?.status === "paid") {
        const debit = Number(diff?.amount || 0);
        const credit = Number(diff?.refundAmount || 0);
        return sum + (debit - credit);
      }
      return sum;
    }, 0);
  }, [diffAmount]);

  const newBookingPrice = bookingPrice + extendPrice + diffPrice;

  // booking end date (reuse extendAmount)
  let BookingEndDateAndTime = item?.BookingEndDateAndTime;
  if (extendAmount.length > 0) {
    const lastExtend = extendAmount[extendAmount.length - 1];
    if (lastExtend?.bookingEndDateAndTime) {
      BookingEndDateAndTime = lastExtend.bookingEndDateAndTime;
    }
  }

  return (
    <div
      onClick={() => navigate(`details/${item?._id}_${item?.bookingId}`)}
      key={item?._id}
    >
      <div className="bg-white rounded-md shadow-md px-2 py-2 !text-base mb-5">
        {/* top header for booking */}
        <div className="flex items-center justify-between pb-1 mb-1 border-b-2">
          <p className="text-base">#{item?.bookingId}</p>
          <div className="flex items-center gap-1">
            <StatusChange item={item} column={"rideStatus"} />
            <StatusChange item={item} column={"bookingStatus"} />
          </div>
        </div>
        {/* vehicle booking */}
        <div className="flex items-center mb-2">
          <div className="flex-1 flex justify-center items-center gap-2">
            {/* image here  */}
            <div className="w-24 h-20">
              <img
                src={item?.vehicleImage}
                className="w-full h-full object-contain"
                alt={item?.vehicleName}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <div className="w-full flex justify-end text-right">
                  <p className="max-w-[120px] truncate capitalize">
                    {item?.vehicleName}
                  </p>
                </div>

                <h2 className="uppercase text-base font-semibold">
                  ({item?.vehicleBasic?.vehicleNumber})
                </h2>
              </div>

              <p className="capitalize">{item.stationName}</p>
            </div>
          </div>
          <div className="flex-1">
            {/* <div className="text-right">
              <h2 className="uppercase text-base font-semibold">
                {item?.vehicleBasic?.vehicleNumber}
              </h2>
              <div className="w-full flex justify-end text-right">
                <p className="max-w-[120px] truncate capitalize">
                  {item?.vehicleName}
                </p>
              </div>
            </div> */}
            <p className="text-right text-theme font-bold mb-2">
              ₹{formatPrice(newBookingPrice)}
              {/* {item?.bookingPrice?.discountTotalPrice &&
              item?.bookingPrice?.discountTotalPrice > 0
                ? formatPrice(item?.bookingPrice?.discountTotalPrice)
                : formatPrice(item?.bookingPrice?.totalPrice)} */}
            </p>

            {/* <p className="text-right capitalize">{item.stationName}</p> */}
          </div>
        </div>
        {/* user info booking */}
        <div
          className="mb-3"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <p className="flex items-center">
            {tableIcons?.user}
            <Link to={`/all-users/${item?.userId?._id}`}>
              <span className="ml-1 capitalize">
                {item?.userId?.firstName} {item?.userId?.lastName}
              </span>
            </Link>
          </p>
          <p className="flex items-center">
            {tableIcons?.phone}
            <Link to={`tel:${item?.userId?.contact}`}>
              <span className="ml-1 capitalize text-theme">
                {item?.userId?.contact}{" "}
              </span>
            </Link>
          </p>
        </div>

        {/* time between booking  */}
        <div className="flex flex-wrap items-center justify-between mb-1">
          <p className="flex items-center">
            {tableIcons?.dateCalender}{" "}
            <span className="ml-1">
              {item?.BookingStartDateAndTime &&
                formatFullDateAndTime(item?.BookingStartDateAndTime)}
            </span>
          </p>
          <p className="flex items-center">
            {tableIcons?.dateCalender}{" "}
            <span className="ml-1">
              {BookingEndDateAndTime &&
                formatFullDateAndTime(BookingEndDateAndTime)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
