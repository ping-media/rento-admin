import { useState } from "react";
import { useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import SelectDropDown from "../InputAndDropdown/SelectDropDown";
import Spinner from "../Spinner/Spinner";
import ImageUploadAndPreview from "../ImageComponent/ImageUploadAndPreview";
import { useParams } from "react-router-dom";
import { vehicleBrands } from "../../Data/commonData";

const VehicleMasterForm = ({ handleFormSubmit, loading }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const { id } = useParams();
  const [imagesUrl, setImageUrl] = useState(
    id && vehicleMaster[0]?.vehicleImage
  );
  const [image, setImage] = useState(null);

  //options for vehicleType
  const vehicleTypeOptions = ["gear", "non-gear"];

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex flex-wrap gap-4">
        <div className="w-full lg:flex-1">
          {/* for updating the value of the existing one  */}

          <div className="flex flex-wrap gap-2">
            <Input
              item={"vehicleName"}
              value={id && vehicleMaster[0]?.vehicleName}
            />
            <SelectDropDown
              item={"vehicleType"}
              options={vehicleTypeOptions}
              value={id && vehicleMaster[0]?.vehicleType}
            />
            <SelectDropDown
              item={"vehicleBrand"}
              options={vehicleBrands}
              value={id && vehicleMaster[0]?.vehicleBrand}
            />
          </div>
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
