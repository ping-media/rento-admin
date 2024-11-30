import CustomTable from "../components/Table/CustomTable";
import { formatPathNameToTitle } from "../utils";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicleMaster } from "../Data/Function";
import PreLoader from "../components/Skeleton/PreLoader";
import { endPointBasedOnURL } from "../Data/commonData";
import NotFound from "./NotFound";

const VehicleMaster = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { vehicleMaster, loading, deletevehicleId } = useSelector(
    (state) => state.vehicles
  );

  useEffect(() => {
    // console.log(endPointBasedOnURL[location.pathname.replace("/", "")]);
    // fetch data based on url
    if (deletevehicleId == "") {
      fetchVehicleMaster(
        dispatch,
        token,
        endPointBasedOnURL[location.pathname.replace("/", "")]
      );
    }
  }, [location.pathname, deletevehicleId]);

  return !loading ? (
    <>
      <CustomTable
        Data={vehicleMaster}
        pageTitle={formatPathNameToTitle(location.pathname)}
      />
    </>
  ) : (
    <PreLoader />
  );
};

export default VehicleMaster;
