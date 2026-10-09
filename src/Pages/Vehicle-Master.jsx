import { lazy, Suspense, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicleMasterWithPagination } from "../Data/Function";
import { endPointBasedOnURL } from "../Data/commonData";
import CustomTableComponent from "../components/Table/DataTable";
import {
  removeTempIds,
  restvehicleMaster,
} from "../Redux/VehicleSlice/VehicleSlice";
import { useLocation } from "react-router-dom";
import PreLoader from "../components/Skeleton/PreLoader";
const FilterSideBar = lazy(() => import("../components/SideBar/FilterSideBar"));
const VehicleStationModal = lazy(
  () => import("../components/Modal/StationModal"),
);
import useListParams from "../hooks/use-list-params";

const VehicleMaster = () => {
  const { vehicleMaster, deletevehicleId, tempLoading, loading, refresh } =
    useSelector((state) => state.vehicles);
  const {
    page,
    limit,
    searchTerm,
    searchType,
    vehiclesFilter,
    filters,
    stationId,
    setStationId,
  } = useListParams();
  const { loggedInRole, userStation, token } = useSelector(
    (state) => state.user,
  );
  const location = useLocation();
  const dispatch = useDispatch();

  const searchBasedOnPage = useMemo(() => {
    //this is  for usertype
    if (location.pathname === "/all-users") return "userType=customer";
    if (location.pathname === "/all-managers") return "userType=manager";
    if (loggedInRole === "manager" && userStation?.stationId) {
      return `stationId=${userStation?.stationId}`;
    }

    return "";
  }, [location.pathname, loggedInRole, userStation?.stationId]);

  // Memoize the endpoint
  const endpoint = useMemo(
    () => endPointBasedOnURL[location.pathname.replace("/", "")],
    [location.pathname],
  );

  // Memoize vehicle data and pagination separately
  const vehicleData = useMemo(() => {
    // if (!vehicleMaster?.data?.length) return undefined;
    const data = vehicleMaster?.data ?? [];

    if (location.pathname === "/all-vehicles") {
      return data.map((item) => ({
        vehicleNumber: item.vehicleNumber,
        vehicleName: item.vehicleName,
        stationName: item.stationName,
        currentBooking: item.currentBooking,
        maintenance: item.maintenance,
        vehicleStatus: item.vehicleStatus,
        ...item,
      }));
    }

    return data;
  }, [vehicleMaster?.data, location.pathname]);

  const paginationData = useMemo(
    () => vehicleMaster?.pagination,
    [vehicleMaster?.pagination],
  );

  const fetchData = useCallback(() => {
    if (!tempLoading?.loading && deletevehicleId === "") {
      fetchVehicleMasterWithPagination(
        dispatch,
        token,
        endpoint,
        searchTerm,
        page,
        limit,
        searchBasedOnPage,
        searchType,
        vehiclesFilter,
        filters,
        stationId,
      );
    }
  }, [
    tempLoading?.loading,
    deletevehicleId,
    dispatch,
    token,
    endpoint,
    searchTerm,
    page,
    limit,
    searchBasedOnPage,
    vehiclesFilter,
    filters,
    stationId,
  ]);

  // Fetch data effect
  useEffect(() => {
    fetchData();
  }, [fetchData, refresh]);

  // clear data after page change
  useEffect(() => {
    return () => {
      dispatch(restvehicleMaster());
      dispatch(removeTempIds());
    };
  }, []);

  const showVehicleStationModal = useMemo(
    () => location.pathname === "/vehicle-master",
    [location.pathname],
  );

  return (
    <>
      {/* filters and sorting  */}
      <FilterSideBar stationId={stationId} setStationId={setStationId} />
      {showVehicleStationModal && (
        <Suspense fallback={<PreLoader />}>
          <VehicleStationModal />
        </Suspense>
      )}

      {/* table data  */}
      <CustomTableComponent
        Data={vehicleData || []}
        pagination={paginationData}
        searchTermQuery={searchTerm}
        dataLoading={loading}
      />
    </>
  );
};

export default VehicleMaster;
