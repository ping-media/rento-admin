import { useDispatch, useSelector } from "react-redux";
import {
  addTempIds,
  handleIsOneOrMoreHeaderChecked,
  removeSingleTempIdById,
} from "../../Redux/VehicleSlice/VehicleSlice";

const CheckBoxInput = ({ isId }) => {
  const { isHeaderChecked, tempIds } = useSelector((state) => state.vehicles);
  const isChecked = isHeaderChecked || tempIds.includes(isId);
  const dispatch = useDispatch();

  const toggleSelectOne = (id) => {
    if (!id) return;
    if (isChecked) {
      dispatch(handleIsOneOrMoreHeaderChecked(false));
      return dispatch(removeSingleTempIdById(isId));
    } else {
      dispatch(handleIsOneOrMoreHeaderChecked(true));
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
