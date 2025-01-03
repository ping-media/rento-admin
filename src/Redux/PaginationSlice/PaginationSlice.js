import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
  limit: 10,
  searchTerm: null,
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
    handleChangeSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    handleRestSearchTerm: (state) => {
      state.searchTerm = null;
    },
    handleRestPagination: () => initialState,
  },
});

export const {
  handleChangePage,
  handleChangeLimit,
  handleChangeSearchTerm,
  handleRestSearchTerm,
  handleRestPagination,
} = PaginationSlice.actions;

export default PaginationSlice.reducer;
