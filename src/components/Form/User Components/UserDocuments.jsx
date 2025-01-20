import LightGallery from "lightgallery/react";

// Plugins for lightgallery
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

// Import CSS for lightgallery
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import { Link } from "react-router-dom";
import Spinner from "../../../components/Spinner/Spinner";
import { handleAsyncError } from "../../../utils/Helper/handleAsyncError";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { tableIcons } from "../../../Data/Icons";
import { deleteDataById } from "../../../Data/index";

const UserDocuments = ({ data, dataId, hookLoading }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  //   delete document
  const handleDeleteDocument = async (id, item) => {
    setLoading(true);
    try {
      const response = await deleteDataById("/deleteDocument", {
        _id: id,
        fileName: item?.fileName,
      });
      if (response?.status == 200) {
        dispatch(handleUpdateImageData({ id: item?._id }));
        return handleAsyncError(dispatch, response?.message, "success");
      } else {
        return handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      return handleAsyncError(dispatch, "unable to delete image! try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <h2 className="mb-2 uppercase text-theme font-bold text-lg">
        User Documents ({data?.length || 0})
      </h2>
      {hookLoading && <Spinner />}
      {!hookLoading && data && data?.length > 0 ? (
        <div className="flex items-center gap-2 flex-wrap">
          {data?.map((item) => (
            <div
              className="relative w-52 border-2 rounded-md p-1 h-full"
              key={item?._id}
            >
              <button
                className="absolute right-3 z-20"
                type="button"
                onClick={() => handleDeleteDocument(dataId, item)}
                disabled={loading}
              >
                {tableIcons.delete}
              </button>
              <LightGallery
                plugins={[lgThumbnail, lgZoom]}
                speed={500} // Animation speed
              >
                <Link to={item.imageUrl}>
                  <img
                    src={item.imageUrl}
                    alt={item.fileName}
                    className="w-full h-full object-contain brightness-95"
                  />
                </Link>
              </LightGallery>
            </div>
          ))}
        </div>
      ) : (
        <p className="italic text-sm my-2 text-gray-400">No documents found.</p>
      )}
    </div>
  );
};

export default UserDocuments;
