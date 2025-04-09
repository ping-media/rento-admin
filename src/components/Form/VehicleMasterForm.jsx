import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import SelectDropDown from "../InputAndDropdown/SelectDropDown";
import Spinner from "../Spinner/Spinner";
import ImageUploadAndPreview from "../ImageComponent/ImageUploadAndPreview";
import { useParams } from "react-router-dom";
import { vehicleBrands } from "../../Data/commonData";
import PreLoader from "../../components/Skeleton/PreLoader";

const VehicleMasterForm = ({ handleFormSubmit, loading }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const { id } = useParams();
  const [imagesUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);

  //options for vehicleType
  const vehicleTypeOptions = ["gear", "non-gear"];

  useEffect(() => {
    if (id && vehicleMaster?.length === 1)
      return setImageUrl(vehicleMaster[0]?.vehicleImage);
  }, [vehicleMaster]);

  return (
    <>
      {/* preloading  */}
      {id && vehicleMaster && vehicleMaster?.length === 0 && <PreLoader />}
      {/* form  */}
      <form onSubmit={handleFormSubmit}>
        <div className="flex flex-wrap gap-4">
          <div className="w-full lg:flex-1">
            {/* for updating the value of the existing one  */}

            <div className="flex flex-wrap gap-2">
              <Input
                item={"vehicleName"}
                value={id && vehicleMaster?.[0]?.vehicleName}
                require={true}
              />
              <SelectDropDown
                item={"vehicleType"}
                options={vehicleTypeOptions}
                value={id && vehicleMaster?.[0]?.vehicleType}
                require={true}
              />
              <SelectDropDown
                item={"vehicleBrand"}
                options={vehicleBrands}
                value={id && vehicleMaster?.[0]?.vehicleBrand}
                require={true}
              />
            </div>
          </div>
          <div className="w-full lg:flex-1">
            <ImageUploadAndPreview
              image={image}
              setImageChanger={setImage}
              imagesUrl={imagesUrl}
              setImageUrlChanger={setImageUrl}
              isRequired={id ? false : true}
            />
          </div>
          <button
            className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
            type="submit"
            disabled={loading || imagesUrl == ""}
          >
            {loading ? (
              <Spinner message={"uploading"} />
            ) : id ? (
              "Update"
            ) : (
              "Add New"
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default VehicleMasterForm;
