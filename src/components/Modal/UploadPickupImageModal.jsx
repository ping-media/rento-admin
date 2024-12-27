import { useDispatch, useSelector } from "react-redux";
import { togglePickupImageModal } from "../../Redux/SideBarSlice/SideBarSlice";
import { useState } from "react";
import MultipleImageAndPreview from "../ImageComponent/MultipleImageAndPreview";
import InputSearch from "../InputAndDropdown/InputSearch";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { postMultipleData } from "../../Data";
import Spinner from "../Spinner/Spinner";

const UploadPickupImageModal = () => {
  const { isUploadPickupImageActive } = useSelector((state) => state.sideBar);
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [imagesUrl, setImageUrl] = useState([]);
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUploadPickupImages = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    const images = Array.from(event.target.elements.images?.files || []);
    const formElements = event.target.elements;
    const userId = formElements?.userId[0]?.value;

    if (!userId)
      return handleAsyncError(dispatch, "unable to upload! try again.");

    formData.append("userId", userId);

    if (images.length > 0) {
      // Append images to the FormData
      images.forEach((file) => {
        formData.append("images", file);
      });
    }

    if (!formData.has("images")) {
      return handleAsyncError(
        dispatch,
        "Unable to upload! No images provided."
      );
    }

    setLoading(true);
    try {
      const responseImage = await postMultipleData(
        "/pickupImage",
        formData,
        token
      );

      if (responseImage?.status === 200) {
        setImage([]);
        setImageUrl([]);
        dispatch(togglePickupImageModal());
        handleAsyncError(dispatch, responseImage?.message, "success");
      } else {
        handleAsyncError(dispatch, responseImage?.message);
      }
    } catch (error) {
      handleAsyncError(dispatch, error?.message);
    } finally {
      setLoading(false);
    }
  };

  //   close modal and clear value
  const handleClearAndClose = () => {
    setImage([]);
    setImageUrl([]);
    return dispatch(togglePickupImageModal());
  };

  return (
    <div
      className={`fixed ${
        !isUploadPickupImageActive ? "hidden" : ""
      } z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-20 mx-auto shadow-xl rounded-md bg-white max-w-xl">
        <div className="flex justify-end p-2">
          <button
            onClick={handleClearAndClose}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className="p-6 pt-0 text-center">
          <form onSubmit={handleUploadPickupImages}>
            <div className="text-left mb-5">
              <InputSearch item={"User"} name={"userId"} token={token} />
            </div>
            <div>
              <MultipleImageAndPreview
                image={image}
                setImageChanger={setImage}
                imagesUrl={imagesUrl}
                setImageUrlChanger={setImageUrl}
              />
              {imagesUrl && imagesUrl?.length > 6 && (
                <p className="text-theme text-sm text-left">
                  Max Upload Limit is 6 Images
                </p>
              )}
            </div>
            <button
              className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
              type="submit"
              disabled={
                loading || imagesUrl.length == 0 || imagesUrl.length > 6
              }
            >
              {!loading ? (
                "Upload Images"
              ) : (
                <Spinner message={"uploading..."} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPickupImageModal;
