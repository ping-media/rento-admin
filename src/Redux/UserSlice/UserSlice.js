import { createSlice } from "@reduxjs/toolkit";
import { decryptData, encryptData } from "../../utils/index";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    token: null,
    user: null,
    loggedInRole: "",
    userStation: null,
    currentUser: null,
    userDocument: null,
    loading: false,
    verifyLoading: false,
    authLoading: true,
    error: null,
  },
  reducers: {
    handleLoadingUserData: (state) => {
      state.loading = true;
    },
    handleAuthLoading: (state, action) => {
      state.authLoading = action.payload;
    },
    handleVerifyLoading: (state, action) => {
      state.verifyLoading = action.payload;
    },
    handleSetToken: (state, action) => {
      state.token = action.payload;
      state.loading = false;
    },
    SetLoggedInRole: (state, action) => {
      const { loggedInRole, userStation } = action.payload;
      state.loggedInRole = loggedInRole;
      state.userStation = userStation;
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
    addCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    updateCurrentUser: (state, action) => {
      const { firstName, lastName, email, altContact } = action.payload;
      state.currentUser = {
        ...state.currentUser,
        firstName,
        lastName,
        email,
        altContact,
      };
    },
    addUserDocument: (state, action) => {
      state.userDocument = action.payload;
    },
    removeUserDocument: (state) => {
      state.userDocument = null;
    },
    handleLoadingUserDataFalse: (state) => {
      state.loading = false;
    },
    handleSignOut: (state) => {
      state.token = null;
      state.user = null;
      state.currentUser = null;
      state.loggedInRole = "";
      state.userStation = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  handleLoadingUserData,
  SetLoggedInRole,
  handleSetToken,
  handleSignIn,
  handleCurrentUser,
  addCurrentUser,
  updateCurrentUser,
  handleLoadingUserDataFalse,
  addUserDocument,
  removeUserDocument,
  handleSignOut,
  handleVerifyLoading,
  handleAuthLoading,
} = UserSlice.actions;

export default UserSlice.reducer;
