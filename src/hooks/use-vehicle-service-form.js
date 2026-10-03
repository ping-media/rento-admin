import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatLocalTimeIntoISO } from "../utils/index";
import { getData, postData } from "../Data/index";
import { handleAsyncError } from "../utils/Helper/handleAsyncError";
import { toggleVehicleServiceModal } from "../Redux/SideBarSlice/SideBarSlice";
import {
  handleMaintenanceLoading,
  removeBlockVehicleId,
  toggleRefresh,
} from "../Redux/VehicleSlice/VehicleSlice";

const useVehicleServiceForm = ({
  vehicleName,
  stationId,
  setMaintenanceVehicleId,
  isMaintenanceAdd,
  setIsMaintenanceAdd,
}) => {
  const dispatch = useDispatch();
  const { maintenanceLoading } = useSelector((state) => state.vehicles);
  const { token } = useSelector((state) => state.user);

  const formRef = useRef(null);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [selectedVehicleIds, setSelectedVehicleIds] = useState([]);
  const [isFetchingAvailable, setIsFetchingAvailable] = useState(false);
  const [actualFreeCount, setActualFreeCount] = useState(null);
  const [reservedByPendingBookings, setReservedByPendingBookings] = useState(0);

  const handleCheckAvailability = async () => {
    const formData = new FormData(formRef.current);
    const rawStartDate = formData.get("startDate");
    const rawEndDate = formData.get("endDate");

    if (!rawStartDate || !rawEndDate) {
      return handleAsyncError(
        dispatch,
        "Please select start and end date first.",
      );
    }

    if (new Date(rawEndDate) <= new Date(rawStartDate)) {
      return handleAsyncError(
        dispatch,
        "End date & time must be greater than start date & time.",
      );
    }

    const blockStartDate = rawStartDate.slice(0, 10);
    const blockEndDate = rawEndDate.slice(0, 10);

    try {
      setIsFetchingAvailable(true);
      const query = new URLSearchParams({
        ...(vehicleName ? { vehicleName } : {}),
        ...(stationId ? { stationId } : {}),
        blockStartDate,
        blockEndDate,
      });
      const response = await getData(`/vehicles/available?${query}`, token);
      if (response?.status === 200) {
        setAvailableVehicles(response?.data || []);
        setSelectedVehicleIds([]);
        setActualFreeCount(response?.actualFreeCount ?? null);
        setReservedByPendingBookings(response?.reservedByPendingBookings ?? 0);
      } else {
        return handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setIsFetchingAvailable(false);
    }
  };

  const toggleVehicleSelection = (vehicleId) => {
    setSelectedVehicleIds((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((vId) => vId !== vehicleId)
        : [...prev, vehicleId],
    );
  };

  const toggleSelectAll = () => {
    setSelectedVehicleIds((prev) =>
      prev.length === availableVehicles.length
        ? []
        : availableVehicles.map((v) => v._id),
    );
  };

  const handleSendVehicleToService = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    let startDate = formData.get("startDate");
    startDate = formatLocalTimeIntoISO(startDate);
    let endDate = formData.get("endDate");
    endDate = formatLocalTimeIntoISO(endDate);

    if (new Date(endDate) <= new Date(startDate)) {
      return handleAsyncError(
        dispatch,
        "End date & time must be greater than start date & time.",
      );
    }

    let reason = formData.get("reason")?.toLowerCase();

    if (selectedVehicleIds.length === 0) {
      return handleAsyncError(dispatch, "Please select at least one vehicle.");
    }

    if (!reason) {
      return handleAsyncError(dispatch, "All field required.");
    }

    const data = {
      startDate,
      endDate,
      reason,
      ...(selectedVehicleIds.length > 1
        ? { vehicleTableIds: selectedVehicleIds }
        : { vehicleTableId: selectedVehicleIds[0] }),
    };

    try {
      dispatch(handleMaintenanceLoading(true));
      const response = await postData(`/maintenanceVehicle`, data, token);
      if (response?.status === 200) {
        setMaintenanceVehicleId && setMaintenanceVehicleId([]);
        dispatch(toggleVehicleServiceModal());
        dispatch(removeBlockVehicleId());
        if (location.pathname.includes("/all-vehicles/details/")) {
          setIsMaintenanceAdd(!isMaintenanceAdd);
        } else {
          dispatch(toggleRefresh());
        }
        return handleAsyncError(dispatch, response?.message, "success");
      } else {
        return handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      dispatch(handleMaintenanceLoading(false));
    }
  };

  return {
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
  };
};

export default useVehicleServiceForm;
