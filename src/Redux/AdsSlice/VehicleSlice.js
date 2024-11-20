import { createSlice } from "@reduxjs/toolkit";

const vehicleSlice = createSlice({
  name: "vehicles",
  initialState: {
    Vehicle: {},
    loading: false,
    error: null,
    loginDetails: {},
    tableData: [],
    columnData: [],
    addNew: false,
    updateData: {}
  },
  reducers: {   
    setUpdateData: (state, action) => {
      state.updateData = action.payload;
    },
    setAddNew: (state, action) => {
      state.addNew = action.payload;
    },
    setLoginDetails: (state, action) => {
      state.loginDetails = action.payload;
    },
    setTableData: (state, action) => {
      state.tableData = action.payload;
    },
    setColumnData: (state, action) => {
      state.columnData = action.payload;
    },
    fetchVehicleStart: (state) => {
      state.loading = true;
      state.downloadLoading = true;
      state.error = null;
    },
    fetchVehicleSuccess: (state, action) => {
      state.loading = false;
      state.Vehicle = action.payload;
    },
    fetchMoreVehicleSuccess: (state, action) => {
      state.loading = false;
      state.Vehicle.models = [
        ...state.Vehicle.models,
        ...action.payload.models,
      ];
      state.Vehicle.lastVisible = action.payload.lastVisible;
      state.Vehicle.totalApp = action.payload.totalApp;
    },
    fetchVehicleFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateAdLimit: (state, action) => {
      const { id, newLimit, limitOff } = action.payload;
      const item = state.Vehicle.models.find(
        (item) => item.TransactionId === id
      );
      if (item) {
        item.enquiryLimit = newLimit;
        item.limitoff = limitOff;
      }
    },
    toggleClearVehicle: (state) => {
      state.Vehicle = {};
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoginDetails,
  setColumnData,
  setUpdateData,
  setTableData,
  fetchVehicleStart,
  setAddNew,
  fetchVehicleSuccess,
  fetchMoreVehicleSuccess,
  fetchVehicleFailure,
  updateAdLimit,
  toggleClearVehicle,
} = vehicleSlice.actions;
export default vehicleSlice.reducer;
