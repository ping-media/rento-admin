import userImage from "../assets/logo/user.png";
import { useDispatch, useSelector } from "react-redux";
import UserForm from "../components/Form/UserForm";
import { useEffect, useState } from "react";
import {
  fetchVehicleMasterById,
  handleUpdateAdminProfile,
} from "../Data/Function";
import PreLoader from "../components/Skeleton/PreLoader";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { currentUser, token } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.vehicles);
  const [formLoading, setFormLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;
    fetchVehicleMasterById(dispatch, currentUser?._id, token, `/getAllUsers`);
  }, [currentUser]);

  return !loading ? (
    <>
      <h1 className="text-2xl uppercase font-bold text-theme mb-5">Profile</h1>
      <div className="w-full lg:w-[95%] shadow-lg rounded-xl p-2.5 lg:p-5 mx-auto bg-white">
        <>
          {/* user image  */}
          <div className="pb-4">
            <div>
              <div className="w-32 lg:w-40 h-32 lg:h-40 border rounded-full p-5 mx-auto border-2 mb-2">
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
                    navigate
                  )
                }
                loading={formLoading}
              />
            </div>
          </div>
        </>
      </div>
    </>
  ) : (
    <PreLoader />
  );
};

export default Profile;
