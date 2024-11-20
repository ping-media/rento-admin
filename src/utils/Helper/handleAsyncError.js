import { setError } from "../../Redux/ErrorSlice/ErrorSlice";

export const handleAsyncError = (dispatch, error, type) => {
  dispatch(
    setError({ message: error || "An error occured", type: type || "error" })
  );
};
