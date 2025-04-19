import { useDispatch, useSelector } from "react-redux";
import VehicleInfo from "./VehicleInfo";
import { lazy, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchVehicleMasterById } from "../../Data/Function";
import PreLoader from "../Skeleton/PreLoader";
import { NotFound } from "../../Pages";
import { getData } from "../../Data";
import { endPointBasedOnKey } from "../../Data/commonData";
import { camelCaseToSpaceSeparated, formatPrice } from "../../utils/index";
import { tableIcons } from "../../Data/Icons";
// import { toggleVehicleServiceModal } from "../../Redux/SideBarSlice/SideBarSlice";
import MaintenanceTable from "../../components/Table/MaintenanceTable";
// import {
//   addSchedule,
//   startLoading,
//   stopLoading,
// } from "../../Redux/MaintenanceSlice/MaintenanceSlice";
// import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
// const AddVehicleForServiceModal = lazy(() =>
//   import("../../components/Modal/AddVehicleForServiceModal")
// );

const VehicleDetail = () => {
  const { vehicleMaster, loading } = useSelector((state) => state.vehicles);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { token, loggedInRole } = useSelector((state) => state.user);
  const [collectedData, setCollectedData] = useState(null);

  const fetchCollectedData = async (stationUrl, vehicleMaster) => {
    const vehicleResponse = await getData(vehicleMaster, token);
    const stationResponse = await getData(
      endPointBasedOnKey[stationUrl],
      token
    );

    if (vehicleResponse && stationResponse) {
      return setCollectedData({
        vehicleMasterId: vehicleResponse?.data,
        stationId: stationResponse?.data,
      });
    }
  };

  // through this we are fetching single vehicle data
  useEffect(() => {
    if (id) {
      fetchVehicleMasterById(dispatch, id, token, "/getAllVehiclesData");
    }
  }, []);

  useEffect(() => {
    if (vehicleMaster?.length == 1) {
      fetchCollectedData(
        "stationId",
        `/getVehicleMasterData?_id=${vehicleMaster[0]?.vehicleMasterId}`
      );
    }
  }, [vehicleMaster]);

  return id ? (
    !loading && collectedData != null ? (
      vehicleMaster?.length == 1 ? (
        <>
          {/* <AddVehicleForServiceModal /> */}
          <div className="flex items-center flex-wrap gap-2 lg:gap-0 justify-between mb-3">
            <h1 className="text-2xl uppercase font-bold text-theme">
              Vehicle Details
            </h1>
            <div className="flex items-center gap-2">
              {/* <button
                className="bg-theme px-4 py-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none"
                type="button"
                onClick={() => dispatch(toggleVehicleServiceModal())}
              >
                Schedule Maintenance
              </button> */}
              {loggedInRole !== "manager" && (
                <Link
                  className="bg-theme px-4 py-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none"
                  to={`/all-vehicles/${id}`}
                >
                  {tableIcons["common-edit"]}
                  <span>Edit</span>
                </Link>
              )}
            </div>
          </div>
          <div className="mt-5">
            <div className="flex gap-4 flex-wrap">
              <div className="bg-white shadow-md rounded-xl w-full lg:flex-1 px-6 py-4">
                <h2 className="mb-3 text-xl font-semibold text-gray-500">
                  Vehicle Infomation
                </h2>
                <div className="border-2 p-2 border-gray-300 rounded-lg">
                  {Object.entries(vehicleMaster[0]).map(
                    ([key, value], index) => {
                      if (
                        key.includes("id") ||
                        key.includes("_v") ||
                        key.includes("At") ||
                        key.includes("Id") ||
                        key.includes("Image") ||
                        key.includes("maintenance")
                      ) {
                        return null;
                      }

                      return (
                        <div
                          className={`flex justify-between items-center py-1.5 ${
                            Object.entries(vehicleMaster[0]).length !==
                            index + 2
                              ? "border-b-2"
                              : ""
                          } border-gray-300`}
                          key={key}
                        >
                          <span className="font-semibold uppercase">
                            {camelCaseToSpaceSeparated(key)}
                          </span>{" "}
                          <span className="text-gray-500 capitalize">
                            {key.includes("Cost") || key.includes("Charges")
                              ? "₹"
                              : ""}
                            {typeof value !== "object"
                              ? value
                              : `${value.length} applied`}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
              <div className="w-full lg:flex-1 px-6 py-4 bg-white shadow-md rounded-lg overflow-hidden">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-bold uppercase text-lg">
                      <span className="mr-1">
                        {collectedData &&
                          collectedData?.vehicleMasterId[0]?.vehicleBrand}
                      </span>
                      {collectedData &&
                        collectedData?.vehicleMasterId[0]?.vehicleName}
                    </h2>
                    <small className="text-gray-600">
                      {vehicleMaster[0]?.vehicleModel || "modal year"}
                    </small>
                  </div>
                  <div>
                    <h2 className="font-semibold uppercase">Rental Price</h2>
                    <p className="font-bold text-lg">
                      ₹
                      {formatPrice(Number(vehicleMaster[0]?.perDayCost)) ||
                        formatPrice(100)}
                      /DAY
                    </p>
                  </div>
                </div>
                <div className="mb-5">
                  <VehicleInfo {...vehicleMaster[0]} />
                </div>
                <div className="mb-2">
                  <h2 className="text-lg font-semibold uppercase">
                    Vehicle Plan
                  </h2>
                </div>
                <div className="bg-gray-300/50 p-2 rounded-md mb-3">
                  <ul className="list-disc pl-5">
                    {vehicleMaster[0]?.vehiclePlan?.length > 0 ? (
                      vehicleMaster[0]?.vehiclePlan?.map((plan) => (
                        <li className="w-full" key={plan?._id}>
                          <div className="flex items-center gap-1 w-full">
                            <p className="text-sm font-semibold">
                              {plan?.planName || "Plan Name"}:
                            </p>
                            <p className="text-sm">
                              ₹{formatPrice(Number(plan.planPrice))}
                            </p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm italic">No Plan Applied.</li>
                    )}
                  </ul>
                </div>
                <div className="mb-2">
                  <h2 className="text-lg font-semibold uppercase">
                    Maintenance Schedule
                  </h2>
                </div>

                <MaintenanceTable />
              </div>
            </div>
          </div>
        </>
      ) : (
        <NotFound />
      )
    ) : (
      <PreLoader />
    )
  ) : (
    <NotFound />
  );
};

export default VehicleDetail;
