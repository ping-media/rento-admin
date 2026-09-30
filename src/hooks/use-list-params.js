import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// IMPORTANT: keep these equal to the initial values in your PaginationSlice
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const DEFAULT_SEARCH_TYPE = "all";

// state name -> url param name
const KEYS = {
  page: "page",
  limit: "limit",
  searchTerm: "q",
  searchType: "qType",
  filters: "f", // raw sidebar filter string, e.g. "rideStatus=pending"
  filterName: "fn", // active filter title, e.g. "Pending Pickups"
  stationId: "station", // station dropdown on all-bookings
  vehicleName: "vName", // vehiclesFilter.vehicleName
  vehicleSearch: "vSearch", // vehiclesFilter.search
  vehicleStationId: "vStation", // vehiclesFilter.stationId
  maintenanceType: "vMaint", // vehiclesFilter.maintenanceType
};

const toPositiveInt = (value, fallback) => {
  const n = parseInt(value, 10);
  return Number.isInteger(n) && n > 0 ? n : fallback;
};

const isDefaultValue = (key, value) =>
  (key === "page" && value === DEFAULT_PAGE) ||
  (key === "limit" && value === DEFAULT_LIMIT) ||
  (key === "searchType" && value === DEFAULT_SEARCH_TYPE);

const useListParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // ---------- READ ----------
  const page = toPositiveInt(searchParams.get(KEYS.page), DEFAULT_PAGE);
  const limit = toPositiveInt(searchParams.get(KEYS.limit), DEFAULT_LIMIT);
  const searchTerm = searchParams.get(KEYS.searchTerm) ?? "";
  const searchType = searchParams.get(KEYS.searchType) ?? DEFAULT_SEARCH_TYPE;
  const filters = searchParams.get(KEYS.filters) ?? "";
  const filterName = searchParams.get(KEYS.filterName) ?? "";
  const stationId = searchParams.get(KEYS.stationId) ?? "";

  const vehicleName = searchParams.get(KEYS.vehicleName) ?? "";
  const vehicleSearch = searchParams.get(KEYS.vehicleSearch) ?? "";
  const vehicleStationId = searchParams.get(KEYS.vehicleStationId) ?? "";
  const maintenanceType = searchParams.get(KEYS.maintenanceType) ?? "";

  // same shape as your old redux `vehiclesFilter`, memoized so it stays
  // stable for useCallback/useEffect dependencies
  const vehiclesFilter = useMemo(
    () => ({
      vehicleName,
      search: vehicleSearch,
      stationId: vehicleStationId,
      maintenanceType,
    }),
    [vehicleName, vehicleSearch, vehicleStationId, maintenanceType],
  );

  // ---------- WRITE ----------
  // updates: { searchTerm: "abc", stationId: "12" } (use the state names above)
  // Any change except `page` resets page to 1 automatically.
  const updateParams = useCallback(
    (updates, { replace = true, resetPage = true } = {}) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);

          Object.entries(updates).forEach(([key, value]) => {
            const urlKey = KEYS[key];
            if (!urlKey) return;

            const isEmpty =
              value === undefined || value === null || value === "";

            if (isEmpty || isDefaultValue(key, value)) {
              next.delete(urlKey);
            } else {
              next.set(urlKey, String(value));
            }
          });

          if (resetPage && !("page" in updates)) {
            next.delete(KEYS.page);
          }

          return next;
        },
        { replace },
      );
    },
    [setSearchParams],
  );

  // ---------- SHORTCUTS ----------
  const setPage = useCallback(
    (value) => updateParams({ page: value }),
    [updateParams],
  );

  const setLimit = useCallback(
    (value) => updateParams({ limit: Number(value) }), // page resets automatically
    [updateParams],
  );

  const setSearchTerm = useCallback(
    (value) => updateParams({ searchTerm: value }),
    [updateParams],
  );

  const setStationId = useCallback(
    (value) => updateParams({ stationId: value }),
    [updateParams],
  );

  const setSidebarFilter = useCallback(
    (tag, title) => updateParams({ filters: tag, filterName: title }),
    [updateParams],
  );

  const setVehiclesFilter = useCallback(
    ({ vehicleName, search, stationId, maintenanceType }) =>
      updateParams({
        vehicleName,
        vehicleSearch: search,
        vehicleStationId: stationId,
        maintenanceType,
      }),
    [updateParams],
  );

  const resetVehiclesFilter = useCallback(
    () =>
      updateParams({
        vehicleName: "",
        vehicleSearch: "",
        vehicleStationId: "",
        maintenanceType: "",
      }),
    [updateParams],
  );

  const clearAll = useCallback(
    () => setSearchParams({}, { replace: true }),
    [setSearchParams],
  );

  return {
    // values
    page,
    limit,
    searchTerm,
    searchType,
    filters,
    filterName,
    stationId,
    vehiclesFilter,
    // writers
    updateParams,
    setPage,
    setLimit,
    setSearchTerm,
    setStationId,
    setSidebarFilter,
    setVehiclesFilter,
    resetVehiclesFilter,
    clearAll,
  };
};

export default useListParams;
