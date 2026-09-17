import Input from "../../components/InputAndDropdown/Input";
import { useDispatch, useSelector } from "react-redux";
import { toggleVehicleServiceModal } from "../../Redux/SideBarSlice/SideBarSlice";
// import { formatLocalTimeIntoISO } from "../../utils/index";
// import { getData, postData } from "../../Data/index";
// import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import Spinner from "../../components/Spinner/Spinner";
import useVehicleServiceForm from "../../hooks/use-vehicle-service-form";
// import {
//   handleMaintenanceLoading,
//   removeBlockVehicleId,
//   toggleRefresh,
// } from "../../Redux/VehicleSlice/VehicleSlice";
// import { useState, useRef } from "react";
// import { useParams } from "react-router-dom";

const AddVehicleForServiceModal = ({
  loading,
  vehiclesId = [],
  setMaintenanceVehicleId,
  isMaintenanceAdd,
  setIsMaintenanceAdd,
  vehicleName,
  stationId,
}) => {
  const dispatch = useDispatch();
  const { isVehicleForServiceActive } = useSelector((state) => state.sideBar);

  const {
    formRef,
    availableVehicles,
    selectedVehicleIds,
    isFetchingAvailable,
    actualFreeCount,
    reservedByPendingBookings,
    maintenanceLoading,
    handleCheckAvailability,
    toggleVehicleSelection,
    toggleSelectAll,
    handleSendVehicleToService,
  } = useVehicleServiceForm({
    vehicleName,
    stationId,
    setMaintenanceVehicleId,
    isMaintenanceAdd,
    setIsMaintenanceAdd,
  });

  // const AddVehicleForServiceModal = ({
  //   loading,
  //   vehiclesId = [],
  //   setMaintenanceVehicleId,
  //   isMaintenanceAdd,
  //   setIsMaintenanceAdd,
  //   vehicleName,
  //   stationId,
  // }) => {
  //   const dispatch = useDispatch();
  //   const { id } = useParams();
  //   const { isVehicleForServiceActive } = useSelector((state) => state.sideBar);
  //   const { blockVehicleId, maintenanceLoading } = useSelector(
  //     (state) => state.vehicles,
  //   );
  //   const { token } = useSelector((state) => state.user);

  //   const formRef = useRef(null);
  //   const [availableVehicles, setAvailableVehicles] = useState([]);
  //   const [selectedVehicleIds, setSelectedVehicleIds] = useState([]);
  //   const [actualFreeCount, setActualFreeCount] = useState(null);
  //   const [reservedByPendingBookings, setReservedByPendingBookings] = useState(0);
  //   const [isFetchingAvailable, setIsFetchingAvailable] = useState(false);

  // const handleCheckAvailability = async () => {
  //   const formData = new FormData(formRef.current);
  //   const rawStartDate = formData.get("startDate");
  //   const rawEndDate = formData.get("endDate");

  //   if (!rawStartDate || !rawEndDate) {
  //     return handleAsyncError(
  //       dispatch,
  //       "Please select start and end date first.",
  //     );
  //   }

  //   if (new Date(rawEndDate) <= new Date(rawStartDate)) {
  //     return handleAsyncError(
  //       dispatch,
  //       "End date & time must be greater than start date & time.",
  //     );
  //   }

  //   const blockStartDate = rawStartDate.slice(0, 10);
  //   const blockEndDate = rawEndDate.slice(0, 10);

  //   try {
  //     setIsFetchingAvailable(true);
  //     const query = new URLSearchParams({
  //       ...(vehicleName ? { vehicleName } : {}),
  //       ...(stationId ? { stationId } : {}),
  //       blockStartDate,
  //       blockEndDate,
  //     });
  //     const response = await getData(`/vehicles/available?${query}`, token);
  //     if (response?.status === 200) {
  //       setAvailableVehicles(response?.data || []);
  //       setSelectedVehicleIds([]);
  //       setActualFreeCount(response?.actualFreeCount ?? null);
  //       setReservedByPendingBookings(response?.reservedByPendingBookings ?? 0);
  //     } else {
  //       return handleAsyncError(dispatch, response?.message);
  //     }
  //   } catch (error) {
  //     return handleAsyncError(dispatch, error?.message);
  //   } finally {
  //     setIsFetchingAvailable(false);
  //   }
  // };

  // const toggleVehicleSelection = (vehicleId) => {
  //   setSelectedVehicleIds((prev) =>
  //     prev.includes(vehicleId)
  //       ? prev.filter((id) => id !== vehicleId)
  //       : [...prev, vehicleId],
  //   );
  // };

  // const toggleSelectAll = () => {
  //   setSelectedVehicleIds((prev) =>
  //     prev.length === availableVehicles.length
  //       ? []
  //       : availableVehicles.map((v) => v._id),
  //   );
  // };

  // apply vehicle for Maintenance
  // const handleSendVehicleToService = async (event) => {
  //   event.preventDefault();
  //   const formData = new FormData(event.target);
  //   let vehicleTableId = blockVehicleId;
  //   // on vehicle details page if vehiclesId is coming than take those ids otherwise take id from params
  //   if (location?.pathname.includes("/all-vehicles/details/") && id) {
  //     vehicleTableId = id;
  //   }
  //   let startDate = formData.get("startDate");
  //   startDate = formatLocalTimeIntoISO(startDate);
  //   let endDate = formData.get("endDate");
  //   endDate = formatLocalTimeIntoISO(endDate);

  //   if (new Date(endDate) <= new Date(startDate)) {
  //     return handleAsyncError(
  //       dispatch,
  //       "End date & time must be greater than start date & time.",
  //     );
  //   }

  //   let reason = formData.get("reason")?.toLowerCase();

  //   if (selectedVehicleIds.length === 0) {
  //     return handleAsyncError(dispatch, "Please select at least one vehicle.");
  //   }

  //   // if (vehicleTableId === "") {
  //   //   handleAsyncError(dispatch, "Unable to fetch vehicle! try again");
  //   //   return;
  //   // }

  //   // if (!vehicleTableId && !startDate && !endDate && !reason) {
  //   if (!reason) {
  //     handleAsyncError(dispatch, "All field required.");
  //     return;
  //   }

  //   let data = {
  //     // vehicleTableId,
  //     startDate,
  //     endDate,
  //     reason,
  //     ...(selectedVehicleIds.length > 1
  //       ? { vehicleTableIds: selectedVehicleIds }
  //       : { vehicleTableId: selectedVehicleIds[0] }),
  //   };

  //   // if (location?.pathname.includes("/all-vehicles/details/") && id) {
  //   //   data = {
  //   //     ...data,
  //   //     ...(Array.isArray(vehiclesId) && vehiclesId?.length > 0
  //   //       ? { vehicleTableIds: vehiclesId } // bulk
  //   //       : { vehicleTableId }), // single
  //   //   };
  //   // } else {
  //   //   data = {
  //   //     ...data,
  //   //     vehicleTableId,
  //   //   };
  //   // }

  //   // if (!data)
  //   //   return handleAsyncError(
  //   //     dispatch,
  //   //     "unable to apply for maintenance! try again.",
  //   //   );

  //   // console.log("data to send", data);
  //   // return;

  //   try {
  //     dispatch(handleMaintenanceLoading(true));
  //     const response = await postData(`/maintenanceVehicle`, data, token);
  //     if (response?.status === 200) {
  //       setMaintenanceVehicleId && setMaintenanceVehicleId([]);
  //       dispatch(toggleVehicleServiceModal());
  //       dispatch(removeBlockVehicleId());
  //       if (location.pathname.includes("/all-vehicles/details/")) {
  //         setIsMaintenanceAdd(!isMaintenanceAdd);
  //       } else {
  //         dispatch(toggleRefresh());
  //       }
  //       return handleAsyncError(dispatch, response?.message, "success");
  //     } else {
  //       return handleAsyncError(dispatch, response?.message);
  //     }
  //   } catch (error) {
  //     return handleAsyncError(dispatch, error?.message);
  //   } finally {
  //     dispatch(handleMaintenanceLoading(false));
  //   }
  // };

  return (
    <div
      className={`fixed ${
        !isVehicleForServiceActive ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-12 sm:top-5 mx-auto shadow-xl rounded-md bg-white max-w-xl">
        <div className="flex justify-between border-b p-2">
          <div className="flex items-center gap-2">
            <h2 className="text-theme font-semibold text-lg capitalize">
              Shedule Maintenance
            </h2>
            {selectedVehicleIds.length > 0 && (
              <span className="text-md text-left font-normal text-theme border px-2 py-0.5 rounded-full border-theme bg-theme/10">
                {selectedVehicleIds.length} Vehicles Selected
              </span>
            )}
          </div>
          <button
            onClick={() => dispatch(toggleVehicleServiceModal())}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            disabled={loading || maintenanceLoading || false}
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

        <div className="p-6 pt-2 text-center">
          <form ref={formRef} onSubmit={handleSendVehicleToService}>
            {/* {vehiclesId?.length > 0 && (
              <div className="pb-2 border-b mb-2 text-left">
                <span className="text-md text-left font-normal text-theme border px-2 py-0.5 rounded-full border-theme bg-theme/10">
                  {vehiclesId?.length} Vehicles Selected
                </span>
              </div>
            )} */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1/2">
                <Input
                  item={"startDate"}
                  type="datetime-local"
                  require={true}
                  isModalClose={isVehicleForServiceActive}
                />
              </div>

              <div className="w-1/2">
                <Input
                  item={"endDate"}
                  type="datetime-local"
                  require={true}
                  isModalClose={isVehicleForServiceActive}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckAvailability}
              className="mb-2 w-full bg-theme/10 text-theme border border-theme rounded-md py-1.5 text-sm hover:bg-theme/20 transition disabled:opacity-50"
              disabled={isFetchingAvailable}
            >
              {isFetchingAvailable ? <Spinner /> : "Check Availability"}
            </button>

            {availableVehicles.length > 0 && reservedByPendingBookings > 0 && (
              <div className="mb-2 text-left text-sm bg-amber-50 border border-amber-300 text-amber-800 rounded-md px-2 py-1.5">
                {reservedByPendingBookings} of these {availableVehicles.length}{" "}
                vehicle
                {availableVehicles.length === 1 ? "" : "s"} may be needed to
                cover pending booking
                {reservedByPendingBookings === 1 ? "" : "s"} for this model.
                Only ~{actualFreeCount} are likely to stay free — pick carefully
                before blocking all of them.
              </div>
            )}

            {availableVehicles.length > 0 && (
              <div className="mb-2 text-left border rounded-md">
                <div className="flex items-center justify-between px-2 py-1.5 border-b bg-gray-50">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={
                        selectedVehicleIds.length === availableVehicles.length
                      }
                      onChange={toggleSelectAll}
                    />
                    Select All ({availableVehicles.length})
                  </label>
                  <span className="text-xs text-gray-500">
                    {selectedVehicleIds.length} selected
                  </span>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {availableVehicles.map((vehicle) => (
                    <label
                      key={vehicle._id}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm border-b last:border-b-0 cursor-pointer hover:bg-gray-50 uppercase"
                    >
                      <input
                        type="checkbox"
                        checked={selectedVehicleIds.includes(vehicle._id)}
                        onChange={() => toggleVehicleSelection(vehicle._id)}
                      />
                      {vehicle.vehicleNumber}
                      {vehicle.stationName ? ` — ${vehicle.stationName}` : ""}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-2">
              <Input
                item={"reason"}
                require={true}
                isModalClose={isVehicleForServiceActive}
                isCapital={false}
              />
            </div>
            <button
              type="submit"
              className="bg-theme px-4 py-2 text-gray-100 gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none disabled:bg-gray-400 w-full flex items-center justify-center"
              // disabled={maintenanceLoading}
              disabled={maintenanceLoading || selectedVehicleIds.length === 0}
            >
              {!maintenanceLoading ? (
                "Submit"
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
