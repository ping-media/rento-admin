import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getData } from "../Data";

const useAvailableVehicles = ({
  stationId,
  bookingStartDateTime,
  bookingEndDateTime,
  excludeBookingId = null,
  initialSearch = "",
  enabled = true,
  limit = 10,
}) => {
  const { token } = useSelector((state) => state.user);

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleId, setVehicleId] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchVehicles = async (search = initialSearch) => {
    if (!enabled) return;

    try {
      if (vehicles.length === 0) {
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
        setVehicles([]);
      }
    } catch (error) {
      setVehicles([]);
    } finally {
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
