import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
//importing slices
import ErrorReducer from "./ErrorSlice/ErrorSlice";
import SideBarReducer from "./SideBarSlice/SideBarSlice";
import VehicleReducer from "./VehicleSlice/VehicleSlice";
import DasboardReducer from "./DashboardSlice/DashboardSlice";
import ThemeReducer from "./ThemeSlice/ThemeSlice";
import userReducer from "./UserSlice/UserSlice";
import LocationAndStationReducer from "./LocationAndStationSlice/LocationAndStationSlice";
import PaginationReducer from "./PaginationSlice/PaginationSlice";

const userPersistConfig = {
  key: "user",
  version: "1",
  storage,
  whitelist: ["token", "user", "loggedInRole", "userStation"],
  blacklist: ["currentUser", "loading", "error"],
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const store = configureStore({
  reducer: {
    error: ErrorReducer,
    sideBar: SideBarReducer,
    vehicles: VehicleReducer,
    theme: ThemeReducer,
    user: persistedUserReducer,
    dashboard: DasboardReducer,
    locationAndStation: LocationAndStationReducer,
    pagination: PaginationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);
export { store, persistor };
