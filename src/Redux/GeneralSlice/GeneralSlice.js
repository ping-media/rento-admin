import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  general: {},
  loading: false,
};

const GeneralSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    addGeneral: (state, action) => {
      state.general = action.payload;
      state.loading = false;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    resetGeneral: () => initialState,
  },
});

export const { startLoading, addGeneral, stopLoading, resetGeneral } =
  GeneralSlice.actions;
export default GeneralSlice.reducer;
