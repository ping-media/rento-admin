import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
  limit: 25,
  searchTerm: null,
  searchType: "all",
  vehiclesFilter: {
    vehicleName: "",
    search: "",
    maintenanceType: "",
    bookingVehicleName: "",
    couponName: "",
  },
};

const PaginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    handleChangePage: (state, action) => {
      state.page = action.payload;
    },
    handleChangeLimit: (state, action) => {
      state.limit = action.payload;
    },
    handleChangeSearchType: (state, action) => {
      state.searchType = action.payload;
    },
    handleChangeSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    handleRestSearchTerm: (state) => {
      state.searchTerm = null;
    },
    setVehicleName: (state, action) => {
      state.vehiclesFilter.vehicleName = action.payload;
    },
    setSearch: (state, action) => {
      state.vehiclesFilter.search = action.payload;
    },
    setMaintenanceType: (state, action) => {
      state.vehiclesFilter.maintenanceType = action.payload;
    },
    setBookingVehicleName: (state, action) => {
      state.vehiclesFilter.bookingVehicleName = action.payload;
    },
    setCouponName: (state, action) => {
      state.vehiclesFilter.couponName = action.payload;
    },
    resetBookingVehicleName: (state) => {
      state.vehiclesFilter.bookingVehicleName = "";
    },
    resetCouponName: (state) => {
      state.vehiclesFilter.couponName = "";
    },
    resetVehiclesFilter: (state) => {
      state.vehiclesFilter.vehicleName = "";
      state.vehiclesFilter.search = "";
      state.vehiclesFilter.maintenanceType = "";
      state.vehiclesFilter.bookingVehicleName = "";
      state.vehiclesFilter.couponName = "";
    },
    handleRestPagination: () => initialState,
  },
});

export const {
  handleChangePage,
  handleChangeLimit,
  handleChangeSearchTerm,
  handleChangeSearchType,
  handleRestSearchTerm,
  handleRestSearchType,
  handleRestPagination,
  setVehicleName,
  setSearch,
  setMaintenanceType,
  resetVehiclesFilter,
  setBookingVehicleName,
  setCouponName,
  resetCouponName,
  resetBookingVehicleName,
} = PaginationSlice.actions;

export default PaginationSlice.reducer;
