import { lazy, useEffect, useState } from "react";
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
import { toogleKycModalActive } from "../Redux/SideBarSlice/SideBarSlice.js";
const UserKycApproveModal = lazy(() =>
  import("../components/Modal/UserKycApproveModal.jsx")
);

const CreateNewAndUpdateForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formLoading, setFormLoading] = useState(false);
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const { loading, vehicleMaster, tempIds } = useSelector(
    (state) => state.vehicles
  );

  // fetch data based on id taking from url
  useEffect(() => {
    if (id) {
      fetchVehicleMasterById(
        dispatch,
        id,
        token,
        location?.pathname.includes("/all-users/") ||
          location.pathname.includes("/all-managers/")
          ? "/getDocument?userId="
          : endPointBasedOnURL[modifyUrl(location.pathname).replace("/", "")]
      );
    }
  }, [dispatch, id, token]);

  // Dynamically select the form to render based on the URL
  const getFormType = () => {
    const formType = location.pathname.split("/")[1];
    return forms[formType];
  };

  const FormComponent = getFormType();

  return !loading ? (
    <>
      {(location.pathname.includes("/all-users/") ||
        location.pathname.includes("/all-managers/")) && (
        <UserKycApproveModal />
      )}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          {/* back button visiable on mobile screen  */}
          <button
            className="flex lg:hidden items-center gap-1 p-2 rounded-lg border-2 border-theme bg-theme text-gray-100"
            type="button"
            onClick={() => handlePreviousPage(navigate)}
          >
            {tableIcons?.backArrow}
            <span className="text-sm">Back</span>
          </button>
          {/* heading render dynamically based on url  */}
          <h1 className="text-xl lg:text-2xl uppercase font-bold text-theme">
            {location.pathname.includes("/all-bookings/")
              ? `${id ? "Edit" : "Add"} Booking${
                  id ? `: #${vehicleMaster[0]?.bookingId}` : ""
                }`
              : location.pathname.includes("/all-plans/")
              ? `${id ? "Edit" : "Add"} Plan Master`
              : location.pathname.includes("/all-vehicles/")
              ? `${id ? "Edit" : "Add"} Vehicle`
              : location.pathname.includes("/all-users/")
              ? `${id ? "Edit" : "Add"} User`
              : location.pathname.includes("/all-coupons/")
              ? `${id ? "Edit" : "Add"} Coupon`
              : `${id ? "Edit" : "Add"} ${formatPathNameToTitle(
                  location.pathname
                )}`}
          </h1>
        </div>
        {/* for kyc approval  */}
        {(location.pathname.includes("/all-users/") ||
          location.pathname.includes("/all-managers/")) && (
          <button
            className="bg-theme text-gray-100 px-3 py-2.5 rounded-md disabled:bg-gray-400 disabled:uppercase"
            onClick={() => dispatch(toogleKycModalActive())}
            disabled={
              (vehicleMaster &&
                vehicleMaster[0]?.userId?.kycApproved === "yes") ||
              false
            }
          >
            {vehicleMaster && vehicleMaster[0]?.userId?.kycApproved === "yes"
              ? "Verified"
              : "Verify User"}
          </button>
        )}
      </div>
      <div className="w-full lg:w-[95%] shadow-lg rounded-xl p-5 mx-auto bg-white">
        {/* if id not present than go to create new vehicle or any other thing  */}
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
                id
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
