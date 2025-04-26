import { lazy, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicleMasterWithPagination } from "../Data/Function";
import { endPointBasedOnURL } from "../Data/commonData";
import CustomTableComponent from "../components/Table/DataTable";
import {
  removeTempIds,
  restvehicleMaster,
} from "../Redux/VehicleSlice/VehicleSlice";
import { handleRestPagination } from "../Redux/PaginationSlice/PaginationSlice";
const FilterSideBar = lazy(() => import("../components/SideBar/FilterSideBar"));
const AddVehicleForServiceModal = lazy(() =>
  import("../components/Modal/AddVehicleForServiceModal")
);

const VehicleMaster = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { vehicleMaster, deletevehicleId, tempLoading, loading, refresh } =
    useSelector((state) => state.vehicles);
  const { page, limit, searchTerm, searchType, vehiclesFilter } = useSelector(
    (state) => state.pagination
  );
  const { loggedInRole, userStation } = useSelector((state) => state.user);

  const searchBasedOnPage = useMemo(() => {
    //this is  for usertype
    if (location.pathname === "/all-users") return "userType=customer";
    if (location.pathname === "/all-managers") return "userType=manager";
    // this is for user role
    if (loggedInRole !== "" && loggedInRole === "manager") {
      return `stationId=${userStation?.stationId}`;
    }
    return "";
  }, [location.pathname]);

  useEffect(() => {
    if (!tempLoading?.loading && deletevehicleId === "") {
      fetchVehicleMasterWithPagination(
        dispatch,
        token,
        endPointBasedOnURL[location.pathname.replace("/", "")],
        searchTerm,
        page,
        limit,
        searchBasedOnPage,
        searchType,
        vehiclesFilter
      );
    }
  }, [
    location.pathname,
    deletevehicleId,
    page,
    limit,
    searchTerm,
    tempLoading?.loading,
    dispatch,
    token,
    endPointBasedOnURL,
    searchBasedOnPage,
    refresh,
    vehiclesFilter,
  ]);

  // clear data after page change
  useEffect(() => {
    return () => {
      dispatch(restvehicleMaster());
      dispatch(handleRestPagination());
      dispatch(removeTempIds());
    };
  }, []);

  return (
    <>
      {/* filters and sorting  */}
      <FilterSideBar />
      {location.pathname === "/all-vehicles" && <AddVehicleForServiceModal />}
      {/* table data  */}
      <CustomTableComponent
        Data={vehicleMaster?.data}
        pagination={vehicleMaster?.pagination}
        searchTermQuery={searchTerm}
        dataLoading={loading}
      />
    </>
  );
};

export default VehicleMaster;
