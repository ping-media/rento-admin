import { useEffect, useState } from "react";
import Spinner from "../spinner/Spinner";
import PreLoader from "../Skeleton/PreLoader";
import ImageUploadAndPreview from "../ImageComponent/ImageUploadAndPreview";

const VehicleForm = ({ handleFormSubmit, loading, data }) => {
  const [imagesUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

  // this is for setting data into the data we need
  useEffect(() => {
    const newData = data.length > 1 ? [data[0]] : data;
    data &&
      data[0]._id &&
      newData?.map((item) => {
        const { createdAt, updatedAt, __v, _id, ...rest } = item;
        //this is to set image to image preview for the first time
        Object.entries(rest)?.map(([key, value]) => {
          if (key.includes("Image")) {
            setImageUrl(value);
          }
        });
        //remove unwanted data and set new data
        setUpdatedData(rest);
      });
  }, []);

  const handleChangeValues = (e, key) => {
    if (key.includes("Image")) {
      setImageUrl(e.target.value);
    }
    setUpdatedData((prevData) => ({
      ...prevData,
      [key]: e.target.value,
    }));
  };

  return Object.keys(updatedData).length > 0 ? (
    <form onSubmit={handleFormSubmit}>
      {/* for future  */}
      {Object.entries(updatedData)?.map(([key]) => {
        const isImage = key.includes("Image");
        if (!isImage) {
          return null;
        }

        return (
          <ImageUploadAndPreview
            imagesUrl={imagesUrl}
            setImageChanger={setImage}
            setImageUrlChanger={setImageUrl}
          />
        );
      })}

      <div className="flex flex-wrap gap-2 mb-5">
        {Object.entries(updatedData)?.map(([key, value]) => {
          // // if we found value related to image than remove skip it
          // const isImage =
          //   typeof value === "string" &&
          //   (value.includes(".jpg") ||
          //     value.includes(".jpeg") ||
          //     value.includes(".png") ||
          //     value.includes(".gif"));
          const isId = key.includes("Id");
          // // if it return true than skip the input rendering
          if (isId) {
            return null;
          }

          return (
            <div className="w-full lg:w-[48%]" key={key}>
              <label
                htmlFor={key}
                className="block text-gray-800 font-semibold text-sm"
              >
                Enter {key}
              </label>
              <div className="mt-2">
                <input
                  id={key}
                  className="block w-full rounded-md px-5 py-3 ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none"
                  value={value}
                  onChange={(e) => handleChangeValues(e, key)}
                  name={key}
                  placeholder={key}
                />
              </div>
            </div>
          );
        })}
      </div>
      <button
        className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
        type="submit"
        disabled={loading}
      >
        {loading ? (
          <Spinner message={"uploading"} />
        ) : location?.pathname?.split("/").length - 1 > 1 ? (
          "Update"
        ) : (
          "Publish"
        )}
      </button>
    </form>
  ) : (
    <PreLoader />
  );
};

export default VehicleForm;
