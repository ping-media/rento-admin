import { useSelector } from "react-redux";
import UserDocuments from "./User Components/UserDocuments";
// import { useEffect, useState } from "react";
// import { getData } from "../../Data/index";
// import {
//   addUserRideInfo,
//   resetUserRideInfo,
// } from "../../Redux/VehicleSlice/VehicleSlice";
import CustomerForm from "./User Components/CustomerForm";
import LocationCard from "../Card/LocationCard";
import AddressCard from "../Card/AddressCard";
import { useLocation } from "react-router-dom";

const UserAndManagerPage = ["/all-managers/add-new", "/all-users/add-new"];

const UserForm = ({ handleFormSubmit, loading }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  // const [ridesLoading, setRidesLoading] = useState(false);
  // const { token } = useSelector((state) => state.user);
  const location = useLocation();
  // const dispatch = useDispatch();

  const isAddUsers = UserAndManagerPage.includes(location.pathname);
  const isProfile = location.pathname === "/profile";

  const normalizedUser = Array.isArray(vehicleMaster)
    ? vehicleMaster[0]
    : vehicleMaster;

  const userLocationData =
    normalizedUser?.lastLocation ?? normalizedUser?.userId?.lastLocation;
  const userAddressData =
    normalizedUser?.address ?? normalizedUser?.userId?.addresses ?? null;

  // useEffect(() => {
  //   // if (location.pathname?.includes("/all-users/") && !loading) {
  //   if (userId && !loading) {
  //     // const isDocuments =
  //     //   (vehicleMaster?.[0]?.files || vehicleMaster?.files || [])?.length > 0;

  //     // const userId = isDocuments
  //     //   ? vehicleMaster?.[0]?.userId?._id || vehicleMaster?.userId?._id
  //     //   : vehicleMaster?._id || vehicleMaster?.[0]?._id;

  //     // if (userId) {
  //     (async () => {
  //       try {
  //         setRidesLoading(true);
  //         const response = await getData(
  //           `/getBookings?userId=${userId}`,
  //           token,
  //         );
  //         if (response?.status === 200) {
  //           dispatch(addUserRideInfo(response?.data));
  //         }
  //       } finally {
  //         setRidesLoading(false);
  //       }
  //     })();
  //     // }

  //     return () => {
  //       dispatch(resetUserRideInfo());
  //     };
  //   }
  // }, [loading, userId]);

  return (
    (vehicleMaster || isAddUsers) && (
      <>
        {/* <CustomerForm {...{ ridesLoading, handleFormSubmit, loading }} /> */}
        <CustomerForm {...{ handleFormSubmit, loading }} />

        {/* user location     */}
        {!isAddUsers && normalizedUser && !isProfile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-5">
            {Object.keys(userLocationData || {}).length > 0 && (
              <LocationCard {...userLocationData} />
            )}
            {userAddressData !== null && <AddressCard {...userAddressData} />}
          </div>
        )}

        {/* for showing user documents  */}
        {!isAddUsers &&
          location.pathname !== "/profile" &&
          location.pathname !== "/all-managers/add-new" && (
            <UserDocuments
              dataId={vehicleMaster[0]?._id}
              data={
                vehicleMaster[0]?.files && vehicleMaster[0]?.files?.length > 0
                  ? vehicleMaster[0]?.files
                  : []
              }
              hookLoading={loading}
            />
          )}
      </>
    )
  );
};

export default UserForm;
