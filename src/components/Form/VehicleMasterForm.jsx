import { useState } from "react";
import { useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import SelectDropDown from "../InputAndDropdown/SelectDropDown";
import Spinner from "../Spinner/Spinner";
import ImageUploadAndPreview from "../ImageComponent/ImageUploadAndPreview";

const VehicleMasterForm = ({ handleFormSubmit, loading }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [imagesUrl, setImageUrl] = useState(
    vehicleMaster.length === 1 && vehicleMaster[0]?.vehicleImage
  );
  const [image, setImage] = useState(null);

  //options for vehicleType
  const vehicleTypeOptions = ["gear", "non-gear"];

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex flex-wrap gap-4">
        <div className="w-full lg:flex-1">
          {/* for updating the value of the existing one  */}
          {vehicleMaster.length === 1 ? (
            <div className="flex flex-wrap gap-2">
              <Input
                item={"vehicleName"}
                value={vehicleMaster && vehicleMaster[0]?.vehicleName}
              />
              <SelectDropDown
                item={"vehicleType"}
                options={vehicleTypeOptions}
                value={vehicleMaster && vehicleMaster[0]?.vehicleType}
              />
              <Input
                item={"vehicleBrand"}
                value={vehicleMaster && vehicleMaster[0]?.vehicleBrand}
              />
            </div>
          ) : (
            // for creating new one
            <div className="flex flex-wrap gap-2">
              <Input item={"vehicleName"} />
              <SelectDropDown
                item={"vehicleType"}
                options={vehicleTypeOptions}
              />
              <Input item={"vehicleBrand"} />
            </div>
          )}
        </div>
        <div className="w-full lg:flex-1">
          <ImageUploadAndPreview
            image={image}
            setImageChanger={setImage}
            imagesUrl={imagesUrl}
            setImageUrlChanger={setImageUrl}
          />
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

export default VehicleMasterForm;
