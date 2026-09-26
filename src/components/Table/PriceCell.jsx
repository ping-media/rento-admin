import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { formatPrice } from "../../utils/index";
import MaintenanceStatusBadge from "./MaintenanceBadge";

const PriceCell = ({ item, column }) => {
  const location = useLocation();

  const bookingPrice =
    item[column]?.isDiscountZero === true ||
    (item[column]?.discountTotalPrice && item[column]?.discountTotalPrice !== 0)
      ? item[column]?.discountTotalPrice
      : item[column]?.totalPrice;

  // extend booking
  const extendPrice = useMemo(() => {
    if (!item.bookingPrice?.extendAmount?.length > 0) return 0;

    return item.bookingPrice.extendAmount.reduce((sum, extend) => {
      if (extend?.status === "paid") {
        return (
          sum +
          Number(extend?.amount || 0) +
          // Number(extend?.addOnAmount || 0) +
          Number(extend?.tax || 0) +
          Number(extend?.addonTax || 0)
        );
      }
      return sum;
    }, 0);
  }, [item?.bookingPrice?.extendAmount]);

  // change vehicle
  const diffPrice = useMemo(() => {
    if (!item.bookingPrice?.diffAmount?.length) return 0;

    return item.bookingPrice.diffAmount.reduce((sum, diff) => {
      if (diff?.status === "paid") {
        // Refund case
        if (diff?.refundAmount > 0) {
          return sum - Number(diff?.refundAmount || 0);
        }

        // Merged vehicle change — add price delta, not pending amount delta
        if (diff?.mergedIntoBookingBalance) {
          return (
            sum + Number(diff?.newAmount || 0) - Number(diff?.oldAmount || 0)
          );
        }

        // Normal extra payment
        if (diff?.amount > 0 && diff?.oldAmount !== diff?.newAmount) {
          return sum + Number(diff?.amount || 0);
        }
      }
      return sum;
    }, 0);
  }, [item?.bookingPrice?.diffAmount]);

  const lateFeeBasedOnHour = !isNaN(
    Number(item.bookingPrice?.lateFeeBasedOnHour),
  )
    ? Number(item.bookingPrice?.lateFeeBasedOnHour)
    : 0;

  const lateFeeBasedOnKM = !isNaN(Number(item.bookingPrice?.lateFeeBasedOnKM))
    ? Number(item.bookingPrice?.lateFeeBasedOnKM)
    : 0;

  const newBookingPrice = useMemo(() => {
    return (
      (Number(bookingPrice) || 0) +
      (Number(extendPrice) || 0) +
      (Number(diffPrice) || 0) +
      (Number(lateFeeBasedOnHour) || 0) +
      (Number(lateFeeBasedOnKM) || 0)
    );
  }, [
    bookingPrice,
    extendPrice,
    diffPrice,
    lateFeeBasedOnHour,
    lateFeeBasedOnKM,
  ]);

  // payment price
  const paidDiffTotal =
    item?.bookingPrice?.diffAmount
      ?.filter((d) => d?.status === "paid" && d?.amount > 0)
      ?.reduce((sum, d) => sum + Number(d?.amount || 0), 0) || 0;

  const paymentPrice =
    item?.paymentStatus === "partially_paid" ||
    item?.paymentStatus === "partiallyPay"
      ? Number(item?.bookingPrice?.userPaid || 0) + paidDiffTotal
      : item?.bookingPrice?.discountTotalPrice > 0
        ? item?.bookingPrice?.discountTotalPrice
        : item?.bookingPrice?.totalPrice;

  if (location.pathname === "/logs") {
    return (
      <td className="px-2 py-1 whitespace-nowrap text-md lg:text-sm font-medium text-gray-900">
        {item[column]?.ip ?? "--"}
      </td>
    );
  }

  return (
    <>
      {location.pathname === "/payments" && (
        <td className="px-2 py-1 whitespace-nowrap text-md lg:text-sm font-medium text-gray-900">
          ₹ {formatPrice(paymentPrice)}
        </td>
      )}

      <td
        className={`px-2 py-1 whitespace-nowrap text-md lg:text-sm font-medium text-gray-900 ${
          column.includes("maintenance") ? "capitalize" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {column.includes("files") ? null : column.includes("maintenance") ? (
          <MaintenanceStatusBadge
            maintenanceList={item[column]}
            currentBooking={item["currentBooking"] ?? null}
          />
        ) : (
          `₹${formatPrice(newBookingPrice)}`
        )}
      </td>
    </>
  );
};

export default PriceCell;
