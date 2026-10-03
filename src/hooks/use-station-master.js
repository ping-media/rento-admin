import { endPointBasedOnKey } from "../Data/commonData";
import { getData } from "../Data";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export const useStationMasterData = () => {
  const { token } = useSelector((state) => state.user);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationResponse, stationResponse] = await Promise.all([
          getData(`${endPointBasedOnKey.locationId}?fetchAll=true`, token),
          getData(`${endPointBasedOnKey.stationId}?fetchAll=true`, token),
        ]);

        setData({
          locationId: locationResponse?.data || [],
          stationId: stationResponse?.data || [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return { data, loading };
};
