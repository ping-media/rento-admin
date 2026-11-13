import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getFullData } from "../Data/index";

const useManagers = (enabled = true) => {
  const { token } = useSelector((state) => state.user);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    if (!enabled) return;
    (async () => {
      try {
        const res = await getFullData(
          "/admin/getAllUsers?userType=manager&status=active&page=1&limit=200",
          token,
        );
        setManagers(res?.data?.data || []);
      } catch (error) {
        setManagers([]);
      }
    })();
  }, [token, enabled]);

  return managers;
};

export default useManagers;
