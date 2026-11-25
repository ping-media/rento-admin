import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postData } from "../../Data/index";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import Tooltip from "../../components/Tooltip/Tooltip";
import { Switch } from "../../components/InputAndDropdown/InputSwitch";
import Spinner from "../../components/Spinner/Spinner";
import { updateShowVehicleCount } from "../../Redux/GeneralSlice/GeneralSlice";

const vehicleCountMessage = (
  <div className="sm:max-w-68 max-w-48">
    <p>
      Toggle on/off, available vehicle count which is shown on website and app
      search/explore screen.
    </p>
  </div>
);

const VehicleSettings = ({ showVehicleCount }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await postData(
        "/general/settings",
        { showVehicleCount: !showVehicleCount },
        token,
      );
      if (response?.success) {
        dispatch(updateShowVehicleCount(response.data.showVehicleCount));
        handleAsyncError(dispatch, "Setting updated", "success");
      } else {
        handleAsyncError(
          dispatch,
          response?.message || "Unable to update setting",
        );
      }
    } catch (error) {
      handleAsyncError(dispatch, error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full sm:w-6/12 flex items-center justify-between mb-2">
      <div className="flex items-center">
        <p className="text-base">Toggle Vehicle Count</p>
        <span className="ml-1">
          <Tooltip
            underLine={false}
            buttonMessage="(?)"
            tooltipData={vehicleCountMessage}
          />
        </span>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <Switch
          checked={showVehicleCount}
          onChange={handleToggle}
          disabled={loading}
        />
      )}
    </div>
  );
};

export default VehicleSettings;
