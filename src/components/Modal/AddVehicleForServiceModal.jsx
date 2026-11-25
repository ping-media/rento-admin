import Input from "../../components/InputAndDropdown/Input";
import { useDispatch, useSelector } from "react-redux";
import { toggleVehicleServiceModal } from "../../Redux/SideBarSlice/SideBarSlice";
import Spinner from "../../components/Spinner/Spinner";
import useVehicleServiceForm from "../../hooks/use-vehicle-service-form";
import { useMemo, useState } from "react";
import RepairOptionFields from "./_components/RepairOptionFields";

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
  const [vehicleSearch, setVehicleSearch] = useState("");
  const { isVehicleForServiceActive } = useSelector((state) => state.sideBar);

  const {
    formRef,
    availableVehicles,
    hasChecked,
    selectedVehicleIds,
    isFetchingAvailable,
    actualFreeCount,
    reservedByPendingBookings,
    maintenanceLoading,
    handleCheckAvailability,
    toggleVehicleSelection,
    toggleSelectAll,
    handleSendVehicleToService,
    isAdmin,
    isRepair,
    setIsRepair,
    repairType,
    setRepairType,
    odometer,
    setOdometer,
    mechanicId,
    setMechanicId,
  } = useVehicleServiceForm({
    vehicleName,
    stationId,
    setMaintenanceVehicleId,
    isMaintenanceAdd,
    setIsMaintenanceAdd,
  });

  const filteredVehicles = useMemo(() => {
    return (availableVehicles ?? []).filter((vehicle) =>
      `${vehicle.vehicleNumber} ${vehicle.stationName || ""}`
        .toLowerCase()
        .includes(vehicleSearch.toLowerCase().trim()),
    );
  }, [availableVehicles, vehicleSearch]);

  return (
    <div
      className={`fixed ${
        !isVehicleForServiceActive ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-5 mx-auto shadow-xl rounded-md bg-white max-w-xl">
        <div className="flex justify-between border-b p-2">
          <div className="flex items-center gap-2">
            <h2 className="text-theme font-semibold text-lg capitalize">
              Shedule Block & Repair
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

        <div className="p-4 sm:p-6 pt-2 text-center">
          <form
            ref={formRef}
            onSubmit={handleSendVehicleToService}
            className="lg:max-h-[32rem] 2xl:max-h-[36rem] overflow-y-scroll"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-[48.5%] sm:w-1/2">
                <Input
                  item={"startDate"}
                  type="datetime-local"
                  require={true}
                  isModalClose={isVehicleForServiceActive}
                />
              </div>

              <div className="w-[48.5%] sm:w-1/2">
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
                <div className="flex items-center justify-between px-2 py-1.5 border-b bg-gray-50 group">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={
                        selectedVehicleIds.length === availableVehicles.length
                      }
                      onChange={toggleSelectAll}
                      className="accent-theme group-hover:cursor-pointer"
                    />
                    Select All ({availableVehicles.length})
                  </label>
                  <span className="text-xs text-gray-500">
                    {selectedVehicleIds.length} selected
                  </span>
                </div>
                <div className="p-2 border-b">
                  <input
                    type="text"
                    placeholder="Search by vehicle number or station..."
                    value={vehicleSearch}
                    onChange={(e) => setVehicleSearch(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border rounded-md outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredVehicles.map((vehicle) => (
                    <label
                      key={vehicle._id}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm border-b last:border-b-0 cursor-pointer hover:bg-gray-50 uppercase group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedVehicleIds.includes(vehicle._id)}
                        onChange={() => toggleVehicleSelection(vehicle._id)}
                        className="accent-theme group-hover:cursor-pointer"
                      />
                      {vehicle.vehicleNumber}
                      {vehicle.stationName ? ` — ${vehicle.stationName}` : ""}
                    </label>
                  ))}

                  {filteredVehicles.length === 0 && (
                    <p className="px-2 py-3 text-sm text-center text-gray-500">
                      No vehicles found.
                    </p>
                  )}
                </div>
              </div>
            )}

            {hasChecked &&
              !isFetchingAvailable &&
              availableVehicles.length === 0 && (
                <div className="mb-2 text-sm bg-gray-50 border border-dashed border-gray-300 text-gray-600 rounded-md px-3 py-4">
                  <p className="font-medium text-gray-700">
                    No vehicles available for this date & time
                  </p>
                  <p className="mt-1 text-xs">
                    Every matching vehicle is either under maintenance or
                    assigned to a booking in this period. Try a different time
                    range.
                  </p>
                </div>
              )}

            <div className="mb-3">
              <Input
                item={"reason"}
                require={true}
                isModalClose={isVehicleForServiceActive}
                isCapital={false}
              />
            </div>
            <RepairOptionFields
              isRepair={isRepair}
              setIsRepair={setIsRepair}
              repairType={repairType}
              setRepairType={setRepairType}
              odometer={odometer}
              setOdometer={setOdometer}
              mechanicId={mechanicId}
              setMechanicId={setMechanicId}
              isAdmin={isAdmin}
              showOdometer={selectedVehicleIds.length === 1}
            />
            <button
              type="submit"
              className="bg-theme px-4 py-2 text-gray-100 gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none disabled:bg-gray-400 w-full flex items-center justify-center"
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
