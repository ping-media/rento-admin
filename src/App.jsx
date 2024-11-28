import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PreLoader from "./components/Skeleton/PreLoader";
import { lazy, Suspense } from "react";

const CreateNewAndUpdateStationMaster = lazy(() =>
  import("./Pages/index").then((module) => ({
    default: module.CreateNewAndUpdateStationMaster,
  }))
);
const CreateNewAndUpdateLocationMaster = lazy(() =>
  import("./Pages/index").then((module) => ({
    default: module.CreateNewAndUpdateLocationMaster,
  }))
);
const CreateNewAndUpdateVehicleMaster = lazy(() =>
  import("./Pages/index").then((module) => ({
    default: module.CreateNewAndUpdateVehicleMaster,
  }))
);
const CreateNewAndUpdateVehicle = lazy(() =>
  import("./Pages/index").then((module) => ({
    default: module.CreateNewAndUpdateVehicle,
  }))
);
const CreateNewAndUpdateUser = lazy(() =>
  import("./Pages/index").then((module) => ({
    default: module.CreateNewAndUpdateUser,
  }))
);
const CreateNewAndUpdatePlan = lazy(() =>
  import("./Pages/index").then((module) => ({
    default: module.CreateNewAndUpdatePlan,
  }))
);
const Dashboard = lazy(() =>
  import("./Pages/index").then((module) => ({ default: module.Dashboard }))
);
const NotFound = lazy(() =>
  import("./Pages/index").then((module) => ({ default: module.NotFound }))
);
const VehicleDetails = lazy(() =>
  import("./Pages/index").then((module) => ({ default: module.VehicleDetails }))
);
const BookingDetails = lazy(() =>
  import("./Pages/index").then((module) => ({ default: module.BookingDetails }))
);
const VehicleMaster = lazy(() =>
  import("./Pages/index").then((module) => ({ default: module.VehicleMaster }))
);
// for default exports
const Layout = lazy(() => import("./components/layout/Layout"));
const Login = lazy(() => import("./components/Auth/Login"));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PreLoader />}>
        <Routes>
          <Route path="/" exact element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" exact element={<Dashboard />} />
            {/* vehicles Routes start */}
            <Route path="vehicle-master" exact element={<VehicleMaster />} />
            <Route
              path="vehicle-master/add-new"
              exact
              element={<CreateNewAndUpdateVehicleMaster />}
            />
            <Route
              path="vehicle-master/:id"
              exact
              element={<CreateNewAndUpdateVehicleMaster />}
            />
            <Route path="all-vehicles" exact element={<VehicleMaster />} />
            <Route
              path="all-vehicles/details/:id"
              exact
              element={<VehicleDetails />}
            />
            <Route
              path="all-vehicles/add-new"
              exact
              element={<CreateNewAndUpdateVehicle />}
            />
            <Route
              path="all-vehicles/:id"
              exact
              element={<CreateNewAndUpdateVehicle />}
            />
            {/* station Routes */}
            <Route path="station-master" exact element={<VehicleMaster />} />
            <Route
              path="station-master/add-new"
              exact
              element={<CreateNewAndUpdateStationMaster />}
            />
            <Route
              path="station-master/:id"
              exact
              element={<CreateNewAndUpdateStationMaster />}
            />
            {/* plans Routes */}
            <Route path="all-plans" exact element={<VehicleMaster />} />
            <Route
              path="all-plans/add-new"
              exact
              element={<CreateNewAndUpdatePlan />}
            />
            <Route
              path="all-plans/:id"
              exact
              element={<CreateNewAndUpdatePlan />}
            />
            {/* coupons Routes */}
            <Route path="all-coupons" exact element={<VehicleMaster />} />
            {/* <Route
              path="all-coupons/add-new"
              exact
              element={<CreateNewVehicle />}
            />
            <Route
              path="all-coupons/:id"
              exact
              element={<CreateNewVehicle />}
            /> */}
            {/* location Routes  */}
            <Route path="location-master" exact element={<VehicleMaster />} />
            <Route
              path="location-master/add-new"
              exact
              element={<CreateNewAndUpdateLocationMaster />}
            />
            <Route
              path="location-master/:id"
              exact
              element={<CreateNewAndUpdateLocationMaster />}
            />
            {/* users Routes  */}
            <Route path="all-users" exact element={<VehicleMaster />} />
            <Route
              path="all-users/add-new"
              exact
              element={<CreateNewAndUpdateUser />}
            />
            <Route
              path="all-users/:id"
              exact
              element={<CreateNewAndUpdateUser />}
            />
            {/* booking Routes  */}
            <Route path="manage-bookings" exact element={<VehicleMaster />} />
            <Route
              path="manage-bookings/details/:id"
              exact
              element={<BookingDetails />}
            />

            {/* if there is any error or if goes to url which is not a route in that
            case this error page will be shown. */}
            <Route path="*" exact element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
