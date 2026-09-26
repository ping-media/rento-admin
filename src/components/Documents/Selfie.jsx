import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { postMultipleData } from "../../Data/index";
import Spinner from "../../components/Spinner/Spinner";
import { useParams } from "react-router-dom";
import ImageUploadAndPreview from "../../components/ImageComponent/ImageUploadAndPreview";

const Selfie = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const [formLoading, setFormLoading] = useState(false);
  const [imagesUrl, setImageUrl] = useState({
    SelfieImage: "",
  });
  const [image, setImage] = useState({
    SelfieImage: null,
  });

  const docImages = [{ title: "SelfieImage" }];

  const handleUploadSelfie = async (e) => {
    setFormLoading(true);
    e.preventDefault();
    const isAnyImageMissing = Object.values(imagesUrl).some(
      (value) => value === ""
    );
    if (isAnyImageMissing) {
      return handleAsyncError(dispatch, "All Images Required!.");
    }

    const rawFormData = new FormData(e.target);
    const finalFormData = new FormData();

    for (let [key, value] of rawFormData.entries()) {
      if (!(value instanceof File)) {
        finalFormData.append(key, value);
      }
    }

    let hasFiles = false;

    for (const file of Object.values(image)) {
      if (file instanceof File || file instanceof Blob) {
        hasFiles = true;
        finalFormData.append("images", file);
      }
    }

    if (!hasFiles) {
      return handleAsyncError(
        dispatch,
        "Unable to upload! No images provided."
      );
    }

    finalFormData.append("userId", id);
    finalFormData.append("docType", "Selfie");

    try {
      const response = await postMultipleData(
        "/uploadDocument",
        finalFormData,
        token
      );
      if (response?.status === 200) {
        handleAsyncError(dispatch, response?.message, "success");
        setImage({
          SelfieImage: null,
        });
        setImageUrl({
          SelfieImage: "",
        });
      } else {
        handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      handleAsyncError(dispatch, error?.message);
    }
    return setFormLoading(false);
  };

  return (
    <div className="relative shadow-xl rounded bg-white w-full">
      <h2 className="font-semibold text-xl uppercase px-4 lg:px-6 py-2.5">
        upload Selfie
      </h2>

      <div className="px-4 lg:px-6 pb-3 text-center lg:text-left">
        <form className="flex flex-wrap gap-4" onSubmit={handleUploadSelfie}>
          <div className="w-full lg:flex-1 order-1 lg:order-2">
            {docImages.map((item, index) => (
              <div className="mb-5" key={index}>
                <ImageUploadAndPreview
                  title={item?.title}
                  image={image[item?.title]}
                  setImageMultiChanger={setImage}
                  imagesUrl={imagesUrl[item?.title]}
                  setImageUrlMultiChanger={setImageUrl}
                  name="images"
                />
              </div>
            ))}
            <button
              className="bg-theme-black px-4 py-2 rounded-md text-gray-100 disabled:bg-gray-400"
              disabled={
                formLoading ||
                Object.values(imagesUrl).some((value) => value === "")
              }
            >
              {formLoading ? (
                <Spinner message={"loading..."} />
              ) : (
                "Upload Selfie"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Selfie;
