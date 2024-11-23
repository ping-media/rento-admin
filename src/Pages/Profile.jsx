// import walletImage from "../assets/logo/wallet.png";
// import verifyImage from "../assets/logo/check.png";
import userImage from "../assets/logo/user.png";
import { useEffect, useState } from "react";
import EditProfile from "../components/EditProfile/EditProfile";
import { ProfileSkeleton } from "../components/Skeleton/index";
// import { useNavigate } from "react-router-dom";

const Profile = () => {
  //this is for toggling btw profile mode and edit mode
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <>
      {/* verfiyuser modal  */}
      <VerifyUserModal />
      <h1 className="text-2xl uppercase font-bold text-theme-blue mb-5">
        Profile
      </h1>
      {loading ? (
        <ProfileSkeleton />
      ) : (
        <div className="w-full lg:w-[95%] shadow-lg rounded-xl p-2.5 lg:p-5 mx-auto bg-white">
          {!isEditMode ? (
            <>
              <div className="flex justify-between lg:justify-end gap-2 mb-5">
                <button
                  className="bg-theme-blue p-2 border hover:bg-transparent text-gray-100 rounded hover:text-black border-gray-300 flex items-center gap-1"
                  onClick={() => setIsEditMode(!isEditMode)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                    <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                  </svg>
                  Edit Profile
                </button>
              </div>
              {/* user image  */}
              <div className="flex justify-center lg:justify-around flex-wrap items-center pb-4">
                <div>
                  <div className="w-44 h-44 border rounded-full p-5 mx-auto border-2 mb-2">
                    <img
                      src={`${currentUser?.userProfileImage || userImage}`}
                      className="w-full h-full object-cover"
                      alt={currentUser?.userName}
                    />
                  </div>
                  <div className="text-center mb-5">
                    <h2 className="text-xl font-semibold capitalize">
                      {currentUser?.userName || "Admin Name"}
                    </h2>
                    <p className="text-gray-400">
                      {data?.businessPartner ? "Business Partner" : "User"}
                    </p>
                  </div>
                </div>
                <div className="leading-8">
                  <div className="flex gap-2 items-center capitalize">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span className="font-semibold capitalize hidden md:inline lg:inline">
                      UserName:
                    </span>
                    {currentUser?.userName || "Admin"}
                  </div>
                  <div className="flex gap-2 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span className="font-semibold capitalize hidden md:inline lg:inline">
                      Phone Number:
                    </span>
                    {data?.UserPhoneNumber || "+91 XXXXXXXXXX"}
                  </div>
                  <div className="flex gap-2 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="font-semibold capitalize hidden md:inline lg:inline">
                      Addresss:
                    </span>
                    {data?.UserAddress || import.meta.env.VITE_ADDRESS}
                  </div>
                  <div className="flex gap-2 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <polyline points="17 11 19 13 23 9"></polyline>
                    </svg>
                    <span className="font-semibold capitalize hidden md:inline lg:inline">
                      Registerd On:
                    </span>
                    {data?.RegistrationDate || "1st Jan, 2024"}
                  </div>
                </div>
              </div>
              {/* wallet & user verification  */}
              {/* <div className="p-5 w-full lg:w-[80%] mx-auto">
                <div className="flex items-center gap-6 flex-wrap my-5 cursor-pointer">
                  <div
                    className="flex-1 flex items-center p-4 shadow-md rounded-xl hover:shadow-lg"
                    onClick={() => navigate("/wallet")}
                  >
                    <div className="w-16 lg:w-20 border-r-2">
                      <img src={walletImage} className="W-full" alt="BALANCE" />
                    </div>
                    <div className="px-4">
                      <p className="text-gray-400 text-sm lg:text-md">
                        Wallet Balance
                      </p>
                      <h2 className="font-semibold text-md lg:text-xl">
                        <span className="mr-[0.1rem]">₹</span>
                        {currentUser?.balance || 0}
                      </h2>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center p-4 shadow-md rounded-xl hover:shadow-lg">
                    <div className="w-16 lg:w-20 border-r-2">
                      <img src={verifyImage} className="W-full" alt="BALANCE" />
                    </div>
                    <div className="px-4">
                      <p className="text-gray-400 text-sm lg:text-md">
                        User Verification
                      </p>
                      <h2 className="font-semibold text-md lg:text-xl uppercase">
                        {data?.UserVerify
                          ? data?.UserVerify === "no"
                            ? "not verified"
                            : "verified"
                          : "not verified"}
                      </h2>
                    </div>
                  </div>
                </div>
              </div> */}
            </>
          ) : (
            <EditProfile
              // data={currentUser}
              isEditMode={isEditMode}
              setEditModeChanger={setIsEditMode}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Profile;
