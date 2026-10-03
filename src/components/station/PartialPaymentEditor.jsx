import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/InputAndDropdown/Input";
import React, { useState } from "react";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { postData } from "../../Data";
import Spinner from "../../components/Spinner/Spinner";

const validatePercentage = (percentage, currentValue) => {
  if (!Number.isInteger(percentage)) return "Decimal value not supported";

  if (Number.isNaN(percentage) || percentage < 1 || percentage > 100)
    return "Number should be between 1 and 100";

  if (currentValue === percentage)
    return "Updated value and new value should not be same";

  return null;
};

const PartialPaymentEditor = ({
  partiallyPayPercentage,
  setPartiallyPayPercentage,
  vehicleMaster,
  paymentModes,
}) => {
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const updatePartiallyPayPercentage = async () => {
    if (loading) return;

    const stationId = vehicleMaster?.[0]?._id;
    const percentage = Number(partiallyPayPercentage);

    const error = validatePercentage(
      percentage,
      paymentModes?.partiallyPayPercentage,
    );

    if (error) {
      handleAsyncError(dispatch, error);
      return;
    }

    const data = {
      _id: stationId,
      key: "partiallyPayPercentage",
      value: percentage,
    };

    try {
      setLoading(true);
      const response = await postData("/toggle-payment-mode", data, token);
      if (response.success) {
        handleAsyncError(dispatch, response.message, "success");
      } else {
        handleAsyncError(dispatch, response.message);
      }
    } catch (error) {
      handleAsyncError(
        dispatch,
        "Unable to update the percentage! try again after sometime.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-1.5">
      <Input
        item={"partiallyPayPercentage"}
        placeholder={"Enter Partial Payment Percentage"}
        type="number"
        value={partiallyPayPercentage}
        setValueChange={setPartiallyPayPercentage}
        require={true}
        isLabel={false}
      />
      <button
        className="bg-theme hover:bg-theme-dark text-white font-bold px-4 py-3 mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-theme focus:ring-opacity-50 disabled:bg-gray-400"
        onClick={updatePartiallyPayPercentage}
        disabled={loading}
      >
        {loading ? <Spinner /> : "Save"}
      </button>
    </div>
  );
};

export default PartialPaymentEditor;
