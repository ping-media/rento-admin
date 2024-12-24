import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import Spinner from "../Spinner/Spinner";
import SelectDropDown from "../InputAndDropdown/SelectDropDown";
import { getData } from "../../Data";
import { endPointBasedOnKey, vehicleColor } from "../../Data/commonData";
import PreLoader from "../Skeleton/PreLoader";
import { useParams } from "react-router-dom";
import {
  fetchStationBasedOnLocation,
  tenYearBeforeCurrentYear,
} from "../../Data/Function";
import { addTempIds } from "../../Redux/VehicleSlice/VehicleSlice";

const VehicleForm = ({ handleFormSubmit, loading }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [collectedData, setCollectedData] = useState(null);
  const [stationData, setStationData] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [isLocationSelected, setIsLocationSelected] = useState("");
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();
  const dispatch = useDispatch();

  const fetchCollectedData = async (vehicleMasterUrl, locationUrl, planUrl) => {
    setFormLoading(true);
    const planResponse = await getData(endPointBasedOnKey[planUrl], token);
    const vehicleMasterResponse = await getData(
      endPointBasedOnKey[vehicleMasterUrl],
      token
    );
    const locationResponse = await getData(
      endPointBasedOnKey[locationUrl],
      token
    );

    if (vehicleMasterResponse && locationResponse && planResponse) {
      setFormLoading(false);
      return setCollectedData({
        vehicleMasterId: vehicleMasterResponse?.data,
        locationId: locationResponse?.data,
        AllPlanDataId: planResponse?.data,
      });
    }
  };
  useEffect(() => {
    fetchCollectedData("vehicleMasterId", "locationId", "AllPlanDataId");
    console.log(collectedData);
  }, []);

  //updating station based on location id
  useEffect(() => {
    if (isLocationSelected !== "") {
      fetchStationBasedOnLocation(
        vehicleMaster,
        isLocationSelected,
        setStationData,
        token
      );
    }
  }, [isLocationSelected]);

  const handlePushId = (ids) => {
    dispatch(addTempIds([ids]));
  };

  return !formLoading || collectedData != null ? (
    <form onSubmit={handleFormSubmit}>
      <div className="flex flex-wrap gap-4">
        {/* for updating the value of the existing one  */}
        <>
          <h2 className="font-bold">Select Package</h2>
          <div className="w-full flex items-center gap-2.5 pb-3 border-b-2">
            {collectedData?.length > 0 ? (
              collectedData?.AllPlanDataId.map((plan) => (
                <div key={plan?._id}>
                  <label
                    className="inline-flex items-center"
                    htmlFor="redCheckBox"
                  >
                    <input
                      id="redCheckBox"
                      type="checkbox"
                      className="w-4 h-4 accent-red-600"
                      onClick={() => handlePushId(plan?._id)}
                    />
                    <span className="ml-2">{plan?.planName}</span>
                  </label>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic capitalize">
                no package found.
              </p>
            )}
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"locationId"}
              options={collectedData?.locationId}
              value={id && vehicleMaster[0]?.locationId}
              setIsLocationSelected={setIsLocationSelected}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"stationId"}
              options={stationData && stationData}
              value={id && vehicleMaster[0]?.stationId}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"vehicleMasterId"}
              options={collectedData?.vehicleMasterId}
              value={id && vehicleMaster[0]?.vehicleMasterId}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"vehicleNumber"}
              value={id && vehicleMaster[0]?.vehicleNumber}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"freeKms"}
              type="number"
              value={id ? Number(vehicleMaster[0]?.freeKms) : 100}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"extraKmsCharges"}
              type="number"
              value={id ? Number(vehicleMaster[0]?.extraKmsCharges) : 15}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"vehicleModel"}
              options={tenYearBeforeCurrentYear()}
              value={id && vehicleMaster[0]?.vehicleModel}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"vehicleColor"}
              options={vehicleColor}
              value={id && vehicleMaster[0]?.vehicleColor}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"perDayCost"}
              type="number"
              value={id && Number(vehicleMaster[0]?.perDayCost)}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"lastServiceDate"}
              type="date"
              value={id && vehicleMaster[0]?.lastServiceDate}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"kmsRun"}
              type="number"
              value={id && Number(vehicleMaster[0]?.kmsRun)}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"refundableDeposit"}
              type="number"
              value={id ? Number(vehicleMaster[0]?.refundableDeposit) : 1000}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"lateFee"}
              type="number"
              value={id ? Number(vehicleMaster[0]?.lateFee) : 100}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"speedLimit"}
              type="number"
              value={id ? Number(vehicleMaster[0]?.speedLimit) : 60}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"isBooked"}
              options={["true", "false"]}
              value={id ? vehicleMaster[0]?.isBooked : "false"}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"condition"}
              options={["new", "old"]}
              value={id && vehicleMaster[0]?.condition}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"vehicleBookingStatus"}
              options={["available", "booked"]}
              value={id ? vehicleMaster[0]?.vehicleBookingStatus : "available"}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"vehicleStatus"}
              options={["active", "inActive"]}
              value={id ? vehicleMaster[0]?.vehicleStatus : "active"}
            />
          </div>
        </>

        <button
          className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
          type="submit"
          disabled={loading}
        >
          {loading ? <Spinner message={"uploading"} /> : "Publish"}
        </button>
      </div>
    </form>
  ) : (
    <PreLoader />
  );
};

export default VehicleForm;
