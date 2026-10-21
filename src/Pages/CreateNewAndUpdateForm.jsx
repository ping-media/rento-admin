import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  formatPathNameToTitle,
  handlePreviousPage,
  modifyUrl,
} from "../utils/index.js";
import {
  fetchVehicleMasterById,
  handleCreateAndUpdateVehicle,
} from "../Data/Function.js";
import PreLoader from "../components/Skeleton/PreLoader.jsx";
import { endPointBasedOnURL, forms } from "../Data/commonData.js";
import {
  removeTempIds,
  updateStationWeeklyOff,
} from "../Redux/VehicleSlice/VehicleSlice.js";
import { tableIcons } from "../Data/Icons.jsx";
import {
  toggleForgetPasswordModal,
  toogleKycModalActive,
} from "../Redux/SideBarSlice/SideBarSlice.js";
import {
  fromWeeklyOffValue,
  toWeeklyOffValue,
} from "../components/DropDown/WeeklyOffSelect.jsx";
import { postData } from "../Data/index.js";
import { handleAsyncError } from "../utils/Helper/handleAsyncError.js";
const WeeklyOffSelect = lazy(
  () => import("../components/DropDown/WeeklyOffSelect.jsx"),
);
const ForgetPasswordModal = lazy(
  () => import("../components/Modal/ForgetPasswordModal.jsx"),
);
const UserKycApproveModal = lazy(
  () => import("../components/Modal/UserKycApproveModal.jsx"),
);

const CreateNewAndUpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [formLoading, setFormLoading] = useState(false);
  const { token, loggedInRole } = useSelector((state) => state.user);
  const { loading, vehicleMaster, tempIds } = useSelector(
    (state) => state.vehicles,
  );

  const isId = Boolean(id?.trim());
  const isStationEditPage =
    location.pathname.includes("/station-master/") && isId;

  const isUsersPageWithoutId = useMemo(() => {
    return (
      ["/all-users/", "/all-managers/"].some((path) =>
        location.pathname.includes(path),
      ) && isId
    );
  }, [location.pathname, isId]);

  // fetch data based on id taking from url
  useEffect(() => {
    if (!isId) return;

    fetchVehicleMasterById(
      dispatch,
      id,
      token,
      location?.pathname.includes("/all-users/") ||
        location.pathname.includes("/all-managers/")
        ? "/getDocument?userId="
        : endPointBasedOnURL[modifyUrl(location.pathname).replace("/", "")],
    );
  }, [dispatch, id, token]);

  // inside the component
  const savedWeeklyOff = toWeeklyOffValue(vehicleMaster?.[0]?.stationWeeklyOff);
  const [weeklyOffValue, setWeeklyOffValue] = useState(savedWeeklyOff);
  const [savingOff, setSavingOff] = useState(false);

  // keep the dropdown in sync when the station in redux changes
  useEffect(() => {
    if (!isStationEditPage) return;

    setWeeklyOffValue(savedWeeklyOff);
  }, [vehicleMaster?.[0]?._id, savedWeeklyOff]);

  const saveWeeklyOff = async () => {
    setSavingOff(true);
    try {
      const response = await postData(
        "/changeStationWeeklyOff",
        {
          _id: vehicleMaster?.[0]?._id,
          stationWeeklyOff: fromWeeklyOffValue(weeklyOffValue),
        },
        token,
      );
      if (response?.status === 200) {
        dispatch(updateStationWeeklyOff(response.data.stationWeeklyOff));
        handleAsyncError(dispatch, "Weekly off updated", "success");
      } else {
        handleAsyncError(
          dispatch,
          response?.message || "Unable to update weekly off",
        );
      }
    } catch (error) {
      handleAsyncError(dispatch, error?.message);
    } finally {
      setSavingOff(false);
    }
  };

  // Dynamically select the form to render based on the URL
  const getFormType = () => {
    const formType = location.pathname.split("/")[1];
    return forms[formType];
  };

  const FormComponent = getFormType();

  return !loading ? (
    <>
      {isUsersPageWithoutId && <UserKycApproveModal />}

      {location.pathname.includes("/all-managers/") &&
        !location.pathname.includes("/add-new") && (
          <ForgetPasswordModal
            userType={"admin"}
            contact={
              vehicleMaster?.contact || vehicleMaster?.[0]?.userId?.contact || 0
            }
          />
        )}

      <div className="flex items-center flex-wrap justify-between gap-1 lg:gap-0 mb-5">
        <div className="flex items-center gap-2 min-w-0 max-w-full">
          {loggedInRole !== "manager" && (
            <button
              className="flex items-center gap-1 p-1 rounded-lg"
              type="button"
              onClick={() => handlePreviousPage(navigate)}
            >
              {tableIcons?.backArrow}
            </button>
          )}
          {/* heading render dynamically based on url  */}
          <h2 className="text-xl lg:text-2xl capitalize font-bold text-theme break-words min-w-0">
            {location.pathname.includes("/all-bookings/")
              ? `${id ? "Edit" : "Create"} Booking${
                  id ? `: #${vehicleMaster[0]?.bookingId}` : ""
                }`
              : location.pathname.includes("/all-plans/")
                ? `${id ? "Edit" : "Add"} Plan Master`
                : location.pathname.includes("/all-vehicles/")
                  ? `${id ? "Edit" : "Add"} Vehicle`
                  : location.pathname.includes("/all-users/")
                    ? `${id ? "Edit" : "Create"} Customer`
                    : location.pathname.includes("/all-managers/")
                      ? `${id ? "Edit" : "Add"} Manager`
                      : location.pathname.includes("/all-coupons/")
                        ? `${id ? "Edit" : "Add"} Coupon`
                        : location.pathname.includes("/location-master/")
                          ? `${id ? "Edit" : "Add"} City`
                          : location.pathname.includes("/station-master/")
                            ? `${id ? "Edit" : "Add"} Station`
                            : `${id ? "Edit" : "Add"} ${formatPathNameToTitle(
                                location.pathname,
                              )}`}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isStationEditPage && loggedInRole === "admin" && (
            <Suspense
              fallback={
                <div className="w-40 h-10 bg-gray-200 rounded-md animate-pulse" />
              }
            >
              <WeeklyOffSelect
                id="stationWeeklyOff"
                label="Station weekly off"
                value={weeklyOffValue}
                savedValue={savedWeeklyOff}
                onChange={setWeeklyOffValue}
                onSave={saveWeeklyOff}
                saving={savingOff}
                disabled={loggedInRole !== "admin"}
              />
            </Suspense>
          )}

          {isUsersPageWithoutId && (
            <>
              <button
                className="bg-theme/90 text-white p-2 lg:px-3 lg:py-2.5 flex items-center gap-1 rounded-md"
                type="button"
                onClick={() => dispatch(toogleKycModalActive())}
                disabled={
                  (vehicleMaster &&
                    vehicleMaster[0] &&
                    vehicleMaster[0]?.userId?.kycApproved === "yes") ||
                  (vehicleMaster && vehicleMaster?.kycApproved === "yes")
                    ? true
                    : false
                }
              >
                {vehicleMaster && vehicleMaster[0] ? (
                  vehicleMaster[0]?.userId?.kycApproved === "yes" ? (
                    <>{tableIcons?.verify} Verified</>
                  ) : (
                    <>{tableIcons?.unVerify} Not Verified</>
                  )
                ) : vehicleMaster && vehicleMaster?.kycApproved === "yes" ? (
                  <>{tableIcons?.verify} Verified</>
                ) : (
                  <>{tableIcons?.unVerify} Not Verified</>
                )}
              </button>

              {location.pathname.includes("/all-managers/") &&
                !location.pathname.includes("/add-new") && (
                  <button
                    className="bg-theme flex items-center gap-1 text-white p-2 lg:px-3 lg:py-2.5 rounded-md disabled:bg-gray-400 disabled:uppercase"
                    onClick={() => dispatch(toggleForgetPasswordModal())}
                  >
                    {tableIcons?.lock}
                    Change Password
                  </button>
                )}

              {location.pathname.includes("/all-managers/") &&
                !location.pathname.includes("/add-new") &&
                id?.trim() !== "" && (
                  <Link
                    className="bg-theme flex items-center gap-1 text-white p-2 lg:px-3 lg:py-2.5 rounded-md disabled:bg-gray-400 disabled:uppercase"
                    to={`/all-managers/attendance?user=${id}`}
                  >
                    {tableIcons?.dateCalender}
                    View Attendance
                  </Link>
                )}
            </>
          )}
        </div>
      </div>
      <div className="w-full max-w-full lg:w-[95%] shadow-lg rounded-xl p-3 lg:p-5 mx-auto bg-white overflow-x-hidden">
        <FormComponent
          handleFormSubmit={(event) =>
            handleCreateAndUpdateVehicle(
              event,
              dispatch,
              setFormLoading,
              token,
              navigate,
              tempIds,
              removeTempIds,
              id,
            )
          }
          loading={formLoading}
        />
      </div>
    </>
  ) : (
    <PreLoader />
  );
};

export default CreateNewAndUpdateForm;
