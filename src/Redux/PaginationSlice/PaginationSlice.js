import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
  limit: 10,
  searchTerm: null,
  searchType: "all",
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
    handleRestSearchType: (state) => {
      state.searchType = "All";
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
} = PaginationSlice.actions;

export default PaginationSlice.reducer;
