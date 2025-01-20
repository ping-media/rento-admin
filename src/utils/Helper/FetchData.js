import { getData } from "../../Data/index";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleAsyncError } from "./handleAsyncError";

function useFetch(url, dispatchFn) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [hookLoading, setHookLoading] = useState(false);
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      setHookLoading(true);
      setError(null);

      try {
        const response = await getData(url, token);
        if (!response.ok) {
          return handleAsyncError(dispatch, response?.message);
        }
        const result = response?.data;
        dispatchFn && dispatch(dispatchFn(result));
        setData(result);
      } catch (err) {
        return handleAsyncError(dispatch, err?.message);
      } finally {
        setHookLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, error, hookLoading };
}

export default useFetch;
