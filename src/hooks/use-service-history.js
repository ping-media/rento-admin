import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../Data/index";
import { handleAsyncError } from "../utils/Helper/handleAsyncError";
import useStationScope from "./use-station-scope";

const LIMIT = 10;

const useServiceHistory = (vehicleTableId) => {
  const dispatch = useDispatch();
  const { withStation } = useStationScope();
  const { token } = useSelector((state) => state.user);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [openId, setOpenId] = useState(null);

  const fetchPage = async (p) => {
    p === 1 ? setLoading(true) : setLoadingMore(true);
    try {
      const res = await getData(
        withStation(
          `/maintenance-request/history/${vehicleTableId}?page=${p}&limit=${LIMIT}`,
        ),
        token,
      );
      if (res?.status === 200) {
        setItems((prev) => (p === 1 ? res.data : [...prev, ...res.data]));
        setTotal(res.total || 0);
        setPage(p);
      } else {
        handleAsyncError(dispatch, res?.message);
      }
    } catch (e) {
      handleAsyncError(dispatch, e?.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!vehicleTableId) return;
    setItems([]);
    setOpenId(null);
    fetchPage(1);
  }, [vehicleTableId]);

  return {
    items,
    total,
    loading,
    loadingMore,
    hasMore: items.length < total,
    loadMore: () => fetchPage(page + 1),
    openId,
    toggle: (id) => setOpenId((prev) => (prev === id ? null : id)),
  };
};

export default useServiceHistory;
