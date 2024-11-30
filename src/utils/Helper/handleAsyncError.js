import { setError } from "../../Redux/ErrorSlice/ErrorSlice";

export const handleAsyncError = (dispatch, error, type) => {
  dispatch(
    setError({
      message: error || "Error Occur. Try Again!",
      type: type || "error",
    })
  );
};
