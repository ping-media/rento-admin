import { useState, useEffect, useCallback, useRef } from "react";
import { getData, postData } from "../Data";
import { useDispatch, useSelector } from "react-redux";
import { handleAsyncError } from "../utils/Helper/handleAsyncError";

const usePolicy = (type) => {
  const { token } = useSelector((state) => state.user);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const cache = useRef({});

  const fetchPolicy = useCallback(async () => {
    if (!type) return;

    // Return cached content if already fetched
    if (cache.current[type] !== undefined) {
      setContent(cache.current[type]);
      return;
    }

    try {
      setFetching(true);
      setError(null);
      const response = await getData(`/all-policy/${type}`, token);
      setContent(response?.content ?? "");
    } catch (err) {
      if (err.response?.status === 404) {
        setContent(""); // No policy yet, not an error
        handleAsyncError(
          dispatch,
          err?.response?.message ?? "Unable to fetch policy! try again",
        );
      } else {
        setError(err.response?.data?.message ?? "Failed to fetch policy");
      }
    } finally {
      setFetching(false);
    }
  }, [type]);

  const updatePolicy = useCallback(async () => {
    if (!type || !content) return;
    try {
      setLoading(true);
      setError(null);
      await postData(`/all-policy`, { type, content }, token);
      handleAsyncError(dispatch, "policy update successfully.", "success");
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to update policy");
      handleAsyncError(dispatch, "Unable to update policy! try again");
    } finally {
      setLoading(false);
    }
  }, [type, content]);

  useEffect(() => {
    fetchPolicy();
  }, [fetchPolicy]);

  return { content, setContent, loading, fetching, error, updatePolicy };
};

export default usePolicy;
