import { configureStore } from "@reduxjs/toolkit";
import ErrorReducer from "./ErrorSlice/ErrorSlice";
import SideBarReducer from "./SideBarSlice/SideBarSlice";
import VehicleReducer from "./AdsSlice/VehicleSlice";
import ThemeReducer from "./ThemeSlice/ThemeSlice";

const store = configureStore({
  reducer: {
    error: ErrorReducer,
    sideBar: SideBarReducer,
    vehicles: VehicleReducer,
    theme: ThemeReducer,
  },
});
export default store;
