import { useSelector } from "react-redux";

const useStationScope = () => {
  const { loggedInRole, userStation } = useSelector((state) => state.user);
  const isManager = loggedInRole === "manager";
  // the custom station id; change the key here if yours is named differently
  const stationId = isManager ? userStation?.stationId : undefined;

  const withStation = (url) =>
    stationId
      ? `${url}${url.includes("?") ? "&" : "?"}stationId=${stationId}`
      : url;

  const bodyScope = stationId ? { stationId } : {};

  return { isManager, stationId, withStation, bodyScope };
};

export default useStationScope;
