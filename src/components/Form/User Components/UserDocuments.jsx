import { handleAsyncError } from "../../../utils/Helper/handleAsyncError";
import { useDispatch } from "react-redux";
import React, { useState } from "react";
import { tableIcons } from "../../../Data/Icons";
import { deleteDataById } from "../../../Data/index";
import { handleUpdateImageData } from "../../../Redux/VehicleSlice/VehicleSlice";
import "photoswipe/style.css";
import PreLoader from "../../../components/Skeleton/PreLoader";
import { Link, useParams } from "react-router-dom";
import PhotoView from "./PhotoView";

const UserDocuments = ({ data, dataId, hookLoading }) => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

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
      {(loading || hookLoading) && <PreLoader />}

      <div
        id="user-documents-gallery"
        className="flex items-center gap-2 flex-wrap"
      >
        {Object.entries(data || {})?.map(([key, value]) => (
          <React.Fragment key={`file_${key}`}>
            {dataId ? (
              <PhotoView
                item={value}
                className="w-52 max-h-40"
                uniqueId={`file_${key}`}
                variant={"full"}
                deleteFn={handleDeleteDocument}
                dataId={dataId}
              />
            ) : (
              <PhotoView
                item={value}
                className="w-20 h-10 flex items-center justify-center"
                uniqueId={`file_${key}`}
                variant={"thumbnail"}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default UserDocuments;
