import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import CopyButton from "../../components/Buttons/CopyButton";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../../Data";
import { useState } from "react";
import PreLoader from "../../components/Skeleton/PreLoader";
import LightGallery from "lightgallery/react";

// Plugins for lightgallery
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

// Import CSS for lightgallery
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import { Link } from "react-router-dom";
import { tableIcons } from "../../Data/Icons";

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
          <span className="font-semibold uppercase text-sm">{item?.key}</span>{" "}
          <span
            className={`text-gray-500 flex items-center text-sm ${
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
      <div className="flex items-center gap-2">
        {(userDocument && userDocument[0]?.files?.length > 0) ||
        (userDocument && userDocument?.files) ? (
          userDocument[0]?.files?.map((item) => (
            <div className="border-2 rounded-md p-1 h-full" key={item?._id}>
              <LightGallery
                plugins={[lgThumbnail, lgZoom]}
                speed={500} // Animation speed
              >
                <Link to={item.imageUrl} className="flex items-center gap-1">
                  {tableIcons?.image}
                  {item?.fileName.split("_")[3]}
                </Link>
              </LightGallery>
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic text-sm mt-1">
            No Documents Found.
          </p>
        )}
      </div>
    </>
  );
};

export default BookingUserDetails;
