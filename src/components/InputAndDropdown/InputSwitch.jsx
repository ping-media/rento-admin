import { useDispatch, useSelector } from "react-redux";
import { postData } from "../../Data";
import { handleUpdateStatus } from "../../Redux/VehicleSlice/VehicleSlice";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";

const InputSwitch = ({ value, id }) => {
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  //   changing the locationStatus or vehicleStatus
  const handleChangeStatus = async () => {
    try {
      if (!value && !id) return;
      const newStatus = value == "active" ? "inactive" : "active";
      const flag =
        location?.pathname === "/location-master"
          ? "locationStatus"
          : location?.pathname === "/station-master"
          ? "status"
          : "vehicleStatus";
      dispatch(handleUpdateStatus({ id: id, newStatus: newStatus, flag }));
      // creating endpoint dynamically
      const endpoint =
        location?.pathname === "/location-master"
          ? `/updateLocation?_id=${id}`
          : location?.pathname === "/station-master"
          ? `/createStation?_id=${id}`
          : `/createVehicle?_id=${id}`;
      // creating data dynamically
      const data =
        location?.pathname === "/location-master"
          ? { _id: id, locationStatus: newStatus }
          : location?.pathname === "/station-master"
          ? { _id: id, status: newStatus }
          : { _id: id, vehicleStatus: newStatus };

      const response = await postData(endpoint, data, token);
      if (response?.status != 200)
        return handleAsyncError(dispatch, response?.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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
    </>
  );
};

export default InputSwitch;
