import { useEffect } from "react";
import { useSelector } from "react-redux";
import { CollectiveComponent, Loader } from "../components/CommonComponents/commonComponents";
import { displayTableData } from "../constant";
import CreateNewPlan from "./CreateNewPlan";

const AllPlans = () => {
  const addNew = useSelector((state) => state.vehicles.addNew)
  const loading = useSelector((state) => state.theme.loading);
  useEffect(() => {
    displayTableData(`/getPlanData`);
  }, []);
  return (
    <>
      {loading ? <Loader /> : ""}
      {!addNew ? <CollectiveComponent /> : <CreateNewPlan />}
    </>
  );
};

export default AllPlans;
