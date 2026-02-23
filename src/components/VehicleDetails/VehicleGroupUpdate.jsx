import { useSelector } from "react-redux";
import { getData } from "../../Data/index";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import MaintenanceTableSkeleton from "../../components/Skeleton/MaintenanceTableSkeleton";
import ChangeBulkVehicle from "../../components/Modal/ChangeBulkVehicle";

const VehicleGroupUpdate = ({ vehicleName, stationId }) => {
  const { token } = useSelector((state) => state.user);
  const [allVehicles, setAllVehicles] = useState([]);
  const [vehicleIds, setVehicleIds] = useState([]);
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
  }, [vehicleName, stationId]);

  if (loading) return <MaintenanceTableSkeleton rows={2} />;

  return (
    <>
      <Suspense fallback={null}>
        <ChangeBulkVehicle selectedVehicleIds={vehicleIds} isRest={false} />
      </Suspense>

      {allVehicles?.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          No Vehicle Data Found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
            {/* TABLE HEAD */}
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 text-left">SL No.</th>
                <th className="px-3 py-2 text-left">Vehicle Number</th>
                <th className="px-3 py-2 text-center">Station Name</th>
                {/* <th className="px-3 py-2 text-center">Odometer Reading</th> */}
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>
              {allVehicles.map((vehicle, index) => (
                <tr
                  key={vehicle._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-3 py-2 font-medium uppercase">
                    {index + 1}.
                  </td>
                  <td className="px-3 py-2 font-medium uppercase">
                    {vehicle.vehicleNumber}
                  </td>

                  <td className="px-3 py-2 text-center capitalize">
                    {vehicle.stationName}
                  </td>

                  {/* <td className="px-3 py-2 text-center capitalize">
                    {vehicle.OdometerReading ?? "--"}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default VehicleGroupUpdate;
