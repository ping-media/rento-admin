import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  general: {},
  loading: false,
  extraAddOn: { data: [], pagination: null, loading: false },
};

const GeneralSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    startAddOnLoading: (state) => {
      state.extraAddOn.loading = true;
    },
    addGeneral: (state, action) => {
      state.general = action.payload;
      state.loading = false;
    },
    addAddOn: (state, action) => {
      const { data, pagination } = action.payload;
      state.extraAddOn.data = data;
      state.extraAddOn.pagination = pagination;
      state.extraAddOn.loading = false;
    },
    updateAddOnData: (state, action) => {
      const updated = action.payload;
      state.extraAddOn.data = state.extraAddOn.data.map((item) =>
        item._id === updated._id ? { ...item, ...updated } : item
      );
    },
    updateGSTStatus: (state, action) => {
      state.general.GST.status = action.payload;
    },
    addNewAddOnData: (state, action) => {
      state.extraAddOn.data = action.payload;
    },
    removeAddOnData: (state, action) => {
      const idToRemove = action.payload;
      state.extraAddOn.data = state.extraAddOn.data.filter(
        (item) => item._id !== idToRemove
      );
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    stopAddOnLoading: (state) => {
      state.extraAddOn.loading = false;
    },
    resetGeneral: () => initialState,
  },
});

export const {
  startLoading,
  startAddOnLoading,
  addAddOn,
  addGeneral,
  addNewAddOnData,
  updateAddOnData,
  removeAddOnData,
  stopLoading,
  stopAddOnLoading,
  updateGSTStatus,
  resetGeneral,
} = GeneralSlice.actions;
export default GeneralSlice.reducer;
