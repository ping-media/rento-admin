export const calculateBookingPrice = (price) => {
  if (!price) return 0;

  let total = 0;

  // Base price
  if (price.discountTotalPrice > 0) {
    total += Number(price.discountTotalPrice);
  } else {
    total += Number(price.totalPrice || 0) + Number(price.tax || 0);
    // Number(price.extraAddonPrice || 0);
  }

  // diffAmount adjustments
  if (Array.isArray(price.diffAmount)) {
    price.diffAmount.forEach((item) => {
      if (item.status === "paid") {
        if (item.amount > 0) {
          if (item.oldAmount !== item.newAmount) {
            total += Number(item.amount);
          }
        }
      }
    });
  }

  // extendAmount adjustments
  if (Array.isArray(price.extendAmount)) {
    price.extendAmount.forEach((item) => {
      if (item.status === "paid") {
        total += Number(item.amount || 0);
        total += Number(item.tax || 0);
        total += Number(item.addonTax || 0);
      }
    });
  }

  // Late fees
  total +=
    Number(price.lateFeeBasedOnHour || 0) + Number(price.lateFeeBasedOnKM || 0);

  return Math.max(total, 0); // safety
};
