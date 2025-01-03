import CustomTable from "../components/Table/CustomTable";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicleMasterWithPagination } from "../Data/Function";
import PreLoader from "../components/Skeleton/PreLoader";
import { endPointBasedOnURL } from "../Data/commonData";
import CustomTableComponent from "../components/Table/DataTable";
import { removeTempIds } from "../Redux/VehicleSlice/VehicleSlice";
import { handleRestSearchTerm } from "../Redux/PaginationSlice/PaginationSlice";

const VehicleMaster = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { vehicleMaster, loading, deletevehicleId } = useSelector(
    (state) => state.vehicles
  );
  const { page, limit, searchTerm } = useSelector((state) => state.pagination);

  useEffect(() => {
    // fetch data based on url
    if (deletevehicleId == "") {
      fetchVehicleMasterWithPagination(
        dispatch,
        token,
        endPointBasedOnURL[location.pathname.replace("/", "")],
        searchTerm,
        page,
        limit
      );
    }
  }, [location.href, deletevehicleId, page, limit, searchTerm]);

  // clear data after page change
  useEffect(() => {
    dispatch(handleRestSearchTerm());
    dispatch(removeTempIds());
  }, [location.href]);

  return (
    <>
      <CustomTableComponent
        Data={vehicleMaster?.data}
        pagination={vehicleMaster?.pagination}
        searchTermQuery={searchTerm}
      />
    </>
  );
  // : (
  //   <PreLoader />
  // );
};

export default VehicleMaster;
