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
  const { token } = useSelector((state) => state.user);
  const [formLoading, setFormLoading] = useState(false);
  const dispatch = useDispatch();

  if (loading) return <PreLoader />;

  const stationInfo = vehicleMaster && vehicleMaster?.[0]?.station[0];

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    if (!formData || !stationInfo?._id)
      return handleAsyncError(dispatch, "unable to get station id! try again");

    formData.append("_id", stationInfo?._id);

    setFormLoading(true);
    try {
      const res = await postData("/manager-station", formData, token);
      if (res?.success) {
        handleAsyncError(dispatch, response?.message, "success");
      } else {
        handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      handleAsyncError(
        dispatch,
        "Uable to update the station details! try after some time"
      );
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex flex-wrap gap-4">
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
          />
        </div>
        <div className="w-full lg:w-[48%]">
          <SelectDropDown
            item={"weekendPriceIncrease"}
            options={["active", "inactive"]}
            value={stationInfo?.weekendPriceIncrease}
            isSearchEnable={false}
            require={true}
          />
        </div>
        <div className="w-full lg:w-[48%]">
          <Input
            item={"weekendPercentage"}
            value={stationInfo?.weekendPercentage}
            type="number"
            require={true}
          />
        </div>

        <button
          className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
          type="submit"
          disabled={formLoading}
        >
          {formLoading ? <Spinner message={"updating"} /> : "Update"}
        </button>
      </div>
    </form>
  );
};

export default ManagerStationForm;
