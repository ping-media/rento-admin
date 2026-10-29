import { useDispatch, useSelector } from "react-redux";
import PhotoView from "../Form/User Components/PhotoView";
import React, { lazy, Suspense, useState } from "react";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { postMultipleData } from "../../Data";
import { patchPickupImageFile } from "../../Redux/VehicleSlice/VehicleSlice";
const ReplaceImageModal = lazy(() => import("../Modal/ReplaceImageModal"));

const VehicleImages = ({
  pickupImage,
  type = "pickup",
  userId = null,
  bookingId = null,
  canReplace = false,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [replaceTarget, setReplaceTarget] = useState(null);

  const rawFiles =
    type === "pickup"
      ? (pickupImage?.files ?? {})
      : (pickupImage?.endFiles ?? {});
  const files = Object.entries(rawFiles);

  const handleReplace = async (item, finalFile) => {
    try {
      if (!bookingId || !userId) {
        handleAsyncError(
          dispatch,
          "Unable to find required details! try again",
        );
        return false;
      }

      const formData = new FormData();
      formData.append("image", finalFile);
      formData.append("userId", userId);
      formData.append("bookingId", bookingId);
      formData.append("fileId", item?._id);

      const response = await postMultipleData(
        "/replace-pickup-image",
        formData,
        token,
      );

      if (!response?.success) {
        handleAsyncError(
          dispatch,
          response?.message || "Unable to replace image!",
        );
        return false;
      }

      dispatch(
        patchPickupImageFile({
          bookingId,
          key: response.data.key,
          file: response.data.file,
        }),
      );
      handleAsyncError(
        dispatch,
        response?.message || "Image Replaced!",
        "success",
      );
      return true;
    } catch (error) {
      console.error("Replace image failed:", error);
      handleAsyncError(dispatch, "Unable to replace image!");
      return false;
    }
  };

  if (!files.length) return null;

  return (
    <>
      <div
        className="flex items-center gap-3 sm:gap-2 flex-wrap"
        id="vehicle-gallery"
      >
        {files?.map(([key, value]) => (
          <PhotoView
            item={value}
            className="w-14 lg:w-20 h-14 lg:h-20"
            uniqueId={"vehicle-gallery"}
            key={key}
            onReplaceClick={
              canReplace && type === "pickup" ? setReplaceTarget : undefined
            }
          />
        ))}
      </div>

      {canReplace && type === "pickup" && (
        <Suspense fallback={null}>
          <ReplaceImageModal
            item={replaceTarget}
            onClose={() => setReplaceTarget(null)}
            onConfirm={handleReplace}
          />
        </Suspense>
      )}
    </>
  );
};

export default VehicleImages;
