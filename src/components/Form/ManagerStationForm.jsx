import React, { useState } from "react";
import { formatHourToTime } from "../../utils/index";
import { useDispatch, useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import PreLoader from "../Skeleton/PreLoader";
import SelectDropDown from "../InputAndDropdown/SelectDropDown";
import Spinner from "../Spinner/Spinner";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { postData } from "../../Data";

const ManagerStationForm = () => {
  const { vehicleMaster, loading } = useSelector((state) => state.vehicles);
  const { token, currentUser } = useSelector((state) => state.user);
  const [formLoading, setFormLoading] = useState(false);
  const dispatch = useDispatch();

  if (loading) return <PreLoader />;

  const stationInfo = vehicleMaster && vehicleMaster?.[0]?.station?.[0];

  const toId = (v) => String(v?._id ?? v ?? "");
  const myId = toId(currentUser?._id);

  const stationMasterIds = (
    Array.isArray(stationInfo?.userId)
      ? stationInfo.userId
      : [stationInfo?.userId]
  )
    .filter(Boolean)
    .map(toId);
  const fleetIds = (stationInfo?.fleetIds ?? []).map(toId);

  // fleet staff who are not also the station master can only view
  const isViewOnly =
    Boolean(myId) &&
    fleetIds.includes(myId) &&
    !stationMasterIds.includes(myId);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (isViewOnly) return;

    const formData = new FormData(event.target);

    if (!formData || !stationInfo?._id)
      return handleAsyncError(dispatch, "unable to get station id! try again");

    formData.append("_id", stationInfo?._id);

    setFormLoading(true);
    try {
      const res = await postData("/manager-station", formData, token);
      if (res?.success) {
        handleAsyncError(dispatch, res?.message, "success");
      } else {
        handleAsyncError(dispatch, res?.message);
      }
    } catch (error) {
      handleAsyncError(
        dispatch,
        "Uable to update the station details! try after some time",
      );
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      {isViewOnly && (
        <p className="mb-3 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-600">
          View only. Only the station manager can change these details.
        </p>
      )}

      <div className="flex flex-wrap gap-4">
        <fieldset disabled={isViewOnly} className="contents">
          <div className="w-full lg:w-[48%]">
            <Input
              item={"openStartTime"}
              type="time"
              value={formatHourToTime(stationInfo?.openStartTime || 0)}
              require={true}
              placeholder={"Select Station Open Time"}
              isFull={false}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"openEndTime"}
              type="time"
              value={formatHourToTime(stationInfo?.openEndTime || 0)}
              require={true}
              placeholder={"Select Station Close Time"}
              isFull={false}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"isGstActive"}
              options={["active", "inactive"]}
              value={stationInfo?.isGstActive}
              isSearchEnable={false}
              require={true}
              disabled={isViewOnly}
            />
          </div>
        </fieldset>

        {!isViewOnly && (
          <button
            className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-theme focus:ring-opacity-50 disabled:bg-gray-400"
            type="submit"
            disabled={formLoading}
          >
            {formLoading ? <Spinner message={"updating"} /> : "Update"}
          </button>
        )}
      </div>
    </form>
  );
};

export default ManagerStationForm;
