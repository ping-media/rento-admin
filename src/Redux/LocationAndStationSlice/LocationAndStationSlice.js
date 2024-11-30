import { createSlice } from "@reduxjs/toolkit";

const LocationAndStationSlice = createSlice({
  name: "locationAndStation",
  initialState: {
    locationMaster: null,
    station: null,
    deletelocationAndStationId: "",
    loading: false,
    error: null,
  },
  reducers: {
    fetchingStart: (state) => {
      state.loading = true;
    },
    fetchLocationMaster: (state, action) => {
      state.loading = false;
      state.locationMaster = action.payload;
    },
    fetchsStation: (state, action) => {
      state.station = action.payload;
      state.loading = false;
    },
    addVehicleAndStationIdToDelete: (state, action) => {
      state.deletelocationAndStationId = action.payload;
    },
    restDeletevehicleAndStationId: (state) => {
      state.deletelocationAndStationId = "";
    },
    toggleClearVehicle: () => initialState,
  },
});

export const {
  fetchVehicleStart,
  fetchVehicleSuccess,
  fetchVehicleMasterData,
  addVehicleAndStationIdToDelete,
  restDeletevehicleAndStationId,
  toggleClearVehicle,
} = LocationAndStationSlice.actions;
export default LocationAndStationSlice.reducer;
