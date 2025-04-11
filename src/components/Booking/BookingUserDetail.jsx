import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import CopyButton from "../../components/Buttons/CopyButton";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../../Data";
import { useEffect, useState } from "react";
import PreLoader from "../../components/Skeleton/PreLoader";
import UserDocuments from "../../components/Form/User Components/UserDocuments";
import { toogleKycModalActive } from "../../Redux/SideBarSlice/SideBarSlice";
import {
  addUserDocuments,
  removeUserDocuments,
} from "../../Redux/VehicleSlice/VehicleSlice";
import { tableIcons } from "../../Data/Icons";

const BookingUserDetails = ({ data, userId }) => {
  const { token } = useSelector((state) => state.user);
  const { userDocuments } = useSelector((state) => state.vehicles);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // fetchDocument data
  const handleFetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await getData(`/getDocument?userId=${userId}`, token);
      if (response?.status !== 200) {
        return handleAsyncError(dispatch, response?.message);
      }
      dispatch(addUserDocuments(response?.data));
      return;
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      handleFetchDocuments();
    }
  }, [userId]);

  useEffect(() => {
    return () => {
      dispatch(removeUserDocuments());
    };
  }, []);

  return (
    <>
      {loading && <PreLoader />}
      {data?.user?.map((item, index) => (
        <div
          className={`flex justify-between items-center py-1.5 ${
            index == data?.user?.length - 1 ? "" : "border-b-2"
          } border-gray-300`}
          key={index}
        >
          <span className="font-semibold uppercase text-xs lg:text-sm">
            {item?.key}
          </span>{" "}
          <span
            className={`text-gray-500 flex items-center text-xs lg:text-sm ${
              item?.key === "Email" ? "" : "capitalize"
            }`}
          >
            {/* copy button  */}
            {(item?.key === "Mobile Number" ||
              item?.key === "Email" ||
              item?.key === "Alt Mobile Number") &&
              item?.value !== "NA" && <CopyButton textToCopy={item?.value} />}
            {/* data  */}
            {item.key === "Document Status" ? (
              <div className="flex gap-2 items-center">
                {item?.value === "yes" ? (
                  <p className="flex items-center">
                    <span className="text-green-500 ml-0 lg:ml-1">
                      {tableIcons.verify}
                    </span>
                    <span className="hidden lg:block">Verified</span>
                  </p>
                ) : (
                  <p className="flex items-center">
                    <span className="text-red-500 ml-0 lg:ml-1">
                      {tableIcons.unVerify}
                    </span>
                    <span className="hidden lg:block">Not Verified</span>
                  </p>
                )}
                {item?.value === "yes" ? (
                  <button
                    className="text-theme underline"
                    type="button"
                    onClick={handleFetchDocuments}
                  >
                    Show Documents
                  </button>
                ) : (
                  <button
                    className="text-theme underline"
                    type="button"
                    onClick={() => dispatch(toogleKycModalActive())}
                  >
                    Verify User
                  </button>
                )}
              </div>
            ) : (
              item?.value
            )}
          </span>
        </div>
      ))}
      {/* user documents  */}
      <UserDocuments data={userDocuments?.[0]?.files} hookLoading={loading} />
    </>
  );
};

export default BookingUserDetails;
