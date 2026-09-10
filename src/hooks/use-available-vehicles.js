import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../Data";
import { handleAsyncError } from "../utils/Helper/handleAsyncError";

const useAvailableVehicles = ({
  stationId,
  vehicleName = "",
  bookingStartDateTime,
  bookingEndDateTime,
  excludeBookingId = null,
  initialSearch = "",
  enabled = true,
  limit = 10,
}) => {
  const { token } = useSelector((state) => state.user);
  const hasInitiallyLoaded = useRef(false);

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleId, setVehicleId] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchVehicles = async (search = initialSearch) => {
    if (!enabled) return;

    try {
      if (!hasInitiallyLoaded.current) {
        setInitialLoading(true);
      } else {
        setSearchLoading(true);
      }

      let endpoint =
        `/getAllVehiclesAvailable` +
        `?stationId=${stationId}` +
        `&BookingStartDateAndTime=${bookingStartDateTime}` +
        `&BookingEndDateAndTime=${bookingEndDateTime}` +
        `&page=1` +
        `&limit=${limit}`;

      if (vehicleName?.trim() !== "") {
        endpoint += `&vehicleName=${encodeURIComponent(vehicleName)}`;
      }

      if (excludeBookingId) {
        endpoint += `&excludeBookingId=${excludeBookingId}`;
      }

      if (search?.trim()) {
        endpoint += `&search=${encodeURIComponent(search.trim())}`;
      }

      const response = await getData(endpoint, token);

      if (response?.status === 200) {
        setVehicles(response.data || []);
      } else {
        const message =
          response?.unavailabilityReasons?.[0]?.reason ??
          response?.message ??
          "Unable to get vehicle! try again";

        handleAsyncError(dispatch, message);
        setVehicles([]);
      }
    } catch (error) {
      setVehicles([]);
    } finally {
      hasInitiallyLoaded.current = true;
      setInitialLoading(false);
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (initialSearch?.trim()) {
      fetchVehicles(initialSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = () => {
    setVehicles([]);
    setSelectedVehicle(null);
    setVehicleId("");
  };

  return {
    vehicles,
    initialLoading,
    searchLoading,

    vehicleId,
    setVehicleId,

    selectedVehicle,
    setSelectedVehicle,

    fetchVehicles,
    reset,
  };
};

export default useAvailableVehicles;
