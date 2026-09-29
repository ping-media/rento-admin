import { useSelector } from "react-redux";
import UserDocuments from "./User Components/UserDocuments";
import CustomerForm from "./User Components/CustomerForm";
import LocationCard from "../Card/LocationCard";
import AddressCard from "../Card/AddressCard";
import { useLocation } from "react-router-dom";

const UserAndManagerPage = ["/all-managers/add-new", "/all-users/add-new"];

const UserForm = ({ handleFormSubmit, loading }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const location = useLocation();

  const isAddUsers = UserAndManagerPage.includes(location.pathname);
  const isProfile = location.pathname === "/profile";

  const normalizedUser = Array.isArray(vehicleMaster)
    ? vehicleMaster[0]
    : vehicleMaster;

  const userLocationData =
    normalizedUser?.lastLocation ?? normalizedUser?.userId?.lastLocation;
  const userAddressData =
    normalizedUser?.address ?? normalizedUser?.userId?.addresses ?? null;

  return (
    (vehicleMaster || isAddUsers) && (
      <>
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
