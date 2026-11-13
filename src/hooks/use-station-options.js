import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getFullData } from "../Data/index";

const useStationOptions = (enabled = true) => {
  const { token } = useSelector((state) => state.user);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    if (!enabled) return;
    (async () => {
      try {
        const res = await getFullData(
          "/getStationData?page=1&limit=200",
          token,
        );
        setStations(res?.data?.data || []);
      } catch (e) {
        setStations([]);
      }
    })();
  }, [enabled, token]);

  return stations;
};

export default useStationOptions;
