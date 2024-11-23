import { useEffect, useState } from "react";
import PreLoader from "../Skeleton/PreLoader";
import ImageUploadAndPreview from "../ImageComponent/ImageUploadAndPreview";
import Spinner from "../spinner/Spinner";
import { fetchVehicleMaster } from "../../Data/Function";
import { useDispatch, useSelector } from "react-redux";

const VehicleFormForCreate = ({ handleFormSubmit, loading, data }) => {
  const [imagesUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const [nestedData, setNestedData] = useState([]);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  // this is for setting data into the data we need
  useEffect(() => {
    data && setUpdatedData(data);
  }, []);

  const handleChangeValues = (e) => {
    if (value.includes("Image")) {
      setImageUrl(e.target.value);
    }
  };

  return updatedData?.length > 0 ? (
    <form onSubmit={handleFormSubmit}>
      {/* for future  */}
      {updatedData?.map((item, index) => {
        const isImage = item.includes("Image");
        if (!isImage) {
          return null;
        }

        return (
          <ImageUploadAndPreview
            imagesUrl={imagesUrl}
            setImageChanger={setImage}
            setImageUrlChanger={setImageUrl}
            key={index}
          />
        );
      })}

      <div className="flex flex-wrap gap-2 mb-5">
        {updatedData?.map((item, index) => (
          <div className="w-full lg:w-[48%]" key={index}>
            <label
              htmlFor={item}
              className="block text-gray-800 font-semibold text-sm"
            >
              Enter {item}
            </label>
            <div className="mt-2">
              <input
                id={item}
                className="block w-full rounded-md px-5 py-3 ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none"
                onChange={(e) => handleChangeValues(e)}
                name={item}
                placeholder={`${item}`}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
        type="submit"
        disabled={loading}
      >
        {loading ? <Spinner message={"uploading"} /> : "Publish"}
      </button>
    </form>
  ) : (
    <PreLoader />
  );
};

export default VehicleFormForCreate;
