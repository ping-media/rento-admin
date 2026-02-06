import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { togglePaymentUpdateModal } from "../../../Redux/SideBarSlice/SideBarSlice";
import { hasUnpaid } from "../../../utils";

export const UpdatePaymentBtn = () => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const { loggedInRole } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const booking = useMemo(() => vehicleMaster?.[0] ?? null, [vehicleMaster]);
  const isAdmin = loggedInRole === "admin";

  if (!booking) return null;

  const hasPendingPayments =
    hasUnpaid(booking?.bookingPrice?.diffAmount) ||
    hasUnpaid(booking?.bookingPrice?.extendAmount);

  const shouldShowUpdatePaymentButton = isAdmin && hasPendingPayments;

  return (
    <>
      {shouldShowUpdatePaymentButton && (
        <Button
          title="Update Payment"
          customClass="text-sm bg-theme text-gray-100 px-1.5 py-1"
          fn={() => dispatch(togglePaymentUpdateModal())}
        />
      )}
    </>
  );
};
