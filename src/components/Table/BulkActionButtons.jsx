import { useDispatch, useSelector } from "react-redux";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import {
  changeTempLoadingFalse,
  changeTempLoadingTrue,
  handleIsHeaderChecked,
  removeTempIds,
  restvehicleMaster,
} from "../../Redux/VehicleSlice/VehicleSlice";
import Spinner from "../../components/Spinner/Spinner";
import { handleDeleteAndEditAllData } from "../../Data/Function";
import { toggleVehicleUpdateModal } from "../../Redux/SideBarSlice/SideBarSlice";
import ChangeBulkVehicle from "../../components/Modal/ChangeBulkVehicle";

const BulkActionButtons = () => {
  const { isHeaderChecked, isOneOrMoreHeaderChecked, tempIds, tempLoading } =
    useSelector((state) => state.vehicles);
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const toggleOptions = () => {
    dispatch(toggleVehicleUpdateModal());
  };

  //   delete data in bulk
  const handleDeleteAll = () => {
    if (!tempIds)
      return handleAsyncError(dispatch, "unable to get Ids! try again.");
    const data = {
      vehicleIds: tempIds,
      deleteRec: true,
    };
    return handleDeleteAndEditAllData(
      data,
      "delete",
      handleAsyncError,
      changeTempLoadingTrue,
      changeTempLoadingFalse,
      dispatch,
      removeTempIds,
      restvehicleMaster,
      token,
      handleIsHeaderChecked
    );
  };

  return (
    <>
      {/* modal for updating vehicle data  */}
      <ChangeBulkVehicle />

      {location.pathname == "/all-vehicles" &&
        ((isHeaderChecked &&
          isHeaderChecked === true &&
          tempIds &&
          tempIds?.length > 0) ||
          (isOneOrMoreHeaderChecked &&
            isOneOrMoreHeaderChecked === true &&
            tempIds &&
            tempIds?.length > 0)) && (
          <>
            <button
              className="bg-theme font-semibold text-gray-100 px-2.5 py-1.5 rounded-md shadow-lg hover:bg-theme-light hover:shadow-md inline-flex items-center gap-1 whitespace-nowrap relative"
              onClick={toggleOptions}
            >
              {isHeaderChecked && isHeaderChecked === true
                ? "Edit All"
                : "Edit"}
            </button>
            <button
              className="bg-theme font-semibold text-gray-100 px-2.5 py-1.5 rounded-md shadow-lg hover:bg-theme-light hover:shadow-md inline-flex items-center gap-1 whitespace-nowrap disabled:bg-gray-400"
              onClick={handleDeleteAll}
              disabled={
                !tempLoading?.loading && tempLoading?.operation === "delete"
              }
            >
              {!tempLoading?.loading && tempLoading?.operation === "delete" ? (
                <Spinner message={"deleting..."} />
              ) : isHeaderChecked && isHeaderChecked === true ? (
                "Delete All"
              ) : (
                "Delete"
              )}
            </button>
          </>
        )}
    </>
  );
};

export default BulkActionButtons;
