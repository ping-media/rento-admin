import { handleAsyncError } from "../../../utils/Helper/handleAsyncError";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { tableIcons } from "../../../Data/Icons";
import { deleteDataById } from "../../../Data/index";
import { handleUpdateImageData } from "../../../Redux/VehicleSlice/VehicleSlice";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import PreLoader from "../../../components/Skeleton/PreLoader";
import { Link, useParams } from "react-router-dom";

const UserDocuments = ({ data, dataId, hookLoading }) => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data?.length > 0) {
      const lightbox = new PhotoSwipeLightbox({
        gallery: "#user-documents-gallery",
        children: "a",
        pswpModule: () => import("photoswipe"),
      });
      lightbox.init();
      return () => lightbox.destroy();
    }
  }, [data]);

  // delete image function
  const handleDeleteDocument = async (id, item) => {
    setLoading(true);
    try {
      const response = await deleteDataById("/deleteDocument", {
        _id: id,
        fileName: item?.fileName,
      });
      if (response?.status === 200) {
        dispatch(handleUpdateImageData({ id: item?._id }));
        return handleAsyncError(dispatch, response?.message, "success");
      } else {
        return handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      return handleAsyncError(dispatch, "Unable to delete image! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!location.pathname.includes("/all-bookings/details/") && (
        <div className="flex items-center justify-between">
          <h2 className="mb-2 uppercase text-theme font-bold text-lg">
            User Documents ({data?.length || 0})
          </h2>
          {data?.length < 5 && (
            <Link
              className="bg-theme px-4 py-2 rounded-lg text-gray-100 flex items-center hover:bg-theme-dark transition duration-200 ease-in-out"
              to={`/${location.pathname.split("/")[1]}/add-documents/${id}`}
            >
              {tableIcons.add}
              <span className="ml-1 hidden lg:block">Add Documents</span>
            </Link>
          )}
        </div>
      )}
      {loading && <PreLoader />}
      {!hookLoading && data?.length > 0 ? (
        <div
          id="user-documents-gallery"
          className="flex items-center gap-2 flex-wrap"
        >
          {data.map((item) => (
            <div
              className={`relative ${
                dataId ? "w-52" : "w-auto"
              } border-2 rounded-md p-1 h-full`}
              key={item?._id}
            >
              {dataId && (
                <button
                  className="absolute right-3 z-20"
                  type="button"
                  onClick={() => handleDeleteDocument(dataId, item)}
                  disabled={loading}
                >
                  {tableIcons.delete}
                </button>
              )}
              {!location.pathname.includes("/all-bookings/details/") ? (
                <a
                  href={item.imageUrl}
                  data-pswp-width="1920"
                  data-pswp-height="1080"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.fileName}
                    className="w-full h-full object-contain brightness-95"
                  />
                </a>
              ) : (
                <a
                  href={item.imageUrl}
                  data-pswp-width="1920"
                  data-pswp-height="1080"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1"
                >
                  {tableIcons?.image}
                  {item?.fileName?.split("_")[3]}
                </a>
              )}
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
