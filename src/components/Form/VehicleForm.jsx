import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import Spinner from "../Spinner/Spinner.jsx";
import SelectDropDown from "../InputAndDropdown/SelectDropDown";
import { getData } from "../../Data";
import { endPointBasedOnKey } from "../../Data/commonData";
import PreLoader from "../Skeleton/PreLoader";
import { useParams } from "react-router-dom";
import {
  fetchStationBasedOnLocation,
  tenYearBeforeCurrentYear,
} from "../../Data/Function";
import VehiclePlan from "./VehicleComponents/VehiclePlan";
import { debounce } from "lodash";

const VehicleForm = ({ handleFormSubmit, loading }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [collectedData, setCollectedData] = useState(null);
  const [stationData, setStationData] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [isLocationSelected, setIsLocationSelected] = useState("");
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();

  const fetchCollectedData = debounce(
    async (vehicleMasterUrl, locationUrl, planUrl) => {
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
    },
    60
  );

  useEffect(() => {
    fetchCollectedData("vehicleMasterId", "locationId", "AllPlanDataId");
  }, []);

  //updating station based on location id
  useEffect(() => {
    if ((id && vehicleMaster?.length == 1) || isLocationSelected !== "") {
      fetchStationBasedOnLocation(
        vehicleMaster,
        isLocationSelected,
        setStationData,
        token
      );
    }
  }, [isLocationSelected, vehicleMaster]);

  return (!formLoading && vehicleMaster?.length === 1) ||
    collectedData != null ? (
    <form onSubmit={handleFormSubmit}>
      <div className="border-b-2 mb-5">
        <h2 className="font-bold">Select Package</h2>
        <div className="w-full pb-2">
          <VehiclePlan
            collectedData={collectedData}
            data={id && vehicleMaster[0]?.vehiclePlan}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {/* for updating the value of the existing one  */}
        <>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"locationId"}
              options={collectedData?.locationId}
              value={id && vehicleMaster[0]?.locationId}
              setIsLocationSelected={setIsLocationSelected}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"stationId"}
              options={stationData && stationData}
              value={id && vehicleMaster[0]?.stationId}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"vehicleMasterId"}
              options={collectedData?.vehicleMasterId}
              value={id && vehicleMaster[0]?.vehicleMasterId}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"vehicleNumber"}
              value={id && vehicleMaster[0]?.vehicleNumber}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"freeKms"}
              type="number"
              value={id ? Number(vehicleMaster[0]?.freeKms) : 100}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"extraKmsCharges"}
              type="number"
              value={id ? Number(vehicleMaster[0]?.extraKmsCharges) : 15}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"vehicleModel"}
              options={tenYearBeforeCurrentYear()}
              value={id && vehicleMaster[0]?.vehicleModel}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"perDayCost"}
              type="number"
              value={id && Number(vehicleMaster[0]?.perDayCost)}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"lastServiceDate"}
              type="date"
              value={id && vehicleMaster[0]?.lastServiceDate}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"kmsRun"}
              type="number"
              value={id ? Number(vehicleMaster[0]?.kmsRun) : 1000}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"refundableDeposit"}
              type="number"
              value={id ? Number(vehicleMaster[0]?.refundableDeposit) : 1000}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"lateFee"}
              type="number"
              value={id ? Number(vehicleMaster[0]?.lateFee) : 100}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"speedLimit"}
              type="number"
              value={id ? Number(vehicleMaster[0]?.speedLimit) : 60}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"condition"}
              options={["new", "old"]}
              value={id && vehicleMaster[0]?.condition}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"vehicleBookingStatus"}
              options={["available", "booked"]}
              value={id ? vehicleMaster[0]?.vehicleBookingStatus : "available"}
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"vehicleStatus"}
              options={["active", "inActive"]}
              value={id ? vehicleMaster[0]?.vehicleStatus : "active"}
              require={true}
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
