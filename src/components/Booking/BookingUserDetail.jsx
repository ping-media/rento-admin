import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import CopyButton from "../../components/Buttons/CopyButton";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../../Data";
import { useEffect, useState } from "react";
import PreLoader from "../../components/Skeleton/PreLoader";
import UserDocuments from "../../components/Form/User Components/UserDocuments";

const BookingUserDetails = ({ data, userId }) => {
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [userDocument, setUserDocument] = useState([]);
  const dispatch = useDispatch();

  // fetchDocument data
  const handleFetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await getData(`/getDocument?userId=${userId}`, token);
      if (response?.status !== 200) {
        return handleAsyncError(dispatch, response?.message);
      }
      return setUserDocument(response?.data);
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setLoading(false);
    }
  };

  // auto fetch documents
  useEffect(() => {
    if (userId) {
      handleFetchDocuments();
    }
  }, [userId]);

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
            {(item?.key === "Mobile Number" || item?.key === "Email") && (
              <CopyButton textToCopy={item?.value} />
            )}
            {/* data  */}
            {item.key === "Document Status" ? (
              <div className="flex gap-2 items-center">
                {item?.value === "yes" ? "verified" : "not verified"}
                <button
                  className="text-theme underline"
                  type="button"
                  onClick={handleFetchDocuments}
                >
                  Show Documents
                </button>
              </div>
            ) : (
              item?.value
            )}
          </span>
        </div>
      ))}
      {/* user documents  */}
      <UserDocuments data={userDocument[0]?.files} hookLoading={loading} />
    </>
  );
};

export default BookingUserDetails;
