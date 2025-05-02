import { createSlice } from "@reduxjs/toolkit";

const DashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    dasboardDataCount: null,
    loading: false,
    navigateLoad: false,
  },
  reducers: {
    handleNavigateLoad: (state, action) => {
      state.navigateLoad = action.payload;
    },
    handleLoadingDashboardData: (state) => {
      state.loading = true;
    },
    handleDashboardData: (state, action) => {
      state.dasboardDataCount = action.payload;
      state.loading = false;
    },
    resetDashboardData: (state) => {
      state.dasboardDataCount = null;
      state.loading = false;
    },
  },
});

export const {
  handleNavigateLoad,
  handleLoadingDashboardData,
  handleDashboardData,
  resetDashboardData,
} = DashboardSlice.actions;

export default DashboardSlice.reducer;
