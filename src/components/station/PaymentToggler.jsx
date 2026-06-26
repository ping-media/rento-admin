import Tooltip from "../../components/Tooltip/Tooltip";
import { PAYMENT_LABELS } from "../../Data/commonData";
import Switch from "../Toggle/Switch";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import PartialPaymentEditor from "./PartialPaymentEditor";

const ORDER = ["online", "partiallyPay", "cash"];

const partialPaymentTooltip = (
  <div className="sm:max-w-68 max-w-48">
    <p>
      Percentage of the total booking amount to be collected upfront.
      <br /> Example: 20 = 20% advance payment and 80% remaining balance.
    </p>
  </div>
);

const PaymentToggler = () => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const paymentModes = vehicleMaster?.[0]?.payments || {};
  const [partiallyPayPercentage, setPartiallyPayPercentage] = useState(
    paymentModes ? paymentModes?.partiallyPayPercentage : 0,
  );

  // sync data with db value
  useEffect(() => {
    setPartiallyPayPercentage(paymentModes?.partiallyPayPercentage || 20);
  }, [paymentModes?.partiallyPayPercentage]);

  const sortedPayments = useMemo(
    () =>
      ORDER.filter((key) => key in paymentModes).map((key) => [
        key,
        paymentModes[key],
      ]),
    [paymentModes],
  );

  return (
    <>
      <div className="border-b mb-3 flex items-center justify-between py-1">
        <h2 className="text-md lg:text-lg font-semibold uppercase">
          Enable/Disable Payment Mode
        </h2>
      </div>

      <div className="mt-5 flex flex-col gap-3 w-full md:w-1/4 lg:w-1/3 mb-3">
        {sortedPayments.map(([key, value]) => (
          <React.Fragment key={PAYMENT_LABELS[key]}>
            <div className="flex items-center justify-between">
              <div>
                <span>{PAYMENT_LABELS[key]}</span>
                {key === "partiallyPay" && (
                  <span className="ml-1">
                    <Tooltip
                      underLine={false}
                      buttonMessage="(?)"
                      tooltipData={partialPaymentTooltip}
                    />
                  </span>
                )}
              </div>
              <Switch
                value={value}
                id={vehicleMaster?.[0]?._id}
                keyName={key}
              />
            </div>

            {/* show or disable this based on where that mode is on or not  */}
            {key === "partiallyPay" && value && (
              <PartialPaymentEditor
                partiallyPayPercentage={partiallyPayPercentage}
                setPartiallyPayPercentage={setPartiallyPayPercentage}
                vehicleMaster={vehicleMaster}
                paymentModes={paymentModes}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default PaymentToggler;
