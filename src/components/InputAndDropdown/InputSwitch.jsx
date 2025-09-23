import { useDispatch, useSelector } from "react-redux";
import { postData } from "../../Data";
import {
  addOrRemoveTempData,
  handleUpdateAddonStatus,
  handleUpdateStatus,
} from "../../Redux/VehicleSlice/VehicleSlice";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { useState } from "react";
import Spinner from "../../components/Spinner/Spinner";
import { toggleStationAndVehicleModal } from "../../Redux/SideBarSlice/SideBarSlice";

const InputSwitch = ({ value, id, addonId }) => {
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const endpoints = {
    "/location-master": "/updateLocation",
    "/station-master": "/createStation",
    "/all-vehicles": "/createVehicle",
  };

  //   changing the locationStatus or vehicleStatus
  const handleChangeStatus = async () => {
    try {
      if (!value && !id) return;

      const newStatus = value === "active" ? "inactive" : "active";

      if (location.pathname === "/vehicle-master") {
        const data = { _id: id, status: newStatus };
        dispatch(addOrRemoveTempData(data));
        return dispatch(toggleStationAndVehicleModal());
      }

      setLoading(true);
      const flag =
        location?.pathname === "/location-master"
          ? "locationStatus"
          : location?.pathname === "/station-master"
          ? "status"
          : "vehicleStatus";
      // creating endpoint dynamically
      const endpoint = addonId
        ? `/createStation?id=${id}&addonId=${addonId}`
        : `${endpoints[location.pathname]}?_id=${id}`;
      // creating data dynamically
      const data = addonId
        ? { _id: id, addonId, status: newStatus }
        : location?.pathname === "/location-master"
        ? { _id: id, locationStatus: newStatus }
        : location?.pathname === "/station-master"
        ? { _id: id, status: newStatus }
        : { _id: id, vehicleStatus: newStatus };

      const response = await postData(endpoint, data, token);

      if (addonId) {
        dispatch(
          handleUpdateAddonStatus({ id: addonId, newStatus: newStatus })
        );
      } else {
        dispatch(handleUpdateStatus({ id: id, newStatus: newStatus, flag }));
      }

      if (response?.status !== 200) {
        setLoading(false);
        return handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex items-center ${
        location.pathname === "/location-master" ||
        location.pathname === "/vehicle-master"
          ? "justify-start"
          : "justify-center"
      }`}
    >
      {!loading ? (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            value=""
            checked={value == "active" ? true : false}
            onChange={handleChangeStatus}
          />
          <div className="group peer bg-white rounded-full duration-300 w-9 h-5 ring-2 ring-theme after:duration-300 after:bg-red-500 peer-checked:after:bg-green-500 peer-checked:ring-green-500 after:rounded-full after:absolute after:h-3 after:w-3 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-hover:after:scale-95"></div>
        </label>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default InputSwitch;
