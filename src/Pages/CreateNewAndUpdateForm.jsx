import { lazy, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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
import { removeTempIds } from "../Redux/VehicleSlice/VehicleSlice.js";
import { tableIcons } from "../Data/Icons.jsx";
import {
  toggleForgetPasswordModal,
  toogleKycModalActive,
} from "../Redux/SideBarSlice/SideBarSlice.js";
const ForgetPasswordModal = lazy(
  () => import("../components/Modal/ForgetPasswordModal.jsx"),
);
const UserKycApproveModal = lazy(
  () => import("../components/Modal/UserKycApproveModal.jsx"),
);

const CreateNewAndUpdateForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formLoading, setFormLoading] = useState(false);
  const { id } = useParams();
  const { token, loggedInRole } = useSelector((state) => state.user);
  const { loading, vehicleMaster, tempIds } = useSelector(
    (state) => state.vehicles,
  );

  const isId = Boolean(id?.trim());
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
        <div className="flex items-center gap-2">
          {location.pathname.startsWith("/all-users/") &&
            loggedInRole !== "manager" && (
              <button
                className="flex items-center gap-1 p-1 rounded-lg"
                type="button"
                onClick={() => handlePreviousPage(navigate)}
              >
                {tableIcons?.backArrow}
              </button>
            )}
          {/* heading render dynamically based on url  */}
          <h1 className="text-xl lg:text-2xl capitalize font-bold text-theme">
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
          </h1>
        </div>
        {isUsersPageWithoutId && (
          <div className="flex items-center gap-2">
            <button
              className="bg-theme/90 text-gray-100 p-2 lg:px-3 lg:py-2.5 flex items-center gap-1 rounded-md"
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
                  className="bg-theme text-gray-100 p-2 lg:px-3 lg:py-2.5 rounded-md disabled:bg-gray-400 disabled:uppercase"
                  onClick={() => dispatch(toggleForgetPasswordModal())}
                >
                  Change Password
                </button>
              )}
          </div>
        )}
      </div>
      <div className="w-full lg:w-[95%] shadow-lg rounded-xl p-3 lg:p-5 mx-auto bg-white">
        <>
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
        </>
      </div>
    </>
  ) : (
    <PreLoader />
  );
};

export default CreateNewAndUpdateForm;
