import { lazy, useCallback, useEffect, useMemo } from "react";
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
    // this is for user role
    // if (loggedInRole !== "" && loggedInRole === "manager") {
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
  const vehicleData = useMemo(() => vehicleMaster?.data, [vehicleMaster?.data]);
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
    searchType,
    vehiclesFilter,
    filters,
  ]);

  // Fetch data effect
  useEffect(() => {
    fetchData();
  }, [fetchData, refresh]);

  // useEffect(() => {
  //   if (!tempLoading?.loading && deletevehicleId === "") {
  //     fetchVehicleMasterWithPagination(
  //       dispatch,
  //       token,
  //       endPointBasedOnURL[location.pathname.replace("/", "")],
  //       searchTerm,
  //       page,
  //       limit,
  //       searchBasedOnPage,
  //       searchType,
  //       vehiclesFilter,
  //       filters,
  //     );
  //   }
  // }, [
  //   location.pathname,
  //   deletevehicleId,
  //   page,
  //   limit,
  //   searchTerm,
  //   tempLoading?.loading,
  //   dispatch,
  //   token,
  //   endPointBasedOnURL,
  //   searchBasedOnPage,
  //   refresh,
  //   vehiclesFilter,
  //   filters,
  // ]);

  // clear data after page change
  useEffect(() => {
    return () => {
      const nextPath = window.location.pathname;
      const isGoingToDetails = nextPath.includes("/details");

      if (!isGoingToDetails && nextPath !== "/all-bookings") {
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
      <FilterSideBar />
      {showAddVehicleModal && <AddVehicleForServiceModal />}
      {showVehicleStationModal && <VehicleStationModal />}
      {/* {location.pathname === "/all-vehicles" && <AddVehicleForServiceModal />}
      {location.pathname === "/vehicle-master" && <VehicleStationModal />} */}

      {/* table data  */}
      <CustomTableComponent
        // Data={vehicleMaster?.data}
        // pagination={vehicleMaster?.pagination}
        Data={vehicleData}
        pagination={paginationData}
        searchTermQuery={searchTerm}
        dataLoading={loading}
      />
    </>
  );
};

export default VehicleMaster;
