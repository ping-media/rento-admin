import { useDispatch, useSelector } from "react-redux";
import {
  addMaintenanceIdsAll,
  addTempIdsAll,
  handleIsHeaderChecked,
  removemaintenanceIds,
  removeTempIds,
} from "../../Redux/VehicleSlice/VehicleSlice";
import { useEffect, useRef } from "react";

const CheckBoxInputToMultiple = ({ data, unique }) => {
  const { isHeaderChecked } = useSelector((state) => state.vehicles);
  const dispatch = useDispatch();
  const isHeaderCheckedRef = useRef(null);

  const toggleSelectAll = () => {
    if (isHeaderCheckedRef.current && isHeaderCheckedRef.current.checked) {
      if (!data) return;
      dispatch(addTempIdsAll(data?.map((item) => item?._id)));
      dispatch(
        addMaintenanceIdsAll(
          data
            ?.filter((item) => item?.maintenance?.length > 0)
            .map((item) => item.maintenance[item.maintenance.length - 1]?._id)
        )
      );
      dispatch(handleIsHeaderChecked(true));
    } else {
      dispatch(removeTempIds());
      dispatch(removemaintenanceIds());
      dispatch(handleIsHeaderChecked(false));
    }
  };

  // need to remove the check after the user delete the data
  useEffect(() => {
    if (isHeaderChecked === false && isHeaderCheckedRef.current.checked) {
      isHeaderCheckedRef.current.checked = false;
    }
  }, [isHeaderChecked]);

  return (
    <label className="inline-flex items-center" htmlFor={unique}>
      <input
        id={unique}
        type="checkbox"
        className="w-4 h-4 accent-red-600"
        onClick={toggleSelectAll}
        ref={isHeaderCheckedRef}
      />
    </label>
  );
};

export default CheckBoxInputToMultiple;
