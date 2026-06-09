import { lazy, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicleMasterWithPagination } from "../Data/Function";
import { endPointBasedOnURL } from "../Data/commonData";
import CustomTableComponent from "../components/Table/DataTable";
import {
  removeTempIds,
  restvehicleMaster,
} from "../Redux/VehicleSlice/VehicleSlice";
import { handleRestPagination } from "../Redux/PaginationSlice/PaginationSlice";
import { useLocation } from "react-router-dom";
const FilterSideBar = lazy(() => import("../components/SideBar/FilterSideBar"));
const AddVehicleForServiceModal = lazy(
  () => import("../components/Modal/AddVehicleForServiceModal"),
);
const VehicleStationModal = lazy(
  () => import("../components/Modal/StationModal"),
);

const VehicleMaster = () => {
  const [stationId, setStationId] = useState("");
  const { vehicleMaster, deletevehicleId, tempLoading, loading, refresh } =
    useSelector((state) => state.vehicles);
  const { page, limit, searchTerm, searchType, vehiclesFilter, filters } =
    useSelector((state) => state.pagination);
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
    return vehicleMaster?.data?.length ? vehicleMaster.data : undefined;
  }, [vehicleMaster?.data]);

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
      const currentPath = location.pathname;
      const isGoingToDetails = currentPath.includes("/details/");

      if (!isGoingToDetails && currentPath !== "/all-bookings") {
        dispatch(handleRestPagination());
      }

      dispatch(restvehicleMaster());
      dispatch(removeTempIds());
    };
  }, []);

  // Memoize conditional renders
  const showAddVehicleModal = useMemo(
    () => location.pathname === "/all-vehicles",
    [location.pathname],
  );

  const showVehicleStationModal = useMemo(
    () => location.pathname === "/vehicle-master",
    [location.pathname],
  );

  return (
    <>
      {/* filters and sorting  */}
      <FilterSideBar stationId={stationId} setStationId={setStationId} />
      {showAddVehicleModal && <AddVehicleForServiceModal />}
      {showVehicleStationModal && <VehicleStationModal />}

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
