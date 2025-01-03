import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  is_open: true,
  isModelActive: false,
  isRechargeModelActive: false,
  isVerifyUserModalActive: false,
  isDeleteModalActive: false,
  isUploadPickupImageActive: false,
};

const SideBarSlice = createSlice({
  name: "sideBar",
  initialState,
  reducers: {
    toggleSideBar: (state) => {
      state.is_open = state.is_open === true ? false : true;
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
    toggleClearModals: () => initialState,
  },
});

export const {
  toggleSideBar,
  toggleModal,
  toggleRechargeModal,
  toggleVerifyUserModal,
  toggleClearModals,
  toggleDeleteModal,
  togglePickupImageModal,
} = SideBarSlice.actions;

export default SideBarSlice.reducer;
