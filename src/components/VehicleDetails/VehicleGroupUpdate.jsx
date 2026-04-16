import { useSelector } from "react-redux";
import { getData } from "../../Data/index";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import MaintenanceTableSkeleton from "../../components/Skeleton/MaintenanceTableSkeleton";
import ChangeBulkVehicle from "../../components/Modal/ChangeBulkVehicle";
import VehicleTable from "./VehicleTable";

const VehicleGroupUpdate = ({
  vehicleName,
  stationId,
  vehicle,
  maintenanceVehicleId,
  setMaintenanceVehicleId,
  isMaintenanceAdd,
}) => {
  const { token } = useSelector((state) => state.user);
  const [allVehicles, setAllVehicles] = useState([]);
  // for vehicle price update in bulk
  const [vehicleIds, setVehicleIds] = useState([]);
  // for adding maintenance records in bulk
  // const [maintenanceVehicleId, setMaintenanceVehicleId] = useState([]);
  const [loading, setLoading] = useState(false);

  const FetchVehiclesId = useCallback(async () => {
    if (!vehicleName && !stationId) return null;

    setLoading(true);
    try {
      // Using URLSearchParams to handle special characters like +, (, ), spaces etc.
      const params = new URLSearchParams();
      if (vehicleName) params.append("vehicleName", vehicleName);
      if (stationId) params.append("stationId", stationId);

      const endpoint = `/getAllVehiclesIdsData?${params.toString()}`;

      const response = await getData(endpoint, token);
      if (response.status == 200) {
        const data = response?.data ?? [];
        const ids = data.length
          ? response?.data?.map((vehicle) => vehicle._id)
          : [];
        setVehicleIds(ids);
        setAllVehicles(data);
      }
    } catch (error) {
      console.log("Unable to fetch vehicle data", error);
    } finally {
      setLoading(false);
    }
  }, [token, vehicleName, stationId]);

  useEffect(() => {
    if (!vehicleName && !stationId) return;

    FetchVehiclesId();
  }, [vehicleName, stationId, isMaintenanceAdd]);

  const isAllSelected =
    allVehicles.length > 0 &&
    maintenanceVehicleId.length === allVehicles.length;

  const isIndeterminate =
    maintenanceVehicleId.length > 0 &&
    maintenanceVehicleId.length < allVehicles.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setMaintenanceVehicleId([]);
    } else {
      const allIds = allVehicles.map((v) => v._id);
      setMaintenanceVehicleId(allIds);
    }
  };

  const handleSelect = (id) => {
    setMaintenanceVehicleId((prev) => {
      if (prev.includes(id)) {
        return prev.filter((vehicleId) => vehicleId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  if (loading) return <MaintenanceTableSkeleton rows={2} />;

  return (
    <>
      <Suspense fallback={null}>
        <ChangeBulkVehicle
          selectedVehicleIds={vehicleIds}
          vehicle={vehicle}
          isRest={false}
        />
      </Suspense>

      {allVehicles?.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          No Vehicle Data Found.
        </p>
      ) : (
        <div className="overflow-x-auto h-full md:h-[30rem] md:overflow-y-auto">
          <VehicleTable
            allVehicles={allVehicles}
            maintenanceVehicleId={maintenanceVehicleId}
            handleSelect={handleSelect}
            handleSelectAll={handleSelectAll}
            isAllSelected={isAllSelected}
            isIndeterminate={isIndeterminate}
          />
        </div>
      )}
    </>
  );
};

export default VehicleGroupUpdate;
