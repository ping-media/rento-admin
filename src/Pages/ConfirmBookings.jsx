import { useEffect } from "react";
import { useSelector } from "react-redux";
import { CollectiveComponent, Loader } from "../components/CommonComponents/commonComponents";
import CreateNewUser from "./CreateNewUser";
import { displayTableData } from "../constant";

const ConfirmBookings = () => {
  const addNew = useSelector((state) => state.vehicles.addNew)
  const loading = useSelector((state) => state.theme.loading);
  useEffect(() => {
    displayTableData(`/getBookings?bookingStatus=confirmed`);
  }, []);
  return (
    <>
      {loading ? <Loader /> : ""}
      {!addNew ? <CollectiveComponent /> : <CreateNewUser />}
    </>
  );
};

export default ConfirmBookings;
