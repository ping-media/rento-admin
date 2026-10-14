import userImage from "../assets/logo/user.png";
import { useDispatch, useSelector } from "react-redux";
import UserForm from "../components/Form/UserForm";
import { lazy, Suspense, useEffect, useState } from "react";
import {
  fetchVehicleMasterById,
  handleUpdateAdminProfile,
} from "../Data/Function";
import PreLoader from "../components/Skeleton/PreLoader";
import { useNavigate } from "react-router-dom";
import ManagerStationForm from "../components/Form/ManagerStationForm";
const ChangePasswordModal = lazy(
  () => import("../components/Modal/ChangePasswordModal"),
);

const Profile = () => {
  const { currentUser, token, loggedInRole } = useSelector(
    (state) => state.user,
  );
  const { loading } = useSelector((state) => state.vehicles);
  const [isOpen, setIsOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicleMasterById(
      dispatch,
      currentUser?._id,
      token,
      `/admin/getAllUsers`,
    );
  }, []);

  if (loading) {
    return <PreLoader />;
  }

  return (
    <>
      <Suspense fallback={<PreLoader />}>
        <ChangePasswordModal isActive={isOpen} setIsActive={setIsOpen} />
      </Suspense>

      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl sm:text-3xl capitalize font-bold text-theme">
          Profile
        </h1>
        <button
          type="button"
          className="w-fit h-10 border border-gray-300 rounded-md bg-gray-50 shadow-sm px-4"
          onClick={() => setIsOpen(true)}
        >
          Change Password
        </button>
      </div>

      <div className="w-full lg:w-[95%] shadow-lg rounded-xl p-2.5 lg:p-5 mx-auto bg-white">
        <>
          {/* user image  */}
          <div className="relative pb-4">
            <div className="w-32 lg:w-40 h-32 lg:h-40 rounded-full p-5 mx-auto border-2 mb-2">
              <img
                src={`${currentUser?.userProfileImage || userImage}`}
                className="w-full h-full object-cover"
                alt={currentUser?.firstName}
              />
            </div>
            <div className="text-center mb-5">
              <h2 className="text-xl font-semibold capitalize">
                {`${currentUser?.firstName} ${currentUser?.lastName}` ||
                  "Admin Name"}
              </h2>
              <p className="text-gray-400 capitalize">
                {currentUser?.userType || "N.A."}
              </p>
            </div>

            {/* user details  */}
            <div className="border-t-2 pt-5">
              <UserForm
                handleFormSubmit={(event) =>
                  handleUpdateAdminProfile(
                    event,
                    dispatch,
                    setFormLoading,
                    currentUser?._id,
                    currentUser?.userType,
                    token,
                    navigate,
                  )
                }
                loading={formLoading}
              />

              {loggedInRole === "manager" && (
                <>
                  <h2 className="text-2xl mt-2 mb-5 border-t-2 pt-2">
                    Station Info
                  </h2>

                  <ManagerStationForm />
                </>
              )}
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default Profile;
