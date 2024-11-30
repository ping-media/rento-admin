import { useEffect, useState } from "react";
import PreLoader from "../Skeleton/PreLoader";
import ImageUploadAndPreview from "../ImageComponent/ImageUploadAndPreview";
import Spinner from "../spinner/Spinner";
import { fetchVehicleMaster } from "../../Data/Function";
import { useDispatch, useSelector } from "react-redux";
import { endPointBasedOnKey } from "../../Data/commonData";
import { getData } from "../../Data";

const VehicleFormForCreate = ({ handleFormSubmit, loading, data }) => {
  const [imagesUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const [datatoBeFetched, setDataToBeFetched] = useState([]);
  const [dataBasedOnId, setDataBasedOnId] = useState(null);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  // this is for setting data into the data we need

  const fetchDataBasedOnId = async (endpoint) => {
    const response = await getData(endpoint, token);
    console.log(response?.data);
    // if (response.status == 200) {
    //   setDataBasedOnId((prev) => [...prev, { key: response?.data }]);
    // }
  };

  useEffect(() => {
    data && setUpdatedData(data);
    const newData = [];
    data?.map((item) => {
      if (item.includes("Id")) {
        newData.push(item);
      }
    });
    setDataToBeFetched(newData);

    console.log(newData);
  }, []);

  useEffect(() => {
    if (datatoBeFetched.length > 0) {
      datatoBeFetched?.map((item) => {
        fetchDataBasedOnId(endPointBasedOnKey[item]);
      });
    }
    console.log(dataBasedOnId);
  }, [datatoBeFetched]);

  const handleChangeValues = (e) => {
    if (e.target.value.includes("Image")) {
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
            image={image}
            setImageChanger={setImage}
            imagesUrl={imagesUrl}
            setImageUrlChanger={setImageUrl}
            key={index}
          />
        );
      })}

      <div className="flex flex-wrap gap-2 mb-5">
        {updatedData?.map((item, index) => {
          const isId = item.includes("Id");
          const isType = item.includes("Type");
          const isImage = item.includes("Image");
          if (isId || isType) {
            return (
              <div className="w-full lg:w-[48%]" key={index}>
                <label
                  htmlFor={item}
                  className="block text-gray-800 font-semibold text-sm"
                >
                  Select {item}
                </label>
                <div className="mt-2">
                  {isType ? (
                    <select
                      name={item}
                      id={item}
                      className="block w-full rounded-md px-5 py-3 ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none"
                    >
                      <option value={"gear"}>gear</option>
                      <option value={"non-gear"}>non-gear</option>
                    </select>
                  ) : (
                    <select
                      name={item}
                      id={item}
                      className="block w-full rounded-md px-5 py-3 ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none"
                    >
                      <option value={"gear"}>gear</option>
                      <option value={"non-gear"}>non-gear</option>
                    </select>
                  )}
                </div>
              </div>
            );
          } else if (isImage) {
            return null;
          }

          return (
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
          );
        })}
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
