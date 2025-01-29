import Input from "../../components/InputAndDropdown/Input";
import { useDispatch, useSelector } from "react-redux";
import { toggleVehicleServiceModal } from "../../Redux/SideBarSlice/SideBarSlice";
import { useParams } from "react-router-dom";
import { formatLocalTimeIntoISO } from "../../utils/index";
import { postData } from "../../Data/index";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { useState } from "react";
import Spinner from "../../components/Spinner/Spinner";

const AddVehicleForServiceModal = ({ loading }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { isVehicleForServiceActive } = useSelector((state) => state.sideBar);
  const [formLoading, setFormLoading] = useState(false);
  const { token } = useSelector((state) => state.user);

  // apply vehicle for Maintenance
  const handleSendVehicleToService = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const vehicleTableId = id;
    let startDate = formData.get("startDate");
    startDate = formatLocalTimeIntoISO(startDate);
    let endDate = formData.get("endDate");
    endDate = formatLocalTimeIntoISO(endDate);

    const data = {
      vehicleTableId,
      startDate,
      endDate,
    };

    if (!data)
      return handleAsyncError(
        dispatch,
        "unable to apply for maintenance! try again."
      );

    try {
      setFormLoading(true);
      const response = await postData("/maintenanceVehicle", data, token);
      if (response?.status === 200) {
        dispatch(toggleVehicleServiceModal());
        return handleAsyncError(dispatch, response?.message, "success");
      } else {
        return handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div
      className={`fixed ${
        !isVehicleForServiceActive ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-md">
        <div className="flex justify-between p-2">
          <h2 className="text-theme font-semibold text-lg uppercase">
            Shedule Maintenance
          </h2>
          <button
            onClick={() => dispatch(toggleVehicleServiceModal())}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            disabled={loading || false}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className="p-6 pt-0 text-center">
          <form onSubmit={handleSendVehicleToService}>
            <div className="mb-2">
              <Input item={"startDate"} type="datetime-local" />
            </div>
            <div className="mb-2">
              <Input item={"endDate"} type="datetime-local" />
            </div>
            <button
              type="submit"
              className="bg-theme px-4 py-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none disabled:bg-gray-400"
              disabled={formLoading}
            >
              {!formLoading ? (
                "Add vehicle"
              ) : (
                <Spinner message={"loading..."} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVehicleForServiceModal;
