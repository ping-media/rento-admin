import { shallowEqual, useDispatch, useSelector } from "react-redux";
import VehicleInfo from "./VehicleInfo";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchVehicleMasterById } from "../../Data/Function";
import PreLoader from "../Skeleton/PreLoader";
import { NotFound } from "../../Pages";
import { getData } from "../../Data";
import { endPointBasedOnKey } from "../../Data/commonData";
import { formatPrice } from "../../utils/index";
const MaintenanceTable = lazy(
  () => import("../../components/Table/MaintenanceTable"),
);
import VehicleDetailList from "./VehicleDetailList";
import MaintenanceTableSkeleton from "../../components/Skeleton/MaintenanceTableSkeleton";
import VehicleDetailHeader from "./VehicleDetailHeader";
const VehicleGroupUpdate = lazy(() => import("./VehicleGroupUpdate"));
const AddVehicleForServiceModal = lazy(
  () => import("../../components/Modal/AddVehicleForServiceModal"),
);

const VehicleDetail = () => {
  const { vehicleMaster, loading, tempLoading } = useSelector(
    (state) => state.vehicles,
    shallowEqual,
  );
  const { id } = useParams();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [collectedData, setCollectedData] = useState(null);
  // for adding maintenance records in bulk
  const [maintenanceVehicleId, setMaintenanceVehicleId] = useState([]);
  const [isMaintenanceAdd, setIsMaintenanceAdd] = useState(false);

  const fetchCollectedData = async (stationUrl, vehicleMaster) => {
    const vehicleResponse = await getData(vehicleMaster, token);
    const stationResponse = await getData(
      endPointBasedOnKey[stationUrl],
      token,
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
    if (!id || !token || tempLoading?.operation?.trim()?.length > 0) return;

    const fetchData = async () => {
      try {
        await fetchVehicleMasterById(
          dispatch,
          id,
          token,
          "/getAllVehiclesData",
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id, token, dispatch, tempLoading?.operation]);

  useEffect(() => {
    if (
      vehicleMaster?.length !== 1 ||
      !token ||
      tempLoading?.operation?.trim()?.length > 0
    )
      return;

    fetchCollectedData(
      "stationId",
      `/getVehicleMasterData?_id=${vehicleMaster[0]?.vehicleMasterId}`,
    );
  }, [vehicleMaster, token, tempLoading?.operation]);

  const vehicle = useMemo(() => vehicleMaster?.[0] || {}, [vehicleMaster]);

  if (!id) return <NotFound />;
  if (loading) return <PreLoader />;
  if (!collectedData) return <PreLoader />;
  if (vehicleMaster?.length !== 1) return <NotFound />;

  return (
    <>
      <Suspense fallback={null}>
        <AddVehicleForServiceModal
          vehiclesId={maintenanceVehicleId}
          isMaintenanceAdd={isMaintenanceAdd}
          setIsMaintenanceAdd={setIsMaintenanceAdd}
        />
      </Suspense>

      <VehicleDetailHeader />

      <div className="mt-5">
        <div className="flex gap-4 flex-wrap">
          <div className="bg-white shadow-md rounded-xl w-full lg:w-2/5 px-6 py-4">
            <div className="mb-5">
              <VehicleInfo {...vehicleMaster[0]} />
            </div>
            <VehicleDetailList vehicle={vehicle} />
          </div>
          <div className="w-full lg:flex-1 px-6 py-4 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="flex items-center justify-between border-b-2 pb-1.5 mb-5">
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
                    formatPrice(0)}
                  /DAY
                </p>
              </div>
            </div>

            <div className="mb-2">
              <h2 className="text-lg font-medium">Maintenance Schedule</h2>
            </div>

            <Suspense fallback={<MaintenanceTableSkeleton />}>
              <MaintenanceTable />
            </Suspense>

            <div className="mt-3 mb-2">
              <h2 className="text-lg font-medium">
                Individual Vehicle Details
              </h2>
            </div>

            <Suspense fallback={null}>
              <VehicleGroupUpdate
                vehicleName={vehicle?.vehicleName}
                stationId={vehicle?.stationId}
                maintenanceVehicleId={maintenanceVehicleId}
                setMaintenanceVehicleId={setMaintenanceVehicleId}
                isMaintenanceAdd={isMaintenanceAdd}
                vehicle={vehicle}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleDetail;
