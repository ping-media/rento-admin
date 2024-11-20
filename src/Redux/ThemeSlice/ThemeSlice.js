import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: localStorage.getItem("theme") || "light",
  loading: false
};

const ThemeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      state.theme = newTheme;
      localStorage.setItem("theme", newTheme);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const { toggleTheme, setLoading } = ThemeSlice.actions;

export default ThemeSlice.reducer;
