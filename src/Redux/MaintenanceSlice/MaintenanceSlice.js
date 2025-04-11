import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  maintenance: null,
  loading: false,
};

const MaintenanceSlice = createSlice({
  name: "maintenance",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    addSchedule: (state, action) => {
      state.maintenance = action.payload;
      state.loading = false;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    resetSchedule: () => initialState,
  },
});

export const { startLoading, addSchedule, stopLoading, resetSchedule } =
  MaintenanceSlice.actions;
export default MaintenanceSlice.reducer;
