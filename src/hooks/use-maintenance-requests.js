import { useEffect, useState } from "react";
import useListParams from "./use-list-params";
import { getData, getFullData } from "../Data";
import { REPAIR_TYPES } from "../utils/maintenance";
import { handleAsyncError } from "../utils/Helper/handleAsyncError";
import { useDispatch, useSelector } from "react-redux";
import useStationScope from "./use-station-scope";

export const STATUS_OPTIONS = [
  ["all", "All"],
  ["in_progress", "In Progress"],
  ["pending", "Pending"],
  ["completed", "Awaiting Approval"],
  ["approved", "Approved"],
  ["cancelled", "Cancelled"],
];
export const TYPE_OPTIONS = [["", "All types"], ...REPAIR_TYPES];

const useMaintenanceRequests = () => {
  const dispatch = useDispatch();
  const { withStation } = useStationScope();
  const { token, loggedInRole } = useSelector((state) => state.user);
  const isAdmin = loggedInRole === "admin";

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const {
    page,
    limit,
    setPage,
    setLimit,
    searchTerm,
    stationId,
    repairStatus,
    repairType,
    updateParams,
  } = useListParams();

  const status = repairStatus || "all";
  const type = repairType;
  const [stations, setStations] = useState([]);

  const fetchRows = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page, limit });
      if (status !== "all") q.set("status", status);
      if (type) q.set("type", type);
      if (searchTerm) q.set("search", searchTerm);
      if (isAdmin && stationId) q.set("stationId", stationId);

      const res = await getData(
        withStation(`/maintenance-request/list?${q}`),
        token,
      );
      if (res?.status === 200) {
        setRows(res.data || []);
        setTotal(res.total || 0);
      } else {
        setRows([]);
        setTotal(0);
        handleAsyncError(dispatch, res?.message);
      }
    } catch (e) {
      handleAsyncError(dispatch, e?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, [status, type, searchTerm, stationId, page, limit]);

  // station list for the admin dropdown
  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      try {
        const res = await getFullData(
          "/getStationData?page=1&limit=200",
          token,
        );
        setStations(res?.data?.data || []);
      } catch (e) {
        setStations([]);
      }
    })();
  }, [isAdmin, token]);

  const setFilter = (key, value) => updateParams({ [key]: value }); // page resets automatically
  const hasFilters = !!(repairStatus || repairType || stationId || searchTerm);
  const clearFilters = () =>
    updateParams({
      repairStatus: "",
      repairType: "",
      stationId: "",
      searchTerm: "",
    });

  return {
    isAdmin,
    status,
    type,
    stationId,
    stations,
    setFilter,
    hasFilters,
    clearFilters,
    page,
    setPage,
    limit,
    setLimit,
    rows,
    total,
    totalPages: Math.max(Math.ceil(total / limit), 1),
    loading,
    selectedId,
    setSelectedId,
    refresh: fetchRows,
  };
};

export default useMaintenanceRequests;
