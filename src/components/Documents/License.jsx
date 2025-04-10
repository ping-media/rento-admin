import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { postMultipleData } from "../../Data/index";
import Spinner from "../../components/Spinner/Spinner";
import InputFile from "../../components/InputAndDropdown/InputFile";
import { useParams } from "react-router-dom";

const License = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();
  const [formLoading, setFormLoading] = useState(false);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);

  const handleUploadLicense = async (e) => {
    setFormLoading(true);
    e.preventDefault();
    let formData = new FormData(e.target);
    let result = Object.fromEntries(formData.entries());
    if (!result) return handleAsyncError(dispatch, "choose vaild image first!");

    formData.append("userId", id);
    formData.append("docType", "license");

    try {
      const response = await postMultipleData(
        "/uploadDocument",
        formData,
        token
      );
      if (response?.status == 200) {
        handleAsyncError(dispatch, response?.message, "success");
        // setFrontImage(null);
        // setBackImage(null);
      } else {
        handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      handleAsyncError(dispatch, error?.message);
    }
    return setFormLoading(false);
  };

  //   for clean cleaning the state
  useEffect(() => {
    return () => {
      setFrontImage(null);
      setBackImage(null);
    };
  }, []);

  return (
    <div className="relative shadow-xl rounded bg-white w-full">
      <h2 className="font-semibold text-lg uppercase px-4 lg:px-6 py-2.5">
        upload License
      </h2>

      <div className="px-4 lg:px-6 pb-3 text-center lg:text-left">
        <form className="flex flex-wrap gap-4" onSubmit={handleUploadLicense}>
          <div className="w-full lg:flex-1 order-1 lg:order-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="mb-5 w-full lg:flex-1">
                <InputFile
                  name={"images"}
                  labelDesc={"Front License Image"}
                  labelId={"licenseFrontImage"}
                  image={frontImage}
                  setImage={setFrontImage}
                />
              </div>
              <div className="mb-5 w-full lg:flex-1">
                <InputFile
                  name={"images"}
                  labelDesc={"Back License Image"}
                  labelId={"licenseBackImage"}
                  image={backImage}
                  setImage={setBackImage}
                />
              </div>
            </div>
            <button
              className="bg-theme-black px-4 py-2 rounded-md text-gray-100 disabled:bg-gray-400"
              disabled={
                formLoading || (frontImage && backImage != null ? false : true)
              }
            >
              {formLoading ? (
                <Spinner message={"loading..."} />
              ) : (
                "Upload License"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default License;
