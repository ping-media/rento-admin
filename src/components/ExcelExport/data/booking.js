import { formatFullDateAndTime, getDurationBetweenDates } from "../../../utils";

export function transformBookings(data) {
  return data.map((item) => {
    // --- handle booking end date from extend ---
    const extendAmount = item.bookingPrice?.extendAmount || [];
    let BookingEndDateAndTime = item?.BookingEndDateAndTime;

    if (extendAmount.length > 0) {
      const lastExtend = extendAmount[extendAmount.length - 1];
      if (lastExtend?.bookingEndDateAndTime) {
        BookingEndDateAndTime = lastExtend.bookingEndDateAndTime;
      }
    }

    // --- duration ---
    let Duration = "";
    if (item?.BookingStartDateAndTime && BookingEndDateAndTime) {
      const { days, hours } = getDurationBetweenDates(
        item?.BookingStartDateAndTime,
        BookingEndDateAndTime,
      );
      Duration = `${days} days ${hours > 0 ? `${hours} hours` : ""}`;
    }

    // --- prices ---
    const bookingPrice =
      item?.bookingPrice?.isDiscountZero === true ||
      (item?.bookingPrice?.discountTotalPrice &&
        item?.bookingPrice?.discountTotalPrice !== 0)
        ? item?.bookingPrice?.discountTotalPrice
        : item?.bookingPrice?.totalPrice;

    const extendPrice = extendAmount.reduce((sum, extend) => {
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

    const diffAmount = item.bookingPrice?.diffAmount || [];
    const diffPrice = diffAmount.reduce((sum, diff) => {
      if (diff?.status === "paid") {
        const debit = Number(diff?.amount || 0);
        const credit = Number(diff?.refundAmount || 0);
        return sum + (debit - credit);
      }
      return sum;
    }, 0);

    const newBookingPrice = bookingPrice + extendPrice + diffPrice;

    // --- final row object ---
    return {
      BookingId: item?.bookingId,
      PickupDateAndTime:
        item?.BookingStartDateAndTime &&
        formatFullDateAndTime(item?.BookingStartDateAndTime),
      DropDateAndTime: formatFullDateAndTime(BookingEndDateAndTime),
      Duration,
      CustomerName: item?.userId?.fullName || "--",
      CustomerNumber: item?.userId?.contact || "--",
      AltCustomerNumber: item?.userId?.altContact || "--",
      CustomerEmail: item?.userId?.email || "--",
      VehicleModel: `${item?.vehicleBrand || "--"} ${item?.vehicleName || ""}`,
      VehicleNumber: item?.vehicleBasic?.vehicleNumber,
      TotalAmount: newBookingPrice,
      PaymentStatus: item.paymentStatus,
      BookingStatus:
        item?.bookingStatus === "done" ? "confirmed" : item?.bookingStatus,
      RideStatus: item?.rideStatus,
    };
  });
}
