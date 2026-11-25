import Spinner from "../Spinner/Spinner";
import PhotoView from "../Form/User Components/PhotoView";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeGeneralSlides } from "../../Redux/GeneralSlice/GeneralSlice";
import { postData } from "../../Data/index";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";

const Slides = () => {
  const { general, loading } = useSelector((state) => state.general);
  const [rowId, setRowId] = useState("");
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const deleteBanner = async (id) => {
    try {
      setRowId(id);
      const response = await postData(
        "/addSlides",
        { action: "delete", _id: id },
        token
      );
      if (response?.success) {
        dispatch(removeGeneralSlides(id));
        return handleAsyncError(dispatch, response?.message, "success");
      } else {
        return handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      handleAsyncError(dispatch, "Unable to delete banner! try again");
    } finally {
      setRowId("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!loading && general.slides?.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <p>No Banner Found.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-wrap gap-2">
      {general?.slides?.map((item, key) => (
        <PhotoView
          item={item}
          className="w-24 h-24"
          uniqueId={`Banner_${key}`}
          key={key}
          alt={`BANNER_${key}`}
          deleteFn={deleteBanner}
          rowId={rowId}
        />
      ))}
    </div>
  );
};

export default Slides;
