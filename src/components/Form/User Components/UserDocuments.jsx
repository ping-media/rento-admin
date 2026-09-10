import { handleAsyncError } from "../../../utils/Helper/handleAsyncError";
import { useDispatch } from "react-redux";
import React, { useState } from "react";
import { tableIcons } from "../../../Data/Icons";
import { deleteDataById } from "../../../Data/index";
import { handleUpdateImageData } from "../../../Redux/VehicleSlice/VehicleSlice";
import "photoswipe/style.css";
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

  if (hookLoading || loading) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-2 flex-wrap mx-auto">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="relative w-42 md:w-52 h-40 rounded-md overflow-hidden border border-gray-200 bg-gray-100 animate-pulse"
            >
              {/* image skeleton */}
              <div className="w-full h-full bg-gray-300" />

              {/* delete button skeleton */}
              <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gray-200 border border-gray-300" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!location.pathname.includes("/all-bookings/details/") && (
        <div className="flex w-full items-center justify-between">
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

      <div
        className="flex items-center gap-2 flex-wrap mx-auto"
        id="user-documents-gallery"
      >
        {(data ?? []).length > 0 ? (
          (data ?? []).map((item) => (
            <React.Fragment key={item?._id}>
              {dataId ? (
                <PhotoView
                  item={item}
                  className="w-42 md:w-52 max-h-40"
                  uniqueId="user-documents-gallery"
                  variant={"full"}
                  deleteFn={handleDeleteDocument}
                  dataId={dataId}
                />
              ) : (
                <PhotoView
                  item={item}
                  className="w-20 h-20 flex items-center justify-center"
                  uniqueId="user-documents-gallery"
                  variant={"full"}
                />
              )}
            </React.Fragment>
          ))
        ) : (
          <p className="italic text-base text-center w-full my-2 text-gray-400">
            No documents found.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserDocuments;
