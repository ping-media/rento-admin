import { createSlice } from "@reduxjs/toolkit";

const ErrorSlice = createSlice({
  name: "error",
  initialState: {
    message: null,
    type: "error",
  },
  reducers: {
    setError: (state, action) => {
      (state.message = action.payload.message),
        (state.type = action.payload.type);
    },
    clearError: (state) => {
      state.message = null;
      state.type = "error";
    },
  },
});

export const { setError, clearError } = ErrorSlice.actions;
export default ErrorSlice.reducer;
