import { useEffect } from "react";
import { useSelector } from "react-redux";
import { CollectiveComponent, Loader } from "../components/CommonComponents/commonComponents";
import { displayTableData } from "../constant";
import CreateNewVehicleTbl from "./CreateNewVehicleTbl";

const AllVehiclesTbl = () => {
  const addNew = useSelector((state) => state.vehicles.addNew)
  const loading = useSelector((state) => state.theme.loading);
  useEffect(() => {
    displayTableData(`/getVehicleTblData`);
  }, []);
  return (
    <>
      {loading ? <Loader /> : ""}
      {!addNew ? <CollectiveComponent /> : <CreateNewVehicleTbl />}
    </>
  );
};

export default AllVehiclesTbl;
