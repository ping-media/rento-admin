import { useDispatch, useSelector } from "react-redux";
import {
  addTempIds,
  handleIsOneOrMoreHeaderChecked,
  removeSingleTempIdById,
} from "../../Redux/VehicleSlice/VehicleSlice";
import { useEffect, useRef } from "react";

const CheckBoxInput = ({ isId }) => {
  const { isHeaderChecked } = useSelector((state) => state.vehicles);
  const dispatch = useDispatch();
  const isCheckedRef = useRef(null);

  const toggleSelectOne = (id) => {
    if (!id) return;
    if (isCheckedRef.current && isCheckedRef.current.checked) {
      dispatch(handleIsOneOrMoreHeaderChecked(true));
      return dispatch(addTempIds([id]));
    } else {
      dispatch(handleIsOneOrMoreHeaderChecked(false));
      return dispatch(removeSingleTempIdById(id));
    }
  };

  useEffect(() => {
    if (isCheckedRef.current) {
      isCheckedRef.current.checked = isHeaderChecked;
    }
  }, [isHeaderChecked]);

  return (
    <>
      <label className="inline-flex items-center" htmlFor={isId}>
        <input
          id={isId}
          type="checkbox"
          className="w-4 h-4 accent-red-600"
          onClick={() => toggleSelectOne(isId)}
          ref={isCheckedRef}
        />
      </label>
    </>
  );
};

export default CheckBoxInput;
