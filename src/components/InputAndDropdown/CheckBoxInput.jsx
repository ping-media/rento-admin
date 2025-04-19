import { useDispatch, useSelector } from "react-redux";
import {
  addMaintenanceIds,
  addTempIds,
  handleIsOneOrMoreHeaderChecked,
  removeSingleMaintenanceIdsById,
  removeSingleTempIdById,
} from "../../Redux/VehicleSlice/VehicleSlice";

const CheckBoxInput = ({ isId }) => {
  const { tempIds, vehicleMaster } = useSelector((state) => state.vehicles);
  // const isChecked = isHeaderChecked || tempIds.includes(isId);
  const isChecked = tempIds.includes(isId);
  const dispatch = useDispatch();

  const toggleSelectOne = (id) => {
    if (!id) return;
    const data = vehicleMaster?.data?.find((item) => item?._id === isId);
    if (isChecked) {
      dispatch(handleIsOneOrMoreHeaderChecked(false));
      const maintenanceId =
        // data?.maintenance[data?.maintenance?.length - 1]?._id;
        data?.maintenance[0]?._id;
      dispatch(removeSingleMaintenanceIdsById(maintenanceId));
      return dispatch(removeSingleTempIdById(isId));
    } else {
      dispatch(handleIsOneOrMoreHeaderChecked(true));
      const maintenanceId =
        // data?.maintenance[data?.maintenance?.length - 1]?._id;
        data?.maintenance[0]?._id;
      dispatch(addMaintenanceIds([maintenanceId]));
      return dispatch(addTempIds([isId]));
    }
  };

  return (
    <>
      <label className="inline-flex items-center" htmlFor={isId}>
        <input
          id={isId}
          type="checkbox"
          className="w-4 h-4 accent-red-600"
          onChange={toggleSelectOne}
          checked={isChecked}
        />
      </label>
    </>
  );
};

export default CheckBoxInput;
