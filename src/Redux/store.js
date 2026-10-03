import { configureStore } from "@reduxjs/toolkit";
// import storage from "redux-persist/lib/storage";
import storage from "redux-persist/es/storage";
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
import GeneralReducer from "./GeneralSlice/GeneralSlice";
import MaintenanceReducer from "./MaintenanceSlice/MaintenanceSlice";
import { encryptedAdminTransform } from "../utils/index";

const userPersistConfig = {
  key: "user",
  version: "1",
  storage,
  whitelist: ["token", "user", "currentUser", "loggedInRole", "userStation"],
  blacklist: ["loading", "error"],
  transforms: [encryptedAdminTransform],
};

const paginationPersistConfig = {
  key: "pagination",
  version: "1",
  storage,
  whitelist: ["searchTerm", "filters", "activeFilterName"],
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedPaginationReducer = persistReducer(
  paginationPersistConfig,
  PaginationReducer
);

const store = configureStore({
  reducer: {
    error: ErrorReducer,
    sideBar: SideBarReducer,
    vehicles: VehicleReducer,
    theme: ThemeReducer,
    user: persistedUserReducer,
    dashboard: DasboardReducer,
    locationAndStation: LocationAndStationReducer,
    pagination: persistedPaginationReducer,
    general: GeneralReducer,
    maintenance: MaintenanceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);
export { store, persistor };
