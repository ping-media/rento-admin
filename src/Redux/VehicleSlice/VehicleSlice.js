import { createSlice } from "@reduxjs/toolkit";

const vehicleSlice = createSlice({
  name: "vehicles",
  initialState: {
    vehicleMaster: null,
    Vehicle: {},
    deletevehicleId: "",
    tempVehicleData: null,
    tempIds: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchVehicleStart: (state) => {
      state.loading = true;
      state.vehicleMaster = null;
      state.Vehicle = {};
      state.deletevehicleId = "";
    },
    fetchVehicleSuccess: (state, action) => {
      state.loading = false;
      state.Vehicle = action.payload;
    },
    fetchVehicleMasterData: (state, action) => {
      state.vehicleMaster = action.payload;
      state.loading = false;
    },
    handleUpdateStatus: (state, action) => {
      const { id, newStatus, flag } = action.payload;
      const data = state?.vehicleMaster?.data?.find((item) => item._id === id);
      if (data) {
        data[flag] = newStatus;
      }
    },
    addTempVehicleData: (state, action) => {
      state.loading = false;
      state.tempVehicleData = action.payload;
    },
    addTempIdsAll: (state, action) => {
      state.loading = false;
      state.tempIds = action.payload;
    },
    addTempIds: (state, action) => {
      state.loading = false;
      state.tempIds = [...state.tempIds, ...action.payload];
    },
    removeTempVehicleData: (state) => {
      state.loading = false;
      state.tempVehicleData = null;
    },
    removeTempIds: (state) => {
      state.loading = false;
      state.tempIds = [];
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
    addVehicleIdToDelete: (state, action) => {
      state.deletevehicleId = action.payload;
    },
    fetchVehicleFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    restDeletevehicleId: (state) => {
      state.deletevehicleId = "";
    },
    fetchVehicleEnd: (state) => {
      state.loading = false;
    },
    toggleClearVehicle: () => initialState,
  },
});

export const {
  fetchVehicleStart,
  fetchVehicleSuccess,
  fetchVehicleMasterData,
  fetchMoreVehicleSuccess,
  addVehicleIdToDelete,
  addTempVehicleData,
  removeTempVehicleData,
  fetchVehicleFailure,
  restDeletevehicleId,
  toggleClearVehicle,
  fetchVehicleEnd,
  addTempIdsAll,
  addTempIds,
  removeTempIds,
  handleUpdateStatus,
} = vehicleSlice.actions;
export default vehicleSlice.reducer;
