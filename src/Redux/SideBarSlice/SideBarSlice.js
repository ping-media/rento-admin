import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  is_open: true,
  isFilterOpen: false,
  isModelActive: false,
  isRechargeModelActive: false,
  isVerifyUserModalActive: false,
  isDeleteModalActive: false,
  isUploadPickupImageActive: false,
  isVehicleBulkModalActive: false,
  isVehicleForServiceActive: false,
  isKycModalActive: false,
  isRideEndModalActive: false,
  isChangeVehicleModalActive: false,
  isBookingExtendModalActive: false,
  isPaymentUpdateModalActive: false,
  isForgetModalActive: false,
  isVehicleUpdateModalActive: false,
  isIdentityModalActive: false,
  isSelfieModalActive: false,
  isLicenseModalActive: false,
};

const SideBarSlice = createSlice({
  name: "sideBar",
  initialState,
  reducers: {
    toggleSideBar: (state) => {
      state.is_open = state.is_open === true ? false : true;
    },
    toggleFilterSideBar: (state) => {
      state.isFilterOpen = state.isFilterOpen === true ? false : true;
    },
    toggleModal: (state) => {
      state.isModelActive = state.isModelActive === false ? true : false;
    },
    toggleRechargeModal: (state) => {
      state.isRechargeModelActive =
        state.isRechargeModelActive === false ? true : false;
    },
    toggleVerifyUserModal: (state) => {
      state.isVerifyUserModalActive =
        state.isVerifyUserModalActive === false ? true : false;
    },
    toggleDeleteModal: (state) => {
      state.isDeleteModalActive =
        state.isDeleteModalActive === false ? true : false;
    },
    togglePickupImageModal: (state) => {
      state.isUploadPickupImageActive =
        state.isUploadPickupImageActive === false ? true : false;
    },
    toggleVehicleServiceModal: (state) => {
      state.isVehicleForServiceActive =
        state.isVehicleForServiceActive === false ? true : false;
    },
    toogleBulkVehicleEditModal: (state) => {
      state.isVehicleBulkModalActive =
        state.isVehicleBulkModalActive === false ? true : false;
    },
    toogleKycModalActive: (state) => {
      state.isKycModalActive = state.isKycModalActive === false ? true : false;
    },
    toggleChangeVehicleModal: (state) => {
      state.isChangeVehicleModalActive =
        state.isChangeVehicleModalActive === false ? true : false;
    },
    toggleRideEndModal: (state) => {
      state.isRideEndModalActive =
        state.isRideEndModalActive === false ? true : false;
    },
    toggleBookingExtendModal: (state) => {
      state.isBookingExtendModalActive =
        state.isBookingExtendModalActive === false ? true : false;
    },
    togglePaymentUpdateModal: (state) => {
      state.isPaymentUpdateModalActive =
        state.isPaymentUpdateModalActive === false ? true : false;
    },
    toggleForgetPasswordModal: (state) => {
      state.isForgetModalActive =
        state.isForgetModalActive === false ? true : false;
    },
    toggleVehicleUpdateModal: (state) => {
      state.isVehicleUpdateModalActive =
        state.isVehicleUpdateModalActive === false ? true : false;
    },
    toggleIdentityModal: (state) => {
      state.isIdentityModalActive =
        state.isIdentityModalActive === false ? true : false;
    },
    toggleSelfieModal: (state) => {
      state.isSelfieModalActive =
        state.isSelfieModalActive === false ? true : false;
    },
    toggleLicenseModal: (state) => {
      state.isLicenseModalActive =
        state.isLicenseModalActive === false ? true : false;
    },
    toggleClearModals: () => initialState,
  },
});

export const {
  toggleFilterSideBar,
  toggleSideBar,
  toggleModal,
  toggleRechargeModal,
  toggleVerifyUserModal,
  toggleClearModals,
  toggleDeleteModal,
  togglePickupImageModal,
  toogleBulkVehicleEditModal,
  toggleVehicleServiceModal,
  toogleKycModalActive,
  toggleChangeVehicleModal,
  toggleBookingExtendModal,
  toggleRideEndModal,
  togglePaymentUpdateModal,
  toggleVehicleUpdateModal,
  toggleForgetPasswordModal,
  toggleIdentityModal,
  toggleLicenseModal,
  toggleSelfieModal,
} = SideBarSlice.actions;

export default SideBarSlice.reducer;
