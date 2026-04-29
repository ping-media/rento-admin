import { useDispatch, useSelector } from "react-redux";
import UserDocuments from "./User Components/UserDocuments";
import { useEffect, useState } from "react";
import { getData } from "../../Data/index";
import {
  addUserRideInfo,
  resetUserRideInfo,
} from "../../Redux/VehicleSlice/VehicleSlice";
import CustomerForm from "./User Components/CustomerForm";
import LocationCard from "../Card/LocationCard";
import AddressCard from "../Card/AddressCard";

const UserForm = ({ handleFormSubmit, loading }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [ridesLoading, setRidesLoading] = useState(false);
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const isAddUsers = ["/all-managers/add-new", "/all-users/add-new"].includes(
    location.pathname,
  );

  useEffect(() => {
    if (location.pathname?.includes("/all-users/") && !loading) {
      const isDocuments =
        (vehicleMaster?.[0]?.files || vehicleMaster?.files || [])?.length > 0;
      const userId = isDocuments
        ? vehicleMaster?.[0]?.userId?._id || vehicleMaster?.userId?._id
        : vehicleMaster?._id || vehicleMaster?.[0]?._id;

      if (userId) {
        (async () => {
          try {
            setRidesLoading(true);
            const response = await getData(
              `/getBookings?userId=${userId}`,
              token,
            );
            if (response?.status === 200) {
              dispatch(addUserRideInfo(response?.data));
            }
          } finally {
            setRidesLoading(false);
          }
        })();
      }

      return () => {
        dispatch(resetUserRideInfo());
      };
    }
    // }, [loading, vehicleMaster?._id, vehicleMaster?.[0]?._id]);
  }, [loading, vehicleMaster]);

  // (vehicleMaster || location.pathname.endsWith("all-managers/add-new")) && (
  return (
    (vehicleMaster || isAddUsers) && (
      <>
        <CustomerForm {...{ ridesLoading, handleFormSubmit, loading }} />

        {/* user location     */}
        {!isAddUsers && vehicleMaster?.lastLocation && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-5">
            <LocationCard {...vehicleMaster.lastLocation} />
            <AddressCard {...vehicleMaster.address} />
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
