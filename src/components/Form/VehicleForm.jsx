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

const VehicleForm = ({ handleFormSubmit, loading }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [collectedData, setCollectedData] = useState(null);
  const [stationData, setStationData] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [isLocationSelected, setIsLocationSelected] = useState("");
  const { token, userStation } = useSelector((state) => state.user);
  const { id } = useParams();

  // for setting locationid if it is present
  useEffect(() => {
    if (id && vehicleMaster?.length == 1) {
      // console.log(vehicleMaster[0]?.locationId);
      setIsLocationSelected(vehicleMaster[0]?.locationId);
    }
  }, [vehicleMaster, id]);

  //updating station based on location id
  useEffect(() => {
    if (
      (id && vehicleMaster?.length == 1 && isLocationSelected !== "") ||
      isLocationSelected !== ""
    ) {
      fetchStationBasedOnLocation(
        vehicleMaster,
        isLocationSelected,
        setStationData,
        token
      );
    }
  }, [isLocationSelected, vehicleMaster]);

  const fetchCollectedData = async (vehicleMasterUrl, locationUrl, planUrl) => {
    setFormLoading(true);

    try {
      // Fetch all data in parallel
      const [planResponse, vehicleMasterResponse, locationResponse] =
        await Promise.all([
          getData(endPointBasedOnKey[planUrl], token),
          getData(
            `${endPointBasedOnKey[vehicleMasterUrl]}?fetchAll=true`,
            token
          ),
          getData(`${endPointBasedOnKey[locationUrl]}?fetchAll=true`, token),
        ]);

      // Set the collected data if all responses are successful
      if (planResponse && vehicleMasterResponse && locationResponse) {
        setCollectedData({
          vehicleMasterId: vehicleMasterResponse?.data,
          locationId: locationResponse?.data,
          AllPlanDataId: planResponse?.data,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectedData("vehicleMasterId", "locationId", "AllPlanDataId");
  }, []);

  return (!formLoading && vehicleMaster?.length === 1) ||
    collectedData != null ? (
    <form onSubmit={handleFormSubmit}>
      <div className={`border-b-2 ${!id ? "mb-5" : "pb-5 mb-5"}`}>
        <h2 className="font-bold">
          {!id
            ? "Select Package"
            : `Package Applied: ${
                vehicleMaster && vehicleMaster[0]?.vehiclePlan?.length
              } Plan`}
        </h2>

        <div className="w-full pb-2">
          <VehiclePlan
            collectedData={collectedData}
            data={
              (id && vehicleMaster && vehicleMaster[0]?.vehiclePlan) || null
            }
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {/* for updating the value of the existing one  */}
        <>
          {userStation ? (
            <input
              type="hidden"
              name="locationId"
              value={userStation?.locationId}
            />
          ) : (
            <div className="w-full lg:w-[48%]">
              <SelectDropDown
                item={"locationId"}
                options={collectedData?.locationId?.filter(
                  (location) => location?.locationStatus !== "inactive"
                )}
                value={id && vehicleMaster[0]?.locationId}
                setIsLocationSelected={setIsLocationSelected}
                require={true}
              />
            </div>
          )}
          {userStation ? (
            <input
              type="hidden"
              name="stationId"
              value={userStation?.stationId}
            />
          ) : (
            <div className="w-full lg:w-[48%]">
              <SelectDropDown
                item={"stationId"}
                options={
                  stationData &&
                  stationData.filter(
                    (station) => station?.status !== "inactive"
                  )
                }
                value={id && vehicleMaster[0]?.stationId}
                require={true}
              />
            </div>
          )}
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
            <p className="text-xs mt-1 text-gray-500 italic">
              Base Free limit for vehicle.The limit entered above will change
              based on booking duration.
            </p>
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"extraKmsCharges"}
              type="number"
              value={id ? Number(vehicleMaster[0]?.extraKmsCharges) : 15}
              require={true}
            />
            <p className="text-xs mt-1 text-gray-500 italic">
              Extra charges after the free limit is over. The amount entered
              above will be charged per km.
            </p>
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"vehicleModel"}
              options={tenYearBeforeCurrentYear()}
              value={id && vehicleMaster[0]?.vehicleModel}
              require={true}
              isSearchEnable={false}
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
            <p className="text-xs mt-1 text-gray-500 italic">
              Enter the last service date of the vehicle.
            </p>
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              placeholder={"Last Service Kms"}
              item={"lastMeterReading"}
              type="number"
              value={id && vehicleMaster[0]?.lastMeterReading}
              require={true}
            />
            <p className="text-xs mt-1 text-gray-500 italic">
              Enter the meter reading when the vehicle was last serviced.
            </p>
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"kmsRun"}
              type="number"
              value={id ? Number(vehicleMaster[0]?.kmsRun) : 1000}
              require={true}
            />
            <p className="text-xs mt-1 text-gray-500 italic">
              Enter the total odometer reading of the vehicle to date — the
              total distance it has traveled in kilometers.
            </p>
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"refundableDeposit"}
              type="number"
              value={id ? Number(vehicleMaster[0]?.refundableDeposit) : 1000}
              require={true}
            />
            <p className="text-xs mt-1 text-gray-500 italic">
              Enter the refundable deposit amount to be returned to the customer
              after the vehicle is dropped off.
            </p>
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              placeholder={"Late Fee per Hour"}
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
              isSearchEnable={false}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"vehicleBookingStatus"}
              options={["available", "booked"]}
              value={id ? vehicleMaster[0]?.vehicleBookingStatus : "available"}
              require={true}
              isSearchEnable={false}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"vehicleStatus"}
              options={["active", "inActive"]}
              value={id ? vehicleMaster[0]?.vehicleStatus : "active"}
              require={true}
              isSearchEnable={false}
            />
          </div>
        </>

        <button
          className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <Spinner message={"uploading"} />
          ) : id ? (
            "Update"
          ) : (
            "Add New"
          )}
        </button>
      </div>
    </form>
  ) : (
    <PreLoader />
  );
};

export default VehicleForm;
