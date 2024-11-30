import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: localStorage.getItem("theme") || "light",
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
  },
});

export const { toggleTheme } = ThemeSlice.actions;

export default ThemeSlice.reducer;
