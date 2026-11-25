import { useDispatch, useSelector } from "react-redux";
import { toggleSlidesModal } from "../../Redux/SideBarSlice/SideBarSlice";
import { useState } from "react";
import { postMultipleData } from "../../Data/index";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { addGeneralSlides } from "../../Redux/GeneralSlice/GeneralSlice";
import ImageUploadAndPreview from "../ImageComponent/ImageUploadAndPreview";
import Spinner from "../Spinner/Spinner";

const Button = ({ label = "update", disabled = false }) => (
  <button
    type="submit"
    className="bg-theme px-4 py-1.5 rounded-md text-white disabled:bg-theme/80"
    disabled={disabled}
  >
    {label}
  </button>
);

const SlidesModal = () => {
  const dispatch = useDispatch();
  const { isSlidesModalActive } = useSelector((state) => state.sideBar);
  const { token } = useSelector((state) => state.user);
  const [imagesUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddBanner = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await postMultipleData(
        "/addSlides",
        { action: "add", image: image },
        token
      );
      if (response?.success) {
        dispatch(addGeneralSlides(response?.data));
        handleAsyncError(dispatch, response?.message, "success");
        dispatch(toggleSlidesModal());
      } else {
        handleAsyncError(dispatch, response?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed ${
        !isSlidesModalActive ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-20 mx-auto shadow-xl rounded-md bg-white max-w-md">
        <div className="flex items-center justify-between border-b p-2">
          <h2 className="text-theme font-semibold text-lg">Add Banner</h2>
          <button
            onClick={() => dispatch(toggleSlidesModal())}
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

        <div className="p-4 pt-2 text-center">
          <form onSubmit={handleAddBanner}>
            <div className="mb-3">
              <p className="text-gray-400 text-left text-xs italic">
                <span className="font-semibold mr-1">Note:</span>
                (Select 1920 x 1280 Image)
              </p>
              <ImageUploadAndPreview
                title="Banner"
                image={image}
                setImageChanger={setImage}
                imagesUrl={imagesUrl}
                setImageUrlChanger={setImageUrl}
              />
            </div>
            <div className="text-center">
              <Button
                label={
                  loading ? (
                    <div className="flex items-center gap-2">
                      <Spinner /> Submitting
                    </div>
                  ) : (
                    "Submit"
                  )
                }
                disabled={loading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SlidesModal;
