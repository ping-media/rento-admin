import CustomTable from "../components/Table/Table";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { CollectiveComponent, LinkComponent, Loader } from "../components/CommonComponents/commonComponents";
import CreateNewStation from "./CreateNewStation";
import { displayTableData } from "../constant";

const AllStations = () => {
  const addNew = useSelector((state) => state.vehicles.addNew)
  const loading = useSelector((state) => state.theme.loading);
  useEffect(() => {
    displayTableData(`/getStationData`);
  }, []);
  return (
    <>
      {loading ? <Loader /> : ""}
      {!addNew ? <CollectiveComponent /> : <CreateNewStation />}
    </>
  );
};

export default AllStations;
