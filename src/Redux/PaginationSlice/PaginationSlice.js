import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
  limit: 10,
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
    handleRestPagination: () => initialState,
  },
});

export const { handleChangePage, handleChangeLimit, handleRestPagination } =
  PaginationSlice.actions;

export default PaginationSlice.reducer;
