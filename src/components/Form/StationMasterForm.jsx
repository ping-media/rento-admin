import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import Spinner from "../Spinner/Spinner";
import SelectDropDown from "../InputAndDropdown/SelectDropDown";
import { States } from "../../Data/commonData";
import PreLoader from "../Skeleton/PreLoader";
import { useParams } from "react-router-dom";
import InputSearch from "../InputAndDropdown/InputSearch";
import { formatHourToTime } from "../../utils/index";
import GoogleSearchLocation from "../../components/InputAndDropdown/GoogleSearchLocation";
import GeneralAddOn from "../../components/general/GeneralAddOn";
import PaymentToggler from "../station/PaymentToggler";
import DatePicker from "../../components/DateTimePicker/DateTimePicker";
import { useStationMasterData } from "../../hooks/use-station-master";
import InputSearchMulti from "../../components/InputAndDropdown/InputSearchMulti";
import { postData } from "../../Data";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";

const StationMasterForm = ({ handleFormSubmit, loading }) => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [zipCodeValue, setZipcodeValue] = useState(null);
  // station open and close time
  const [openStationTime, setOpenStationTime] = useState(null);
  const [closeStationTime, setCloseStationTime] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [cityValue, setCityValue] = useState("");

  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const dispatch = useDispatch();

  const { data: collectedData } = useStationMasterData();

  // updating the station opening and closing time here
  useEffect(() => {
    if (id) {
      if (vehicleMaster?.[0]?.openStartTime) {
        const stationOpenTime = formatHourToTime(
          vehicleMaster[0].openStartTime,
        );
        setOpenStationTime(stationOpenTime);
      }
      if (vehicleMaster?.[0]?.openEndTime) {
        const stationCloseTime = formatHourToTime(vehicleMaster[0].openEndTime);
        setCloseStationTime(stationCloseTime);
      }
    }
  }, [id, vehicleMaster?.[0]?.openStartTime, vehicleMaster?.[0]?.openEndTime]);

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

  if (vehicleMaster?.length === 0) {
    return <PreLoader />;
  }

  return collectedData != null ? (
    <>
      {/* station form  */}
      <form onSubmit={handleFormSubmit} className="mb-5">
        <div className="flex flex-wrap gap-4">
          <>
            <div className="w-full lg:w-[48%]">
              <InputSearch
                item={"User"}
                placeholder={"Select Station Master"}
                name={"userId"}
                token={token}
                value={id ? vehicleMaster?.[0]?.userId?.[0]?._id : ""}
                require={true}
              />
              <p className="mt-1 text-xs text-gray-500">
                The station manager is the contact person for this station.
                Their name and phone number are shown to customers.
              </p>
            </div>
            <div className="w-full lg:w-[48%]">
              <InputSearchMulti
                item={"User"}
                placeholder={"Select Fleet"}
                name={"fleetIds"}
                token={token}
                value={
                  id ? vehicleMaster?.[0]?.fleetIds?.map((u) => u._id) : []
                }
              />
              <p className="mt-1 text-xs text-gray-500">
                Fleet staff can mark attendance for this station but are not
                shown to customers.
              </p>
            </div>
            <div className="w-full lg:w-[48%]">
              <TimePicker
                label="Select Station Open Time"
                timeValue={openStationTime}
                setValueChange={setOpenStationTime}
                item="openStartTime"
              />
            </div>
            <div className="w-full lg:w-[48%]">
              <TimePicker
                label="Select Station Close Time"
                timeValue={closeStationTime}
                setValueChange={setCloseStationTime}
                item="openEndTime"
              />
            </div>
            <div className="w-full lg:w-[48%]">
              <SelectDropDown
                item={"locationId"}
                options={collectedData?.locationId?.filter(
                  (location) => location?.locationStatus !== "inactive",
                )}
                value={id && vehicleMaster?.[0]?.locationId}
                setCity={setCityValue}
                require={true}
                placeholder={"City"}
              />
            </div>
            <div className="w-full lg:w-[48%]">
              <Input
                item={"stationName"}
                value={id && vehicleMaster?.[0]?.stationName}
                require={true}
              />
            </div>
            <div className="w-full lg:w-[48%]">
              <input
                type="hidden"
                name="latitude"
                value={
                  latitude !== ""
                    ? latitude
                    : id
                      ? Number(vehicleMaster?.[0]?.latitude)
                      : ""
                }
              />
              <input
                type="hidden"
                name="longitude"
                value={
                  longitude !== ""
                    ? longitude
                    : id
                      ? Number(vehicleMaster?.[0]?.longitude)
                      : ""
                }
              />
              <input
                type="hidden"
                name="mapLink"
                value={mapUrl || (id ? vehicleMaster?.[0]?.mapLink : "") || ""}
              />
              <input
                type="hidden"
                name="city"
                value={cityValue || (id ? vehicleMaster?.[0]?.city : "") || ""}
              />
              {/* seaching address & lat & long  */}
              <GoogleSearchLocation
                item={"address"}
                setLatitude={setLatitude}
                setLongitude={setLongitude}
                setUrl={setMapUrl}
                value={id && vehicleMaster?.[0]?.address}
              />
            </div>
            <div className="w-full lg:w-[48%]">
              <SelectDropDown
                item={"state"}
                options={States}
                value={id && vehicleMaster?.[0]?.state}
                require={true}
              />
            </div>
            <div className="w-full lg:w-[48%]">
              <SelectDropDown
                item={"isGstActive"}
                options={["active", "inactive"]}
                value={id && vehicleMaster?.[0]?.isGstActive}
                isSearchEnable={false}
                require={true}
              />
            </div>
            <div className="w-full lg:w-[48%]">
              <input
                type="hidden"
                name="stationId"
                value={id ? vehicleMaster?.[0]?.stationId : zipCodeValue}
              />
              <Input
                item={"pinCode"}
                type="number"
                value={id && Number(vehicleMaster?.[0]?.pinCode)}
                setValueChange={setZipcodeValue}
                require={true}
              />
            </div>
            <div className="w-full lg:w-[48%]">
              <Input
                item={"googleReviewLink"}
                value={id && vehicleMaster?.[0]?.googleReviewLink}
                isCapital={false}
              />
            </div>
          </>

          <button
            className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-theme focus:ring-opacity-50 disabled:bg-gray-400"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <Spinner message={"uploading"} />
            ) : id ? (
              "Update"
            ) : (
              "Add New"
            )}
          </button>
        </div>
      </form>

      {/* attendance settings: separate form, same submit handler */}
      {id && (
        <>
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Attendance settings
            </h3>
            <p className="text-xs text-gray-500">
              Leave check-in or check-out time empty to skip the late or
              early-leave flag in reports.
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
                  value={
                    vehicleMaster?.[0]?.attendanceRules?.fullDayHours ?? 12
                  }
                  placeholder="Full day hours (0 = off)"
                />
              </div>
              <p className="w-full text-xs text-gray-500">
                Full day hours is the fallback: when no half-day time below is
                set, working fewer hours than this counts as a half day.
              </p>

              <p className="w-full text-base font-semibold uppercase text-gray-500">
                Check-in rules
              </p>
              <div className="w-full lg:w-[48%]">
                <Input
                  item={"requiredCheckIn"}
                  type="time"
                  value={vehicleMaster?.[0]?.attendanceRules?.checkInTime}
                />
              </div>
              <div className="w-full lg:w-[48%]">
                <Input
                  item={"lateGraceMinutes"}
                  type="number"
                  value={
                    vehicleMaster?.[0]?.attendanceRules?.lateGraceMinutes ?? 15
                  }
                  placeholder="Late grace (minutes)"
                />
              </div>
              <div className="w-full lg:w-[48%]">
                <Input
                  item={"halfDayCheckIn"}
                  type="time"
                  value={
                    vehicleMaster?.[0]?.attendanceRules?.halfDayCheckInTime
                  }
                />
                <p className="mt-1 text-xs text-gray-500">
                  Counts as a half day if the person checks in after this time,
                  because they missed the first half. Example: with 12:00 here,
                  checking in at 12:30 is a half day. Leave empty to skip this
                  rule.
                </p>
              </div>
              <p className="w-full text-xs text-gray-500">
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
                  value={vehicleMaster?.[0]?.attendanceRules?.checkOutTime}
                />
              </div>
              <div className="w-full lg:w-[48%]">
                <Input
                  item={"earlyLeaveGraceMinutes"}
                  type="number"
                  value={
                    vehicleMaster?.[0]?.attendanceRules
                      ?.earlyLeaveGraceMinutes ?? 0
                  }
                  placeholder="Early leave grace (minutes)"
                />
              </div>
              <div className="w-full lg:w-[48%]">
                <Input
                  item={"halfDayCheckOut"}
                  type="time"
                  value={
                    vehicleMaster?.[0]?.attendanceRules?.halfDayCheckOutTime
                  }
                />
                <p className="mt-1 text-xs text-gray-500">
                  Counts as a half day if the person checks out before this
                  time, because they missed the second half. Example: with 15:00
                  here, checking out at 14:00 is a half day. Leave empty to skip
                  this rule.
                </p>
              </div>
              <p className="w-full text-xs text-gray-500">
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
      )}

      {id && <PaymentToggler />}

      {/* addon form  */}
      {id && <GeneralAddOn />}
    </>
  ) : (
    <PreLoader />
  );
};

export default StationMasterForm;

const TimePicker = ({
  label,
  timeValue,
  setValueChange,
  item,
  isRequire = true,
}) => {
  return (
    <div className="w-full relative">
      <label
        htmlFor={"openStartTime"}
        className="block text-gray-800 font-semibold text-sm capitalize text-left"
      >
        {label} {isRequire && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-2">
        <DatePicker
          timeValue={timeValue}
          setTimeValueChanger={setValueChange}
          name={item}
          timeOnly
          hourlyOnly
        />
      </div>
    </div>
  );
};
