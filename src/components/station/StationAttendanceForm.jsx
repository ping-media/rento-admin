import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import Spinner from "../Spinner/Spinner";
import { postData } from "../../Data";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";

const StationAttendanceForm = ({ id }) => {
  const { token } = useSelector((state) => state.user);
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const dispatch = useDispatch();

  const handleAttendanceSubmit = async (event) => {
    event.preventDefault();
    if (!id) {
      return handleAsyncError(dispatch, "Save the station first");
    }

    const form = Object.fromEntries(new FormData(event.target).entries());
    const hhmm = /^([01]\d|2[0-3]):[0-5]\d$/;
    const numOrEmpty = (v) => (v === undefined || v === "" ? "" : Number(v));

    const radius = Number(form.attendanceRadiusMeters);
    const lateGrace = numOrEmpty(form.lateGraceMinutes);
    const earlyGrace = numOrEmpty(form.earlyLeaveGraceMinutes);
    const fullDayHours = numOrEmpty(form.fullDayHours);

    // same rules as the backend, so the admin sees the problem immediately
    let error = "";
    if (!(radius >= 20 && radius <= 5000)) {
      error = "Allowed distance must be between 20 and 5000 meters";
    } else if (
      [
        form.requiredCheckIn,
        form.requiredCheckOut,
        form.halfDayCheckIn,
        form.halfDayCheckOut,
      ].some((t) => t && !hhmm.test(t))
    ) {
      error = "Times must be in HH:mm format";
    } else if (
      form.requiredCheckIn &&
      form.halfDayCheckIn &&
      form.halfDayCheckIn <= form.requiredCheckIn
    ) {
      error = "Half-day check-in must be later than the required check-in";
    } else if (
      form.requiredCheckOut &&
      form.halfDayCheckOut &&
      form.halfDayCheckOut >= form.requiredCheckOut
    ) {
      error = "Half-day check-out must be earlier than the required check-out";
    } else if (
      (lateGrace !== "" && !(lateGrace >= 0)) ||
      (earlyGrace !== "" && !(earlyGrace >= 0))
    ) {
      error = "Grace minutes cannot be negative";
    } else if (
      fullDayHours !== "" &&
      !(fullDayHours >= 0 && fullDayHours <= 24)
    ) {
      error = "Full day hours must be between 0 and 24";
    }
    if (error) return handleAsyncError(dispatch, error);

    // only attendance fields are sent, an empty time clears that rule
    const payload = {
      _id: id,
      attendanceRadiusMeters: radius,
      requiredCheckIn: form.requiredCheckIn || "",
      lateGraceMinutes: lateGrace,
      halfDayCheckIn: form.halfDayCheckIn || "",
      requiredCheckOut: form.requiredCheckOut || "",
      earlyLeaveGraceMinutes: earlyGrace,
      halfDayCheckOut: form.halfDayCheckOut || "",
      fullDayHours,
    };

    setAttendanceLoading(true);
    try {
      const response = await postData("/createStation", payload, token);
      if (response?.status === 200) {
        handleAsyncError(dispatch, "Attendance settings saved", "success");
      } else {
        handleAsyncError(
          dispatch,
          response?.message || "Unable to save attendance settings",
        );
      }
    } catch (err) {
      handleAsyncError(dispatch, err?.message);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const rules = vehicleMaster?.[0]?.attendanceRules;

  return (
    <>
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          Attendance settings
        </h3>
        <p className="text-[13px] text-gray-500">
          Leave check-in or check-out time empty to skip the late or early-leave
          flag in reports.
        </p>
      </div>

      <form onSubmit={handleAttendanceSubmit} className="mb-5">
        <div className="flex flex-wrap gap-4">
          <p className="w-full text-base font-semibold uppercase text-gray-500">
            General
          </p>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"attendanceRadiusMeters"}
              type="number"
              value={vehicleMaster?.[0]?.attendanceRadiusMeters ?? 200}
              placeholder="Allowed distance from station (meters)"
              require={true}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"fullDayHours"}
              type="number"
              value={rules?.fullDayHours ?? 12}
              placeholder="Full day hours (0 = off)"
            />
          </div>
          <p className="w-full text-[13px] text-gray-500">
            Full day hours is the fallback: when no half-day time below is set,
            working fewer hours than this counts as a half day.
          </p>

          <p className="w-full text-base font-semibold uppercase text-gray-500">
            Check-in rules
          </p>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"requiredCheckIn"}
              type="time"
              value={rules?.checkInTime}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"lateGraceMinutes"}
              type="number"
              value={rules?.lateGraceMinutes ?? 15}
              placeholder="Late grace (minutes)"
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"halfDayCheckIn"}
              type="time"
              value={rules?.halfDayCheckInTime}
            />
            <p className="mt-1 text-[13px] text-gray-500">
              Counts as a half day if the person checks in after this time,
              because they missed the first half. Example: with 12:00 here,
              checking in at 12:30 is a half day. Leave empty to skip this rule.
            </p>
          </div>
          <p className="w-full text-[13px] text-gray-500">
            Late after required time plus grace. Checking in later than the
            half-day time counts as a half day.
          </p>

          <p className="w-full text-base font-semibold uppercase text-gray-500">
            Check-out rules
          </p>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"requiredCheckOut"}
              type="time"
              value={rules?.checkOutTime}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"earlyLeaveGraceMinutes"}
              type="number"
              value={rules?.earlyLeaveGraceMinutes ?? 0}
              placeholder="Early leave grace (minutes)"
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"halfDayCheckOut"}
              type="time"
              value={rules?.halfDayCheckOutTime}
            />
            <p className="mt-1 text-[13px] text-gray-500">
              Counts as a half day if the person checks out before this time,
              because they missed the second half. Example: with 15:00 here,
              checking out at 14:00 is a half day. Leave empty to skip this
              rule.
            </p>
          </div>
          <p className="w-full text-[13px] text-gray-500">
            Leaving before the half-day time counts as a half day. Leave any
            time empty to skip that rule.
          </p>
          <button
            className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-theme focus:ring-opacity-50 disabled:bg-gray-400"
            type="submit"
            disabled={attendanceLoading}
          >
            {attendanceLoading ? (
              <Spinner message={"saving"} />
            ) : (
              "Save Attendance Settings"
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default StationAttendanceForm;
