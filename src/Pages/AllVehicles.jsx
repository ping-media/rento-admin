import { useEffect } from "react";
import { useSelector } from "react-redux";
import { CollectiveComponent, Loader } from "../components/CommonComponents/commonComponents";
import CreateNewVehicle from "./CreateNewVehicle";
import { displayTableData } from "../constant";

const AllVehicles = () => {
  const addNew = useSelector((state) => state.vehicles.addNew)
  const loading = useSelector((state) => state.theme.loading);
  useEffect(() => {
    displayTableData(`/getVehicleMasterData`);
  }, []);
  return (
    <>
      {loading ? <Loader /> : ""}
      {!addNew ? <CollectiveComponent /> : <CreateNewVehicle />}
    </>
  );
};

export default AllVehicles;
