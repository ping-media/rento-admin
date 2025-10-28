import { PAYMENT_LABELS } from "../../Data/commonData";
import Switch from "../Toggle/Switch";
import React from "react";
import { useSelector } from "react-redux";

const PaymentToggler = () => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);

  const paymentModes = vehicleMaster?.[0]?.payments || {};

  const order = ["online", "partiallyPay", "cash"];

  const sortedPayments = order
    .filter((key) => key in paymentModes)
    .map((key) => [key, paymentModes[key]]);

  return (
    <>
      <div className="border-b mb-3 flex items-center justify-between py-1">
        <h2 className="text-md lg:text-lg font-semibold uppercase">
          Enable/Disable Payment Mode
        </h2>
      </div>

      <div className="mt-5 flex flex-col gap-3 w-full md:w-1/4 lg:w-1/3 mb-3">
        {sortedPayments.map(([key, value]) => (
          <div className="flex items-center justify-between" key={key}>
            <span>{PAYMENT_LABELS[key]}</span>
            <Switch value={value} id={vehicleMaster?.[0]?._id} keyName={key} />
          </div>
        ))}
      </div>
    </>
  );
};

export default PaymentToggler;
