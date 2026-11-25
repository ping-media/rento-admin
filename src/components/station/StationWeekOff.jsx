import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WeeklyOffSelect, {
  fromWeeklyOffValue,
  toWeeklyOffValue,
} from "../DropDown/WeeklyOffSelect";
import { postData } from "../../Data";
import { updateStationWeeklyOff } from "../../Redux/VehicleSlice/VehicleSlice";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";

const StationWeekOff = () => {
  const { loggedInRole, token } = useSelector((state) => state.user);
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const savedWeeklyOff = toWeeklyOffValue(vehicleMaster?.[0]?.stationWeeklyOff);
  const [weeklyOffValue, setWeeklyOffValue] = useState(savedWeeklyOff);
  const [savingOff, setSavingOff] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setWeeklyOffValue(savedWeeklyOff);
  }, [vehicleMaster?.[0]?._id, savedWeeklyOff]);

  const saveWeeklyOff = async () => {
    setSavingOff(true);
    try {
      const response = await postData(
        "/changeStationWeeklyOff",
        {
          _id: vehicleMaster?.[0]?._id,
          stationWeeklyOff: fromWeeklyOffValue(weeklyOffValue),
        },
        token,
      );
      if (response?.status === 200) {
        dispatch(updateStationWeeklyOff(response.data.stationWeeklyOff));
        handleAsyncError(dispatch, "Weekly off updated", "success");
      } else {
        handleAsyncError(
          dispatch,
          response?.message || "Unable to update weekly off",
        );
      }
    } catch (error) {
      handleAsyncError(dispatch, error?.message);
    } finally {
      setSavingOff(false);
    }
  };

  return (
    <>
      <div className="border-b mb-3 flex items-center justify-between py-1">
        <h2 className="text-md lg:text-lg font-semibold uppercase">
          Station Holiday Setting
        </h2>
      </div>

      {/* <div className="mt-5 flex flex-col gap-3 w-full md:w-1/4 lg:w-1/3 mb-3"> */}
      <div className="mt-5 flex flex-col gap-3 w-full mb-3">
        <WeeklyOffSelect
          id="stationWeeklyOff"
          label="Station weekly off"
          variant="expand"
          value={weeklyOffValue}
          savedValue={savedWeeklyOff}
          onChange={setWeeklyOffValue}
          onSave={saveWeeklyOff}
          saving={savingOff}
          disabled={loggedInRole !== "admin"}
        />
      </div>
    </>
  );
};

export default StationWeekOff;
