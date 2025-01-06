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
import { useState } from "react";

const BulkActionButtons = () => {
  const { isHeaderChecked, tempIds, tempLoading } = useSelector(
    (state) => state.vehicles
  );
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isOtpions, setIsOtpions] = useState(false);

  const toggleOptions = () => {
    if (isOtpions === true) {
      setIsOtpions(false);
    } else {
      setIsOtpions(true);
    }
  };

  //   edit status in bulk
  const handleEditAllStatus = (e) => {
    if (!tempIds)
      return handleAsyncError(dispatch, "unable to get Ids! try again.");
    const data = {
      vehicleIds: tempIds,
      updateData: { vehicleStatus: e.target.value },
    };
    return handleDeleteAndEditAllData(
      data,
      "edit",
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
      {location.pathname == "/all-vehicles" &&
        isHeaderChecked &&
        isHeaderChecked === true &&
        tempIds &&
        tempIds?.length > 0 && (
          <>
            <button
              className="bg-theme font-semibold text-gray-100 px-2.5 py-1.5 rounded-md shadow-lg hover:bg-theme-light hover:shadow-md inline-flex items-center gap-1 whitespace-nowrap relative"
              onClick={toggleOptions}
            >
              Edit All Status
              {isOtpions && (
                <div className="absolute top-10 w-full left-0 bg-white block rounded-xl shadow-md">
                  <input
                    type="button"
                    value="active"
                    className="text-black block w-full py-1 hover:bg-theme hover:text-gray-100 text-left px-2 capitalize transition-all duration-200 ease-in-out rounded-lg"
                    onClick={(e) => handleEditAllStatus(e)}
                  />
                  <input
                    type="button"
                    value="inactive"
                    className="text-black block w-full py-1 hover:bg-theme hover:text-gray-100 text-left px-2 capitalize transition-all duration-200 ease-in-out rounded-lg"
                    onClick={(e) => handleEditAllStatus(e)}
                  />
                </div>
              )}
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
              ) : (
                "Delete All"
              )}
            </button>
          </>
        )}
    </>
  );
};

export default BulkActionButtons;
