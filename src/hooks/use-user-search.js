import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchUserDataBasedOnQuery } from "../Data/Function";
import {
  addTempVehicleData,
  removeTempVehicleData,
} from "../Redux/VehicleSlice/VehicleSlice";

export const useUserSearch = ({ token, isManagerSearch = false }) => {
  const [inputValue, setInputValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRef = useRef(null);
  const { tempVehicleData } = useSelector((state) => state.vehicles);
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const isStationRoute = pathname.includes("/station-master/");

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(tempVehicleData)) return [];
    return tempVehicleData.filter((u) =>
      isStationRoute
        ? u.userType !== "customer"
        : u.userType !== "admin" && u.userType !== "manager",
    );
  }, [tempVehicleData, isStationRoute]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const search = (value) => {
    setInputValue(value);
    clearTimeout(timeoutRef.current);

    if (!value) {
      setIsSearching(false);
      dispatch(removeTempVehicleData());
      return;
    }

    setIsSearching(true);
    timeoutRef.current = setTimeout(async () => {
      const params = new URLSearchParams({ search: value });

      if (isManagerSearch) {
        params.set("userType", "manager");
      }

      const data = await fetchUserDataBasedOnQuery(
        `/admin/getAllUsers?${params.toString()}`,
        token,
      );
      dispatch(addTempVehicleData(data));
    }, 300);
  };

  const closeList = () => {
    setIsSearching(false);
    dispatch(removeTempVehicleData());
  };

  return {
    inputValue,
    setInputValue,
    isSearching,
    tempVehicleData,
    filteredUsers,
    search,
    closeList,
  };
};
