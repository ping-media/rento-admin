import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import Spinner from "../Spinner/Spinner";
import ImageUploadAndPreview from "../ImageComponent/ImageUploadAndPreview";
import { useParams } from "react-router-dom";
import ArrowSelect from "../../components/InputAndDropdown/ArrowSelect";

const LocationMasterForm = ({ handleFormSubmit, loading }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const { id } = useParams();
  const [imagesUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (id && vehicleMaster?.length === 1)
      return setImageUrl(vehicleMaster?.[0]?.locationImage || "");
  }, [vehicleMaster]);

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex flex-wrap gap-4">
        <div className="w-full">
          <ImageUploadAndPreview
            image={image}
            setImageChanger={setImage}
            imagesUrl={imagesUrl}
            setImageUrlChanger={setImageUrl}
            isRequired={!id}
          />
        </div>
        <div className="w-full">
          {/* for updating the value of the existing one  */}
          <div className="w-full mb-1">
            <Input
              item={"locationName"}
              value={(id && vehicleMaster?.[0]?.locationName) || ""}
            />
          </div>
          <div className="w-full mb-1">
            <label className="block text-left text-sm font-semibold text-gray-800">
              Show location name
            </label>
            <ArrowSelect
              wrapperClassName="mt-2"
              name="showLocationName"
              defaultValue={String(
                (id && vehicleMaster?.[0]?.showLocationName) || false,
              )}
              className="w-full rounded-md ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none px-5 py-3"
            >
              <option value="false">No, hide the name</option>
              <option value="true">Yes, show the name</option>
            </ArrowSelect>
            <p className="mt-1 text-xs text-gray-500">
              Controls whether the location name is displayed on the
              website/app.
            </p>
          </div>
          <div className="w-full mb-1">
            <Input
              item={"latitude"}
              value={(id && vehicleMaster?.[0]?.latitude) || ""}
              type="number"
            />
          </div>
          <div className="w-full mb-1">
            <Input
              item={"longitude"}
              value={(id && vehicleMaster?.[0]?.longitude) || ""}
              type="number"
            />
          </div>
          <div className="w-full">
            <Input
              item={"radiusKm"}
              value={(id && vehicleMaster?.[0]?.radiusKm) || ""}
              type="number"
            />
          </div>
        </div>
        <button
          className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-theme focus:ring-opacity-50 disabled:bg-gray-400"
          type="submit"
          disabled={loading}
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
  );
};

export default LocationMasterForm;
