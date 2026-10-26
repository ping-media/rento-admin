import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useListParams from "../hooks/use-list-params";
import Spinner from "../components/Spinner/Spinner";
import AttendanceMonth from "../components/Attendance/AttendanceMonth";
import { getFullData, postData } from "../Data/index";
import { handleAsyncError } from "../utils/Helper/handleAsyncError";
import { fmtDate, fmtTime } from "../utils/attendance";
import TablePageHeader from "../components/Table/TablePageHeader";
const AttendancePersonFilter = lazy(
  () => import("../components/Attendance/AttendancePersonFilter"),
);
const ConfirmModal = lazy(() => import("../components/Modal/ConfirmModal"));
const FilterSideBar = lazy(() => import("../components/SideBar/FilterSideBar"));

const getPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("Location is not supported on this device"));
    }
    navigator.geolocation.getCurrentPosition(
      resolve,
      (err) =>
        reject(
          new Error(
            err.code === 1
              ? "Location permission denied. Allow location access and try again."
              : "Unable to get your location. Please try again.",
          ),
        ),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  });

const Attendance = () => {
  const dispatch = useDispatch();
  const [confirmOut, setConfirmOut] = useState(false);
  const { token, currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.userType === "admin";
  const { attendanceUser } = useListParams();
  // admin picks the person through the URL, a manager only ever sees themselves
  const userId = isAdmin ? attendanceUser : currentUser?._id;

  const [searchInput, setSearchInput] = useState("");
  const [today, setToday] = useState(null);
  const [marking, setMarking] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadToday = useCallback(async () => {
    if (isAdmin || !currentUser?.userType) return;
    try {
      const res = await getFullData("/attendance/today", token);
      setToday(res?.data || null);
    } catch (error) {
      handleAsyncError(dispatch, error?.message);
    }
  }, [isAdmin, currentUser?.userType, token, dispatch]);

  useEffect(() => {
    loadToday();
  }, [loadToday]);

  const handleMark = async (type) => {
    setMarking(true);
    try {
      const pos = await getPosition();
      const { latitude, longitude, accuracy } = pos.coords;
      const response = await postData(
        type === "checkIn" ? "/attendance/check-in" : "/attendance/check-out",
        { latitude, longitude, accuracy },
        token,
        "post",
      );
      if (response?.status === 200) {
        handleAsyncError(dispatch, response.message, "success");
        loadToday();
        setRefreshKey((k) => k + 1); // refresh the month list
      } else {
        handleAsyncError(dispatch, response?.message || "Something went wrong");
      }
    } catch (error) {
      handleAsyncError(dispatch, error?.message);
    } finally {
      setMarking(false);
    }
  };

  const handleConfirmCheckOut = async () => {
    await handleMark("checkOut");
    setConfirmOut(false);
  };

  const todayData = today?.status === 200 ? today.data : null;
  const todayStatus = todayData?.record?.checkOut?.at
    ? `Checked out at ${fmtTime(todayData.record.checkOut.at)}`
    : todayData?.record?.status === "absent"
      ? "Marked absent"
      : todayData?.record?.checkIn?.at
        ? `Checked in at ${fmtTime(todayData.record.checkIn.at)}`
        : "Not checked in";

  const markButton = (type, label) => (
    <button
      onClick={() =>
        type === "checkOut" ? setConfirmOut(true) : handleMark(type)
      }
      disabled={marking}
      className="w-full rounded-md bg-theme px-5 py-3 font-bold text-white hover:bg-theme-dark disabled:bg-gray-400 sm:w-auto"
    >
      {marking ? <Spinner message={"Getting location"} /> : label}
    </button>
  );

  return (
    <div>
      {isAdmin && (
        <>
          <div className="mb-4">
            <div className="w-full sm:hidden">
              <Suspense
                fallback={
                  <div className="h-12 w-full rounded-md bg-gray-200 animate-pulse" />
                }
              >
                <AttendancePersonFilter variant="compact" />
              </Suspense>
            </div>

            <TablePageHeader
              inputSearchQuery={searchInput}
              setInputSearchQuery={setSearchInput}
            />
          </div>

          <Suspense fallback={null}>
            <FilterSideBar stationId="" setStationId={() => {}} />
          </Suspense>
        </>
      )}

      {!isAdmin && (
        <div className="mb-4 w-full rounded-xl bg-white p-4 shadow">
          {todayData ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold capitalize text-gray-800 dark:text-gray-100">
                  {todayData.station?.stationName}
                </p>
                <p className="text-xs text-gray-500">
                  {fmtDate(todayData.date)} · {todayStatus}
                </p>
              </div>
              {todayData.canCheckIn && markButton("checkIn", "Check In")}
              {todayData.canCheckOut && markButton("checkOut", "Check Out")}
              {!todayData.canCheckIn && !todayData.canCheckOut && (
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                    ✓
                  </span>
                  Attendance Marked completed
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              {today?.message || "Loading..."}
            </p>
          )}
        </div>
      )}

      <AttendanceMonth
        userId={userId}
        isAdmin={isAdmin}
        refreshKey={refreshKey}
      />

      <Suspense fallback={null}>
        <ConfirmModal
          active={confirmOut}
          onClose={() => setConfirmOut(false)}
          onConfirm={handleConfirmCheckOut}
          loading={marking}
          loadingText="Checking out"
          title="Check out now?"
          message="This records your check-out time and location. It can't be undone, and you can't check out again today."
          confirmText="Yes, check out"
          cancelText="Not yet"
        />
      </Suspense>
    </div>
  );
};

export default Attendance;
