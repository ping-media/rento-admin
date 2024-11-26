import { useState } from "react";
import { useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import Spinner from "../Spinner/Spinner";
import ImageUploadAndPreview from "../ImageComponent/ImageUploadAndPreview";

const LocationMasterForm = ({ handleFormSubmit, loading }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [imagesUrl, setImageUrl] = useState(
    vehicleMaster.length === 1 && vehicleMaster[0]?.locationImage
  );
  const [image, setImage] = useState(null);

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex flex-wrap gap-4">
        <div className="w-full">
          <ImageUploadAndPreview
            image={image}
            setImageChanger={setImage}
            imagesUrl={imagesUrl}
            setImageUrlChanger={setImageUrl}
          />
        </div>
        <div className="w-full">
          {/* for updating the value of the existing one  */}
          {vehicleMaster?.length === 1 ? (
            <div className="w-full">
              <Input
                item={"locationName"}
                value={vehicleMaster && vehicleMaster[0]?.locationName}
              />
            </div>
          ) : (
            // for creating new one
            <div className="w-full">
              <Input item={"locationName"} />
            </div>
          )}
        </div>
        <button
          className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
          type="submit"
          disabled={loading}
        >
          {loading ? <Spinner message={"uploading"} /> : "Publish"}
        </button>
      </div>
    </form>
  );
};

export default LocationMasterForm;
