import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import Spinner from "../Spinner/Spinner";
import { useParams } from "react-router-dom";
import { fetchStationBasedOnLocation } from "../../Data/Function";

const PlanForm = ({ handleFormSubmit, loading }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [isLocationSelected, setIsLocationSelected] = useState("");
  const [stationData, setStationData] = useState(null);
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);

  //updating station based on location id
  useEffect(() => {
    if (isLocationSelected !== "") {
      fetchStationBasedOnLocation(
        vehicleMaster,
        isLocationSelected,
        setStationData,
        token
      );
    }
  }, [isLocationSelected]);

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex flex-wrap gap-4">
        {/* for updating the value of the existing one & for creating new one */}
        <>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"planName"}
              value={id ? vehicleMaster?.[0]?.planName : ""}
            />
          </div>
          {!id && (
            <>
              <div className="w-full lg:w-[48%]">
                <Input
                  item={"planDuration"}
                  type="number"
                  value={id && Number(vehicleMaster?.[0]?.planDuration)}
                />
              </div>
            </>
          )}
          <div className="w-full lg:w-[48%]">
            <Input
              item={"planPrice"}
              type="number"
              value={id && Number(vehicleMaster?.[0]?.planPrice)}
            />
          </div>
        </>
      </div>
      <button
        className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
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
    </form>
  );
};

export default PlanForm;
