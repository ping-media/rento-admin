import { useDispatch, useSelector } from "react-redux";
import { getData } from "../Data/index";
import GeneralAddOn from "../components/general/GeneralAddOn";
import React, { useEffect } from "react";
import { fetchVehicleMasterData } from "../Redux/VehicleSlice/VehicleSlice";

const AddonManager = () => {
  const { userStation, token } = useSelector((state) => state.user);
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const dispatch = useDispatch();

  const fetchCollectedData = async () => {
    const response = await getData(
      `/getStationData?_id=${userStation?._id}&fetchAll=true`,
      token
    );
    if (response) {
      dispatch(fetchVehicleMasterData(response?.data));
    }
  };

  useEffect(() => {
    fetchCollectedData();
  }, []);

  if (vehicleMaster?.length === 0) {
    return <PreLoader />;
  }

  return (
    <div className="w-full px-4">
      <GeneralAddOn />
    </div>
  );
};

export default AddonManager;
