import { useEffect } from "react";
import { useSelector } from "react-redux";
import { CollectiveComponent, Loader } from "../components/CommonComponents/commonComponents";
import { displayTableData } from "../constant";
import CreateNewVehicleTbl from "./CreateNewVehicleTbl";

const PendingVehicles = () => {
  const addNew = useSelector((state) => state.vehicles.addNew)
  const loading = useSelector((state) => state.theme.loading);
  useEffect(() => {
    displayTableData(`/getVehicleTblData?vehicleStatus=inActive`);
  }, []);
  return (
    <>
      {loading ? <Loader /> : ""}
      {!addNew ? <CollectiveComponent /> : <CreateNewVehicleTbl />}
    </>
  );
};

export default PendingVehicles;
