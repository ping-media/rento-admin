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

  const extendPrice = useMemo(() => {
    if (!item.bookingPrice?.extendAmount?.length) return null;
    return item.bookingPrice.extendAmount.reduce((sum, extend) => {
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
  }, [item.bookingPrice?.extendAmount]);

  const diffPrice = useMemo(() => {
    if (!item.bookingPrice?.diffAmount?.length) return null;
    return item.bookingPrice.diffAmount.reduce((sum, diff) => {
      if (diff?.status === "paid") {
        if (diff?.refundAmount > 0) {
          return sum - Number(diff?.refundAmount || 0);
        }
        return sum + Number(diff?.amount || 0);
      }
      return sum;
    }, 0);
  }, [item.bookingPrice?.diffAmount]);

  const newBookingPrice =
    extendPrice !== null &&
    !isNaN(extendPrice) &&
    diffPrice !== null &&
    !isNaN(diffPrice)
      ? Number(extendPrice) + Number(diffPrice) + Number(bookingPrice)
      : bookingPrice;

  // payment price
  const paymentPrice =
    item?.paymentStatus === "partially_paid" ||
    item?.paymentStatus === "partiallyPay"
      ? item?.bookingPrice?.userPaid
      : item?.bookingPrice?.discountTotalPrice > 0
      ? item?.bookingPrice?.discountTotalPrice
      : item?.bookingPrice?.totalPrice;

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
      >
        {column.includes("files") ? null : column.includes("maintenance") ? (
          <MaintenanceStatusBadge maintenanceList={item[column]} />
        ) : (
          `₹${formatPrice(newBookingPrice)}`
        )}
      </td>
    </>
  );
};

export default PriceCell;
