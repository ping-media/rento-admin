import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  is_open: true,
  isModelActive: false,
  isDeleteModelActive: false,
  isRechargeModelActive: false,
  isVerifyUserModalActive: false,
  isEditLimitModalActive: false,
  editLimit: { id: "", limit: "", totalDownload: "" },
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
    toggleDeleteModal: (state, action) => {
      state.isDeleteModelActive = state.isDeleteModelActive === false ? true : false;
    },
    toggleRechargeModal: (state) => {
      state.isRechargeModelActive =
        state.isRechargeModelActive === false ? true : false;
    },
    toggleVerifyUserModal: (state) => {
      state.isVerifyUserModalActive =
        state.isVerifyUserModalActive === false ? true : false;
    },
    toggleEditLimitModal: (state) => {
      state.isEditLimitModalActive =
        state.isEditLimitModalActive === false ? true : false;
    },
    handleDataId: (state, action) => {
      state.editLimit = action.payload;
    },
    toggleClearModals: () => initialState,
  },
});

export const {
  toggleSideBar,
  toggleModal,
  toggleDeleteModal,
  toggleRechargeModal,
  toggleVerifyUserModal,
  toggleEditLimitModal,
  handleDataId,
  toggleClearModals,
} = SideBarSlice.actions;

export default SideBarSlice.reducer;
