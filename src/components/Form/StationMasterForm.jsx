import { useEffect, useState, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import Spinner from "../Spinner/Spinner";
import SelectDropDown from "../InputAndDropdown/SelectDropDown";
import { States } from "../../Data/commonData";
import PreLoader from "../Skeleton/PreLoader";
import { Link, useParams } from "react-router-dom";
import InputSearch from "../InputAndDropdown/InputSearch";
import { formatHourToTime } from "../../utils/index";
import GoogleSearchLocation from "../InputAndDropdown/GoogleSearchLocation";
const GeneralAddOn = lazy(() => import("../general/GeneralAddOn"));
const PaymentToggler = lazy(() => import("../station/PaymentToggler"));
const StationWeekOff = lazy(() => import("../station/StationWeekOff"));
const StationAttendanceForm = lazy(
  () => import("../station/StationAttendanceForm"),
);
import DatePicker from "../DateTimePicker/DateTimePicker";
import { useStationMasterData } from "../../hooks/use-station-master";
import InputSearchMulti from "../InputAndDropdown/InputSearchMulti";
import NoData from "../Error/NoData";

const SectionFallback = ({ height = "h-40" }) => (
  <div className={`w-full ${height} animate-pulse rounded-md bg-gray-100`} />
);

const toNumberOrEmpty = (v) =>
  v === null || v === undefined || v === "" || Number.isNaN(Number(v))
    ? ""
    : Number(v);

const StationMasterForm = ({ handleFormSubmit, loading }) => {
  const { id } = useParams();
  const { token, loggedInRole } = useSelector((state) => state.user);
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [zipCodeValue, setZipcodeValue] = useState(null);
  // station open and close time
  const [openStationTime, setOpenStationTime] = useState(null);
  const [closeStationTime, setCloseStationTime] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [cityValue, setCityValue] = useState("");

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

  if (!loading && vehicleMaster?.length === 0) {
    return <NoData message="Station Info Not Found" />;
  }

  const latitudeValue =
    latitude !== ""
      ? latitude
      : id
        ? toNumberOrEmpty(vehicleMaster?.[0]?.latitude)
        : "";
  const longitudeValue =
    longitude !== ""
      ? longitude
      : id
        ? toNumberOrEmpty(vehicleMaster?.[0]?.longitude)
        : "";
  const mapLinkValue = mapUrl || (id ? vehicleMaster?.[0]?.mapLink : "") || "";
  const cityHiddenValue =
    cityValue || (id ? vehicleMaster?.[0]?.city : "") || "";

  return collectedData != null ? (
    <>
      {/* station form  */}
      <form onSubmit={handleFormSubmit} className="mb-5">
        <div className="flex flex-wrap gap-4">
          <div className="w-full lg:w-[48%]">
            <InputSearch
              item={"User"}
              placeholder={"Select Station Master"}
              name={"userId"}
              token={token}
              value={id ? vehicleMaster?.[0]?.userId?.[0]?._id : ""}
              require={true}
            />
            <p className="mt-1 text-[13px] text-gray-500">
              The station manager is the contact person for this station. Their
              name and phone number are shown to customers.
            </p>
          </div>
          <div className="w-full lg:w-[48%]">
            <InputSearchMulti
              item={"User"}
              placeholder={"Select Fleet"}
              name={"fleetIds"}
              token={token}
              value={id ? vehicleMaster?.[0]?.fleetIds?.map((u) => u._id) : []}
              isAdmin={loggedInRole === "admin" ? false : true}
              skipRouteFilter={true}
            />
            <p className="mt-1 text-[13px] text-gray-500">
              Only managers can be assigned as fleet. They can mark attendance
              for this station but are not shown to customers.{" "}
              <Link
                to="/all-managers/add-new"
                className="text-theme underline underline-offset-2 hover:text-theme-dark"
              >
                Create a manager
              </Link>
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
            {latitudeValue !== "" && (
              <input type="hidden" name="latitude" value={latitudeValue} />
            )}
            {longitudeValue !== "" && (
              <input type="hidden" name="longitude" value={longitudeValue} />
            )}
            {mapLinkValue !== "" && (
              <input type="hidden" name="mapLink" value={mapLinkValue} />
            )}
            {cityHiddenValue !== "" && (
              <input type="hidden" name="city" value={cityHiddenValue} />
            )}
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
              value={id ? toNumberOrEmpty(vehicleMaster?.[0]?.pinCode) : ""}
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
        <Suspense fallback={<SectionFallback height="h-96" />}>
          <StationAttendanceForm id={id} />
        </Suspense>
      )}

      <div className="flex flex-wrap gap-x-8 gap-y-4 w-full lg:w-4/5 2xl:w-[75%]">
        {id && (
          <div className="flex-1 basis-72 min-w-0">
            <Suspense fallback={<SectionFallback />}>
              <PaymentToggler />
            </Suspense>
          </div>
        )}

        {id && (
          <div className="flex-1 basis-72 min-w-0 mb-3">
            <Suspense fallback={<SectionFallback height="h-24" />}>
              <StationWeekOff />
            </Suspense>
          </div>
        )}
      </div>

      {/* addon form  */}
      {id && (
        <Suspense fallback={<SectionFallback height="h-56" />}>
          <GeneralAddOn />
        </Suspense>
      )}
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
