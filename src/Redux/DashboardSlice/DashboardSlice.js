import { createSlice } from "@reduxjs/toolkit";

const DashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    dasboardDataCount: null,
    loading: false,
    error: null,
  },
  reducers: {
    handleLoadingDashboardData: (state) => {
      state.loading = true;
    },
    handleDashboardData: (state, action) => {
      state.dasboardDataCount = action.payload;
      state.loading = false;
    },
    resetDashboardData: () => initialState,
  },
});

export const {
  handleLoadingDashboardData,
  handleDashboardData,
  resetDashboardData,
} = DashboardSlice.actions;

export default DashboardSlice.reducer;
