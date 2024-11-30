import { createSlice } from "@reduxjs/toolkit";
import { decryptData, encryptData } from "../../utils/index";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    token: null,
    user: null,
    currentUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    handleLoadingUserData: (state) => {
      state.loading = true;
    },
    handleSetToken: (state, action) => {
      state.token = action.payload;
      state.loading = false;
    },
    handleSignIn: (state, action) => {
      const encryptedUser = encryptData(action.payload);
      state.user = encryptedUser;
      state.loading = false;
    },
    handleCurrentUser: (state, action) => {
      const decryptedUser = decryptData(action.payload);
      state.currentUser = decryptedUser;
      state.loading = false;
    },
    handleSignOut: (state) => {
      state.token = null;
      state.user = null;
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  handleLoadingUserData,
  handleSetToken,
  handleSignIn,
  handleCurrentUser,
  handleSignOut,
} = UserSlice.actions;

export default UserSlice.reducer;
