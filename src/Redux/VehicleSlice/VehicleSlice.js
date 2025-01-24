import { createSlice } from "@reduxjs/toolkit";

const vehicleSlice = createSlice({
  name: "vehicles",
  initialState: {
    vehicleMaster: null,
    Vehicle: {},
    deletevehicleId: "",
    tempVehicleData: null,
    tempIds: [],
    tempLoading: { loading: false, operation: "" },
    isHeaderChecked: false,
    isOneOrMoreHeaderChecked: false,
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
    handleIsHeaderChecked: (state, action) => {
      state.isHeaderChecked = action.payload;
    },
    handleIsOneOrMoreHeaderChecked: (state, action) => {
      state.isOneOrMoreHeaderChecked = action.payload;
    },
    handleUpdateFlags: (state, action) => {
      const data = action.payload;
      const updatedData = state.vehicleMaster.map((item) =>
        item._id === data._id ? { ...item, ...data } : item
      );
      state.vehicleMaster = updatedData;
    },
    handleUpdateStatus: (state, action) => {
      const { id, newStatus, flag } = action.payload;
      const data = state?.vehicleMaster?.data?.find((item) => item._id === id);
      if (data) {
        data[flag] = newStatus;
      }
    },
    handleUpdateExtendVehicle: (state, action) => {
      const {
        BookingStartDateAndTime,
        BookingEndDateAndTime,
        oldBookings,
        extendAmount,
        bookingStatus,
      } = action.payload;
      state.vehicleMaster[0] = {
        ...state.vehicleMaster[0],
        BookingStartDateAndTime,
        BookingEndDateAndTime,
        bookingPrice: {
          ...state.vehicleMaster[0]?.bookingPrice,
          extendAmount: [
            ...state.vehicleMaster[0]?.bookingPrice?.extendAmount,
            extendAmount,
          ],
        },
        extendBooking: {
          oldBooking: [
            ...state.vehicleMaster[0]?.extendBooking?.oldBooking,
            oldBookings,
          ],
        },
        bookingStatus,
      };
    },
    handleUpdateImageData: (state, action) => {
      const { id } = action.payload;
      state.vehicleMaster[0] = {
        ...state.vehicleMaster[0],
        files: state.vehicleMaster[0].files.filter((file) => file._id !== id),
      };
    },
    handleChangesInBooking: (state, action) => {
      const data = action.payload;
      state.vehicleMaster[0] = {
        ...state.vehicleMaster[0],
        data,
      };
    },
    handleUpdateNotes: (state, action) => {
      state.vehicleMaster[0] = {
        ...state.vehicleMaster[0],
        notes: [...state.vehicleMaster[0].notes, action.payload],
      };
    },
    handleUpdateUserStatus: (state, action) => {
      state.vehicleMaster[0] = {
        ...state.vehicleMaster[0],
        userId: [...state.vehicleMaster[0].userId, action.payload],
      };
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
    changeTempLoadingTrue: (state, action) => {
      state.tempLoading.loading = true;
      state.tempLoading.operation = action.payload;
    },
    changeTempLoadingFalse: (state) => {
      state.tempLoading.loading = false;
      state.tempLoading.operation = "";
    },
    updateTempId: (state, action) => {
      const { id, planPrice } = action.payload;
      state.tempIds = state.tempIds.map((item) =>
        item._id === id ? { ...item, planPrice } : item
      );
    },
    removeTempVehicleData: (state) => {
      state.loading = false;
      state.tempVehicleData = null;
    },
    removeLastTempId: (state) => {
      if (state.tempIds.length > 0) {
        state.tempIds.pop();
      }
    },
    removeSingleTempIdById: (state, action) => {
      const idToRemove = action.payload;
      state.tempIds = state.tempIds.filter((item) => item !== idToRemove);
    },
    removeTempIdById: (state, action) => {
      const idToRemove = action.payload;
      state.tempIds = state.tempIds.filter((item) => item._id !== idToRemove);
    },
    removeTempIds: (state) => {
      state.loading = false;
      state.tempIds = [];
    },
    handleInvoiceCreated: (state, action) => {
      const newData = action.payload;
      state.vehicleMaster.forEach((item) => {
        if (item._id === newData._id) {
          Object.assign(item, newData);
        }
      });
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
    restvehicleMaster: (state) => {
      state.vehicleMaster = null;
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
  handleIsHeaderChecked,
  fetchMoreVehicleSuccess,
  addVehicleIdToDelete,
  addTempVehicleData,
  removeLastTempId,
  removeTempVehicleData,
  fetchVehicleFailure,
  restDeletevehicleId,
  toggleClearVehicle,
  fetchVehicleEnd,
  handleInvoiceCreated,
  addTempIdsAll,
  addTempIds,
  removeTempIds,
  handleUpdateStatus,
  updateTempId,
  removeTempIdById,
  removeSingleTempIdById,
  handleUpdateImageData,
  restvehicleMaster,
  changeTempLoadingTrue,
  changeTempLoadingFalse,
  handleIsOneOrMoreHeaderChecked,
  handleChangesInBooking,
  handleUpdateNotes,
  handleUpdateUserStatus,
  handleUpdateFlags,
  handleUpdateExtendVehicle,
} = vehicleSlice.actions;
export default vehicleSlice.reducer;
