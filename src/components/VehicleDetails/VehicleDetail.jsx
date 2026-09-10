import { shallowEqual, useDispatch, useSelector } from "react-redux";
import VehicleInfo from "./VehicleInfo";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchVehicleMasterById } from "../../Data/Function";
import PreLoader from "../Skeleton/PreLoader";
import { NotFound } from "../../Pages";
import { getData } from "../../Data";
import { endPointBasedOnKey } from "../../Data/commonData";
const MaintenanceTable = lazy(
  () => import("../../components/Table/MaintenanceTable"),
);
import VehicleDetailList from "./VehicleDetailList";
import MaintenanceTableSkeleton from "../../components/Skeleton/MaintenanceTableSkeleton";
import VehicleDetailHeader from "./VehicleDetailHeader";
import VehicleBookingList from "./vehicleBookingList";
const VehicleGroupUpdate = lazy(() => import("./VehicleGroupUpdate"));
const AddVehicleForServiceModal = lazy(
  () => import("../../components/Modal/AddVehicleForServiceModal"),
);
const VehiclePlanModal = lazy(
  () => import("../../components/Modal/VehiclePlanModal"),
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
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

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

  const tariffData = useMemo(() => {
    const weekDayPlan = {
      _id: "week-day-plan",
      planName: "Weekday Package(Mon-Fri)",
      planDuration: 1,
      kmLimit: vehicle?.freeKms ?? 0,
      planPrice: vehicle?.perDayCost ?? 0,
    };

    const weekendPlan = {
      _id: "weekend-day-plan",
      planName: "Weekend Package(Sat,Sun)",
      planDuration: 1,
      kmLimit: vehicle?.freeKms ?? 0,
      planPrice: vehicle?.weekendCost ?? "--",
    };

    return [weekDayPlan, weekendPlan, ...(vehicle.vehiclePlan || [])];
  }, [vehicle]);

  if (!id) return <NotFound />;
  if (loading) return <PreLoader />;
  if (!collectedData) return <PreLoader />;
  if (vehicleMaster?.length !== 1) return <NotFound />;

  const ModalTitle = `${vehicle.vehicleBrand} ${vehicle.vehicleName} - Tariff`;

  return (
    <>
      <Suspense fallback={null}>
        <AddVehicleForServiceModal
          vehiclesId={maintenanceVehicleId}
          setMaintenanceVehicleId={setMaintenanceVehicleId}
          isMaintenanceAdd={isMaintenanceAdd}
          setIsMaintenanceAdd={setIsMaintenanceAdd}
        />

        <VehiclePlanModal
          isPlanModalActive={isPlanModalOpen}
          onClose={setIsPlanModalOpen}
          planData={tariffData ?? []}
          title={ModalTitle}
          info={{
            image: vehicle?.vehicleImage ?? "",
            extraKmsCharges: vehicle?.extraKmsCharges ?? "--",
            refundableDeposit: vehicle?.refundableDeposit ?? "--",
          }}
        />
      </Suspense>

      <VehicleDetailHeader {...{ isPlanModalOpen, setIsPlanModalOpen }} />

      <div className="mt-5">
        <div className="flex gap-4 flex-wrap">
          <div className="bg-white shadow-md rounded-xl w-full lg:w-2/5 px-6 py-4">
            <VehicleNameHeader
              collectedData={collectedData}
              vehicle={vehicle}
              className="flex md:hidden"
            />

            <div className="mb-5">
              <VehicleInfo {...vehicle} />
            </div>

            {/* only shown when vehicle is assign to any booking  */}
            {(vehicleMaster[0]?.currentBooking || null) && (
              <div className="mb-3">
                <VehicleBookingList
                  currentBooking={vehicle?.currentBooking ?? null}
                />
              </div>
            )}

            <VehicleDetailList vehicle={vehicle} />

            <div className="w-full h-[0.1rem] my-5 bg-gray-300" />

            <div className="mb-2">
              <h2 className="text-lg font-medium">Maintenance Schedule</h2>
            </div>

            <Suspense fallback={<MaintenanceTableSkeleton />}>
              <MaintenanceTable isMaintenanceAdd={isMaintenanceAdd} />
            </Suspense>
          </div>
          <div className="w-full lg:flex-1 px-6 py-4 bg-white shadow-md rounded-lg">
            <VehicleNameHeader
              collectedData={collectedData}
              vehicle={vehicle}
              className="hidden md:flex"
            />

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

const VehicleNameHeader = ({ collectedData, vehicle, className = "" }) => {
  return (
    <div
      className={`${className} items-center justify-between border-b-2 pb-1.5 mb-5`}
    >
      <div>
        <h2 className="font-bold uppercase text-lg">
          <span className="mr-1">
            {collectedData && collectedData?.vehicleMasterId?.[0]?.vehicleBrand}
          </span>
          {collectedData && collectedData?.vehicleMasterId?.[0]?.vehicleName}
        </h2>
        <small className="text-gray-600">
          {vehicle?.vehicleModel || "modal year"}
        </small>
      </div>
      <div>
        <h2 className="font-semibold uppercase">Vehicle Number</h2>
        <p className="font-bold text-lg">{vehicle.vehicleNumber}</p>
      </div>
      {/* <div>
                <h2 className="font-semibold uppercase">Rental Price</h2>
                <p className="font-bold text-lg">
                  ₹
                  {formatPrice(Number(vehicleMaster[0]?.perDayCost)) ||
                    formatPrice(0)}
                  /DAY
                </p>
              </div> */}
    </div>
  );
};
