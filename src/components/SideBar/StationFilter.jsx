import SelectDropDown from "../../components/InputAndDropdown/SelectDropDown";
import { getData } from "../../Data";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const StationFilter = ({ stationId, setStationId }) => {
  const { token } = useSelector((state) => state.user);
  const [stations, setStations] = useState(null);
  const [resetDropdown, setResetDropdown] = useState(false);

  const fetchStation = useCallback(async () => {
    try {
      const response = await getData("/getStationData?page=1&limit=100", token);
      if (response?.status === 200) {
        setStations(response?.data);
      }
    } catch (error) {
      console.log("Error fetching station data! try again");
      setStations(null);
    }
  }, []);

  useEffect(() => {
    fetchStation();
  }, []);

  const handleClearStationId = () => {
    setStationId("");
    setResetDropdown(true);
  };

  //   checking the station id
  const isStationId = stationId && stationId?.trim() !== "";

  return (
    <div className="mt-2 mb-5">
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <label>Select Station</label>
            {isStationId && (
              <button
                onClick={handleClearStationId}
                className="border border-theme px-1 py-0.5 text-theme rounded-md"
              >
                Remove
              </button>
            )}
          </div>

          <SelectDropDown
            item={"stationId"}
            options={
              stations &&
              stations.filter((station) => station?.status !== "inactive")
            }
            value={stationId}
            setIsLocationSelected={setStationId}
            isLabel={false}
            require={true}
            changetoDefault={resetDropdown}
            changeModalClose={setResetDropdown}
          />
        </div>
      </div>
    </div>
  );
};

export default StationFilter;
