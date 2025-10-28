import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { postData } from "../../Data";
import { updateStationPayment } from "../../Redux/VehicleSlice/VehicleSlice";

const Switch = ({ value = false, id, keyName }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(
    value === "active" || value === true
  );

  const handleChange = async () => {
    if (!id || !keyName) return;

    const newValue = !isActive;

    try {
      setLoading(true);

      const response = await postData(
        "/toggle-payment-mode",
        {
          _id: id,
          key: keyName,
          value: newValue,
        },
        token
      );

      if (!response?.success) {
        handleAsyncError(dispatch, response?.message);
        return;
      }

      // updating redux
      dispatch(
        updateStationPayment({
          keyName,
          value: newValue,
        })
      );

      // Optimistically update UI
      setIsActive(newValue);
    } catch (error) {
      console.error("Switch error:", error);
      handleAsyncError(dispatch, error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      {loading ? (
        <Spinner />
      ) : (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isActive}
            onChange={handleChange}
          />
          <div className="group peer bg-white rounded-full duration-300 w-9 h-5 ring-2 ring-theme after:duration-300 after:bg-red-500 peer-checked:after:bg-green-500 peer-checked:ring-green-500 after:rounded-full after:absolute after:h-3 after:w-3 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-hover:after:scale-95"></div>
        </label>
      )}
    </div>
  );
};

export default Switch;
