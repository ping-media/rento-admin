import { createSlice } from "@reduxjs/toolkit";

const vehicleSlice = createSlice({
  name: "vehicles",
  initialState: {
    vehicleMaster: null,
    timeLineData: null,
    maintenanceData: { data: null, pagination: null, loading: false },
    userRideInfo: null,
    Vehicle: {},
    vehiclePickupImage: null,
    deletevehicleId: "",
    tempVehicleData: null,
    userDocuments: null,
    blockVehicleId: "",
    blockLoading: false,
    tempIds: [],
    tempData: null,
    maintenanceIds: [],
    maintenanceLoading: false,
    tempLoading: { loading: false, operation: "" },
    isHeaderChecked: false,
    isOneOrMoreHeaderChecked: false,
    refresh: false,
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
    addOrRemoveTempData: (state, action) => {
      state.tempData = action.payload;
    },
    fetchVehicleMasterData: (state, action) => {
      state.vehicleMaster = action.payload;
      state.loading = false;
    },
    addTimeLineData: (state, action) => {
      state.timeLineData = action.payload;
    },
    updateBookingDates: (state, action) => {
      const { BookingEndDateAndTime, BookingStartDateAndTime } = action.payload;
      if (BookingStartDateAndTime) {
        state.vehicleMaster[0]["BookingStartDateAndTime"] =
          BookingStartDateAndTime;
      }
      if (BookingEndDateAndTime) {
        state.vehicleMaster[0]["BookingEndDateAndTime"] = BookingEndDateAndTime;
      }
    },
    updateTimeLineData: (state, action) => {
      const { timeLine } = action.payload;
      state.timeLineData = {
        ...state.timeLineData,
        timeLine: [...(state.timeLineData?.timeLine || []), ...timeLine],
      };
    },
    addNewMaintenanceData: (state, action) => {
      state.maintenanceData.data = [
        action.payload,
        ...(state.maintenanceData.data || []),
      ];
    },
    updateBookingPrice: (state, action) => {
      state.vehicleMaster[0] = {
        ...state.vehicleMaster[0],
        bookingPrice: {
          ...state.vehicleMaster[0].bookingPrice,
          ...action.payload,
        },
      };
    },
    updateStationAddon: (state, action) => {
      let payload = action.payload;
      const currentAddOns = state.vehicleMaster[0]?.extraAddOn || [];

      if (Array.isArray(payload)) {
        state.vehicleMaster[0].extraAddOn = payload;
      } else {
        const index = currentAddOns.findIndex(
          (item) => item._id === payload._id
        );
        if (index !== -1) {
          currentAddOns[index] = payload;
        } else {
          currentAddOns.push(payload);
        }
        state.vehicleMaster[0].extraAddOn = currentAddOns;
      }
    },
    removeStationAddOn: (state, action) => {
      const idToRemove = action.payload;
      if (state.vehicleMaster.length > 0) {
        state.vehicleMaster[0].extraAddOn =
          state.vehicleMaster[0].extraAddOn.filter(
            (item) => String(item._id) !== String(idToRemove)
          );
      }
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
    handleUpdateDateForPayment: (state, action) => {
      const { bookingPrice } = action.payload;
      state.vehicleMaster[0] = {
        ...state.vehicleMaster[0],
        bookingPrice: bookingPrice,
      };
      if (action.payload?.Note) {
        state.vehicleMaster[0]?.notes.push(Note);
      }
    },
    handleUpdateCompleteRide: (state, action) => {
      const { rideStatus, lateFeeBasedOnHour, lateFeeBasedOnKM } =
        action.payload;
      state.vehicleMaster[0] = {
        ...state.vehicleMaster[0],
        bookingPrice: {
          ...state.vehicleMaster[0]?.bookingPrice,
          lateFeeBasedOnHour,
          lateFeeBasedOnKM,
        },
        rideStatus,
      };
    },
    handleUpdateStatus: (state, action) => {
      const { id, newStatus, flag } = action.payload;
      const data = state?.vehicleMaster?.data?.find((item) => item._id === id);
      if (data) {
        data[flag] = newStatus;
      }
    },
    handleUpdateAddonStatus: (state, action) => {
      const { id, newStatus } = action.payload;
      const data = state?.vehicleMaster?.[0]?.extraAddOn?.find(
        (item) => item._id === id
      );
      if (data) {
        data.status = newStatus;
      }
    },
    handleUpdateExtendVehicle: (state, action) => {
      const {
        // BookingStartDateAndTime,
        BookingEndDateAndTime,
        oldBookings,
        extendAmount,
        notes,
        bookingStatus,
      } = action.payload;
      state.vehicleMaster[0] = {
        ...state.vehicleMaster[0],
        // BookingStartDateAndTime,
        BookingEndDateAndTime,
        bookingPrice: {
          ...state.vehicleMaster[0]?.bookingPrice,
          extendAmount: [
            ...(Array.isArray(
              state.vehicleMaster[0]?.bookingPrice?.extendAmount
            )
              ? state.vehicleMaster[0].bookingPrice.extendAmount
              : []),
            ...(Array.isArray(extendAmount)
              ? extendAmount
              : extendAmount
              ? [extendAmount]
              : []),
          ],
        },
        extendBooking: {
          oldBooking: [
            ...(Array.isArray(state.vehicleMaster[0]?.extendBooking?.oldBooking)
              ? state.vehicleMaster[0].extendBooking.oldBooking
              : []),
            ...(Array.isArray(oldBookings)
              ? oldBookings
              : oldBookings
              ? [oldBookings]
              : []),
          ],
        },
        ...(notes && {
          notes: [...(state.vehicleMaster[0]?.notes || []), notes],
        }),
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
    handleChangesAfterVehicleChange: (state, action) => {
      const updatedData = action.payload;
      state.vehicleMaster[0] = {
        ...state.vehicleMaster[0],
        ...updatedData,
        bookingPrice: {
          ...updatedData?.bookingPrice,
        },
        vehicleBasic: {
          ...state.vehicleMaster[0]?.vehicleBasic,
          ...updatedData?.vehicleBasic,
        },
        changeVehicle: {
          ...(state.vehicleMaster[0]?.changeVehicle || {}),
          ...updatedData?.changeVehicle,
        },
      };
    },
    handleUpdateNotes: (state, action) => {
      state.vehicleMaster[0] = {
        ...state.vehicleMaster[0],
        notes: [...state.vehicleMaster[0].notes, action.payload],
      };
    },
    handleUpdateUserStatus: (state, action) => {
      state.vehicleMaster[0]
        ? (state.vehicleMaster[0] = {
            ...state.vehicleMaster[0],
            userId: { ...state.vehicleMaster[0].userId, ...action.payload },
          })
        : (state.vehicleMaster = {
            ...state.vehicleMaster,
            ...action.payload,
          });
    },
    addTempVehicleData: (state, action) => {
      state.loading = false;
      state.tempVehicleData = action.payload;
    },
    addTempIdsAll: (state, action) => {
      state.loading = false;
      state.tempIds = action.payload;
    },
    addMaintenanceIdsAll: (state, action) => {
      state.maintenanceIds = action.payload;
    },
    addTempIds: (state, action) => {
      state.loading = false;
      state.tempIds = [...state.tempIds, ...action.payload];
    },
    addMaintenanceIds: (state, action) => {
      state.maintenanceIds = [...state.maintenanceIds, ...action.payload];
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
      const { id, planPrice, kmLimit } = action.payload;

      state.tempIds = state.tempIds.map((item) =>
        item._id === id
          ? {
              ...item,
              ...(planPrice !== undefined && { planPrice }),
              ...(kmLimit !== undefined && { kmLimit }),
            }
          : item
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
    removeLastmaintenanceId: (state) => {
      if (state.maintenanceIds.length > 0) {
        state.maintenanceIds.pop();
      }
    },
    removeSingleMaintenanceIdsById: (state, action) => {
      const idToRemove = action.payload;
      state.maintenanceIds = state.maintenanceIds.filter(
        (item) => item !== idToRemove
      );
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
    removemaintenanceIds: (state) => {
      state.maintenanceIds = [];
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
    toggleRefresh: (state) => {
      state.refresh = !state.refresh;
    },
    addUserDocuments: (state, action) => {
      state.userDocuments = action.payload;
    },
    removeUserDocuments: (state) => {
      state.userDocuments = null;
    },
    addBlockVehicleId: (state, action) => {
      state.blockVehicleId = action.payload;
    },
    removeBlockVehicleId: (state) => {
      state.blockVehicleId = "";
    },
    addPickupImages: (state, action) => {
      state.vehiclePickupImage = action.payload;
    },
    handleMaintenanceLoading: (state, action) => {
      state.maintenanceLoading = action.payload;
    },
    handleBlockLoading: (state, action) => {
      state.blockLoading = action.payload;
    },
    addUserRideInfo: (state, action) => {
      state.userRideInfo = action.payload;
    },
    startMaintenanceLoading: (state) => {
      state.maintenanceData.loading = true;
    },
    addMaintenanceData: (state, action) => {
      const { data, pagination } = action.payload;
      state.maintenanceData.data = data;
      state.maintenanceData.pagination = pagination;
      state.maintenanceData.loading = false;
    },
    updateMaintenanceData: (state, action) => {
      state.maintenanceData.data = {
        ...state.maintenanceData.data,
        endDate: action.payload,
      };
    },
    resetMaintenanceData: (state) => {
      state.maintenanceData.data = null;
      state.maintenanceData.pagination = null;
      state.maintenanceData.loading = false;
    },
    resetUserRideInfo: (state) => {
      state.userRideInfo = null;
    },
    resetPickupImages: (state) => {
      state.vehiclePickupImage = null;
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
  updateBookingDates,
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
  handleUpdateAddonStatus,
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
  handleUpdateDateForPayment,
  handleUpdateFlags,
  addTimeLineData,
  updateTimeLineData,
  handleUpdateExtendVehicle,
  handleUpdateCompleteRide,
  addNewMaintenanceData,
  toggleRefresh,
  addUserDocuments,
  removeUserDocuments,
  addBlockVehicleId,
  removeBlockVehicleId,
  addMaintenanceIds,
  addMaintenanceIdsAll,
  removeLastmaintenanceId,
  removemaintenanceIds,
  removeSingleMaintenanceIdsById,
  addPickupImages,
  resetPickupImages,
  handleMaintenanceLoading,
  handleBlockLoading,
  addUserRideInfo,
  resetUserRideInfo,
  startMaintenanceLoading,
  addMaintenanceData,
  updateMaintenanceData,
  updateBookingPrice,
  resetMaintenanceData,
  handleChangesAfterVehicleChange,
  addOrRemoveTempData,
  updateStationAddon,
  removeStationAddOn,
} = vehicleSlice.actions;
export default vehicleSlice.reducer;
