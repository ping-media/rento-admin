import { useEffect, useMemo, useState } from "react";
import useListParams from "./use-list-params";
import useStationOptions from "./use-station-options";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../Data/index";
import { handleAsyncError } from "../utils/Helper/handleAsyncError";

// export const REPORT_TABS = [
//   ["monthly", "Monthly (Vehicle-wise)"],
//   ["fleet", "Fleet Summary"],
// ];

const currentMonth = () => new Date().toLocaleDateString("en-CA").slice(0, 7);

const useMaintenanceReports = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  const {
    month: monthParam,
    // dateFrom: from,
    // dateTo: to,
    stationId,
    searchTerm,
    page,
    limit,
    setPage,
    setLimit,
    // reportTab,
    updateParams,
  } = useListParams();
  const [monthly, setMonthly] = useState(null);
  // const [fleet, setFleet] = useState(null);
  const [loading, setLoading] = useState(false);

  const [lifetime, setLifetime] = useState({
    open: false,
    vehicle: null,
    data: null,
    loading: false,
  });

  // const tab = reportTab || "monthly";
  const month = monthParam || currentMonth();
  const stations = useStationOptions();

  // const setTab = (v) => updateParams({ reportTab: v === "monthly" ? "" : v });
  const setMonth = (v) => updateParams({ month: v });
  // const setFrom = (v) => updateParams({ dateFrom: v });
  // const setTo = (v) => updateParams({ dateTo: v });
  const setStation = (v) => updateParams({ stationId: v });

  const load = async (url, onSuccess) => {
    setLoading(true);
    try {
      const res = await getData(url, token);
      if (res?.status === 200) onSuccess(res.data);
      else handleAsyncError(dispatch, res?.message);
    } catch (e) {
      handleAsyncError(dispatch, e?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = new URLSearchParams({ month });
    if (stationId) q.set("stationId", stationId);
    load(`/maintenance-report/vehicle-monthly?${q}`, setMonthly);
  }, [month, stationId]);
  // useEffect(() => {
  //   const q = new URLSearchParams();
  //   if (stationId) q.set("stationId", stationId);

  //   if (tab === "monthly") {
  //     q.set("month", month);
  //     load(`/maintenance-report/vehicle-monthly?${q}`, setMonthly);
  //   } else {
  //     if (from) q.set("from", from);
  //     if (to) q.set("to", to);
  //     load(`/maintenance-report/fleet-summary?${q}`, setFleet);
  //   }
  // }, [tab, month, from, to, stationId]);

  const openLifetime = async (vehicle) => {
    setLifetime({ open: true, vehicle, data: null, loading: true });
    try {
      const res = await getData(
        `/maintenance-report/vehicle-lifetime/${vehicle.vehicleTableId}`,
        token,
      );
      if (res?.status === 200) {
        setLifetime({ open: true, vehicle, data: res.data, loading: false });
      } else {
        handleAsyncError(dispatch, res?.message);
        setLifetime({ open: false, vehicle: null, data: null, loading: false });
      }
    } catch (e) {
      handleAsyncError(dispatch, e?.message);
      setLifetime({ open: false, vehicle: null, data: null, loading: false });
    }
  };

  const closeLifetime = () =>
    setLifetime({ open: false, vehicle: null, data: null, loading: false });

  // vehicle number search, applied on the loaded month; the total follows the filtered rows
  const filteredMonthly = useMemo(() => {
    if (!monthly) return null;
    const term = searchTerm.trim().toLowerCase();
    if (!term) return monthly;
    const vehicles = monthly.vehicles.filter((v) =>
      (v.vehicleNumber || "").toLowerCase().includes(term),
    );
    const grandTotal =
      Math.round(vehicles.reduce((t, v) => t + v.total, 0) * 100) / 100;
    return { ...monthly, vehicles, grandTotal };
  }, [monthly, searchTerm]);

  const allRows = filteredMonthly?.vehicles || [];
  const totalPages = Math.max(Math.ceil(allRows.length / limit), 1);
  const rows = allRows.slice((page - 1) * limit, page * limit);

  const hasFilters = !!(stationId || searchTerm || monthParam);
  const clearFilters = () =>
    updateParams({ stationId: "", searchTerm: "", month: "" });
  // const hasFilters = !!(stationId || searchTerm || monthParam || from || to);
  // const clearFilters = () =>
  //   updateParams({
  //     stationId: "",
  //     searchTerm: "",
  //     month: "",
  //     dateFrom: "",
  //     dateTo: "",
  //   });

  return {
    // tab,
    // setTab,
    // month,
    // setMonth,
    // from,
    // setFrom,
    // to,
    // setTo,
    // monthly: filteredMonthly,
    // fleet,
    month,
    setMonth,
    rows,
    page,
    limit,
    totalPages,
    setPage,
    setLimit,
    stationId,
    stations,
    setStation,
    hasFilters,
    clearFilters,
    loading,
    lifetime,
    openLifetime,
    closeLifetime,
  };
};

export default useMaintenanceReports;
