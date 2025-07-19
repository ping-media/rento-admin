import { useRef, useState } from "react";
import {
  camelCaseToSpaceSeparated,
  compressImageToBlob,
} from "../../utils/index";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { useDispatch, useSelector } from "react-redux";
import { postData, postMultipleData } from "../../Data/index";

const ImageUploadAndPreview = ({
  image,
  imagesUrl,
  setImageChanger,
  setImageUrlChanger,
  customImageText = "image",
  title = "Image",
  setImageMultiChanger,
  setImageUrlMultiChanger,
  name = "image",
  isRequired = true,
  isUpload = false,
  isDisableRemove = false,
  isLabel = true,
  userId,
}) => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [isCompressing, setIsCompressing] = useState(false);
  const { token } = useSelector((state) => state.user);

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file || file.size === 0) {
        handleAsyncError(dispatch, "No file or invalid file selected.");
        return;
      }

      setIsCompressing(true);
      const compressedBlob = await compressImageToBlob(file, 0.7);
      const finalFile = new File([compressedBlob], file.name, {
        type: "image/jpeg",
      });

      if (isUpload && userId && userId !== "") {
        const formData = new FormData();
        formData.append("image", finalFile);
        formData.append("userId", userId);

        const responseImage = await postMultipleData(
          "/upload-pickup-image",
          formData,
          token
        );
        if (responseImage?.success) {
          const { data } = responseImage;
          setImageMultiChanger?.((prev) => ({
            ...prev,
            [title]: { fileName: data?.fileName, imageUrl: data?.imageUrl },
          }));

          setImageUrlChanger?.(data?.imageUrl);
          setImageUrlMultiChanger?.((prev) => ({
            ...prev,
            [title]: data?.imageUrl,
          }));
        } else {
          handleAsyncError(dispatch, "unable to upload image! try again");
          return;
        }
      } else {
        setImageChanger?.(finalFile);
        setImageMultiChanger?.((prev) => ({ ...prev, [title]: finalFile }));

        const url = URL.createObjectURL(finalFile);
        if (imagesUrl) URL.revokeObjectURL(imagesUrl);

        setImageUrlChanger?.(url);
        setImageUrlMultiChanger?.((prev) => ({ ...prev, [title]: url }));
      }
    } catch (error) {
      console.error("Image compression failed:", error);
      handleAsyncError(dispatch, "Image upload failed.");
    } finally {
      setIsCompressing(false);
    }
  };

  // for deleting image
  const handleRemoveImage = async () => {
    // for single file delete
    setImageUrlChanger && setImageUrlChanger("");
    // delete from bucket
    if (isUpload === true) {
      const response = await postData(
        "/delete-image",
        { fileName: image?.fileName },
        token
      );
      if (!response.success) {
        return handleAsyncError(dispatch, "Unable to delete Image!");
      }
    }
    //  for multiple file and want to delete only one
    setImageUrlMultiChanger &&
      setImageUrlMultiChanger((prev) => ({ ...prev, [title]: "" }));
  };

  const openFileChooser = (type) => {
    const input = fileInputRef.current;
    if (type === "camera") {
      input.setAttribute("capture", "environment");
    } else {
      input.removeAttribute("capture");
    }

    input.value = "";
    input.click();
  };

  return (
    <>
      {isLabel && (
        <p className="block text-gray-800 font-semibold text-sm mb-2 text-left capitalize">
          {camelCaseToSpaceSeparated(title)}
        </p>
      )}
      <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md px-6 py-6 md:py-5 lg:py-4 text-center mb-5 h-auto lg:max-h-[140px]">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          name={name}
          id={`ImageInput-Camera-${title}`}
          ref={fileInputRef}
          onChange={handleImageChange}
          required={isRequired}
        />

        {isCompressing ? (
          <div className="flex justify-center items-center h-28">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-theme"></div>
          </div>
        ) : imagesUrl ? (
          <>
            {/* Remove Button */}
            <div className="lg:absolute block text-right right-8 z-50 mb-5">
              <button
                className="inline-flex items-center gap-1 text-red-500 border border-red-500 p-1 rounded-md hover:bg-red-500 hover:text-gray-100 transition duration-300 ease-in-out group"
                type="button"
                onClick={handleRemoveImage}
                disabled={isDisableRemove}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="group-hover:stroke-gray-100 stroke-red-500 transition duration-300 ease-in-out"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                Remove
              </button>
            </div>

            {/* Image Preview */}
            <div className="w-full h-28 mx-auto relative">
              <img
                src={imagesUrl}
                className="w-full h-full object-contain hover:border rounded-xl transition duration-300 ease-in-out"
                alt="UPLOAD_IMAGE"
              />
            </div>
          </>
        ) : (
          <>
            {/* Clickable Camera Icon */}
            <button
              type="button"
              className="cursor-pointer block w-full"
              onClick={() => openFileChooser("camera")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-300 mb-4 hover:text-theme transition"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <g transform="translate(2 3)">
                  <path d="M20 16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3l2-3h6l2 3h3a2 2 0 0 1 2 2v11z" />
                  <circle cx="10" cy="10" r="4" />
                </g>
              </svg>
            </button>

            {/* Browse Label */}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <button
                type="button"
                className="cursor-pointer text-theme hover:underline"
                onClick={() => openFileChooser("gallery")}
              >
                Browse
              </button>{" "}
              to upload {camelCaseToSpaceSeparated(customImageText)}.
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default ImageUploadAndPreview;
