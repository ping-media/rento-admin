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

    let isMounted = true;
    const fetchData = async () => {
      if (url === null) {
        setData([]);
        return;
      }

      setHookLoading(true);
      setError(null);

      try {
        let endpoint = url;
        const response = await getData(endpoint, token);
        if (response.status !== 200) {
          return handleAsyncError(dispatch, response?.message);
        }
        const result = response?.data || [];
        if (isMounted) {
          if (dispatchFn) dispatch(dispatchFn(result));
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          handleAsyncError(dispatch, err?.message);
        }
      } finally {
        if (isMounted) {
          setHookLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, token, dispatch, dispatchFn]);

  return { data, error, hookLoading, token };
}

export default useFetch;
