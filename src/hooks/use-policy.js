import { useState, useEffect, useCallback } from "react";
import { getData, postData } from "../Data";
import { useSelector } from "react-redux";

const usePolicy = (type) => {
  const { token } = useSelector((state) => state.user);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

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
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to update policy");
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
