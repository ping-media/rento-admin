import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PreLoader from "./components/Skeleton/PreLoader";
import { lazy, Suspense } from "react";
import PrivateRouteBasedOnUser from "./components/layout/PrivateRouteBasedOnUser";
import { useSelector } from "react-redux";

const Dashboard = lazy(() =>
  import("./Pages/index").then((module) => ({ default: module.Dashboard }))
);
const NotFound = lazy(() =>
  import("./Pages/index").then((module) => ({ default: module.NotFound }))
);
const Unauthorized = lazy(() =>
  import("./Pages/index").then((module) => ({ default: module.Unauthorized }))
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
const CreateNewAndUpdateForm = lazy(() =>
  import("./Pages/index").then((module) => ({
    default: module.CreateNewAndUpdateForm,
  }))
);
const Profile = lazy(() =>
  import("./Pages/index").then((module) => ({
    default: module.Profile,
  }))
);
const InvoiceDetails = lazy(() =>
  import("./Pages/index").then((module) => ({
    default: module.InvoiceDetails,
  }))
);
const General = lazy(() =>
  import("./Pages/index").then((module) => ({
    default: module.General,
  }))
);
const AddDocuments = lazy(() =>
  import("./Pages/index").then((module) => ({
    default: module.AddDocuments,
  }))
);
// for default exports
const Layout = lazy(() => import("./components/layout/Layout"));
const Login = lazy(() => import("./components/Auth/Login"));

const App = () => {
  // setting role for each route
  const { loggedInRole, verifyLoading } = useSelector((state) => state.user);

  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Suspense fallback={<PreLoader />}>
        <Routes>
          <Route path="/" exact element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route
              path="dashboard"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <Dashboard />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="settings"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <General />
                </PrivateRouteBasedOnUser>
              }
            />
            {/* vehicles Routes start */}
            <Route path="vehicle-master" exact element={<VehicleMaster />} />
            <Route
              path="vehicle-master/add-new"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <CreateNewAndUpdateForm />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="vehicle-master/:id"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <CreateNewAndUpdateForm />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="all-vehicles"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin", "manager"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <VehicleMaster />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="all-vehicles/details/:id"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin", "manager"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <VehicleDetails />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="all-vehicles/add-new"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin", "manager"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <CreateNewAndUpdateForm />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="all-vehicles/:id"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin", "manager"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <CreateNewAndUpdateForm />
                </PrivateRouteBasedOnUser>
              }
            />
            {/* station Routes */}
            <Route
              path="station-master"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <VehicleMaster />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="station-master/add-new"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <CreateNewAndUpdateForm />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="station-master/:id"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <CreateNewAndUpdateForm />
                </PrivateRouteBasedOnUser>
              }
            />
            {/* plans Routes */}
            <Route
              path="all-plans"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <VehicleMaster />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="all-plans/add-new"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <CreateNewAndUpdateForm />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="all-plans/:id"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <CreateNewAndUpdateForm />
                </PrivateRouteBasedOnUser>
              }
            />
            {/* coupons Routes */}
            <Route
              path="all-coupons"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <VehicleMaster />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="all-coupons/add-new"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <CreateNewAndUpdateForm />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="all-coupons/:id"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <CreateNewAndUpdateForm />
                </PrivateRouteBasedOnUser>
              }
            />
            {/* location Routes  */}
            <Route
              path="location-master"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <VehicleMaster />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="location-master/add-new"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <CreateNewAndUpdateForm />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="location-master/:id"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <CreateNewAndUpdateForm />
                </PrivateRouteBasedOnUser>
              }
            />
            {/* users & user documents Routes  */}
            <Route
              path="all-users"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <VehicleMaster />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="all-managers"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                >
                  <VehicleMaster />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="all-users/add-new"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <CreateNewAndUpdateForm />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="all-managers/add-new"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <CreateNewAndUpdateForm />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="all-users/:id"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <CreateNewAndUpdateForm />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="all-users/add-documents/:id"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <AddDocuments />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="all-managers/:id"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <CreateNewAndUpdateForm />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="all-managers/add-documents/:id"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <AddDocuments />
                </PrivateRouteBasedOnUser>
              }
            />
            {/* <Route path="users-documents" exact element={<VehicleMaster />} /> */}
            {/* booking Routes  */}
            <Route
              path="all-bookings"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin", "manager"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <VehicleMaster />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="all-bookings/add-new"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin", "manager"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <CreateNewAndUpdateForm />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="all-bookings/:id"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin", "manager"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <CreateNewAndUpdateForm />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="all-bookings/details/:id"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin", "manager"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <BookingDetails />
                </PrivateRouteBasedOnUser>
              }
            />
            {/* profile route  */}
            <Route
              path="profile"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin", "manager"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <Profile />
                </PrivateRouteBasedOnUser>
              }
            />

            {/* payment route  */}
            <Route
              path="payments"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin", "manager"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <VehicleMaster />
                </PrivateRouteBasedOnUser>
              }
            />

            {/* invoice route  */}
            <Route
              path="all-invoices"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin", "manager"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <VehicleMaster />
                </PrivateRouteBasedOnUser>
              }
            />
            <Route
              path="all-invoices/details/:id"
              exact
              element={
                <PrivateRouteBasedOnUser
                  allowedRoles={["admin", "manager"]}
                  userRole={loggedInRole}
                  isLoading={verifyLoading}
                >
                  <InvoiceDetails />
                </PrivateRouteBasedOnUser>
              }
            />
            {/* pickup route  */}
            {/* <Route path="all-pickup-image" exact element={<VehicleMaster />} /> */}

            {/* if there is any error or if goes to url which is not a route in that
            case this error page will be shown. */}
            <Route path="*" exact element={<NotFound />} />
            <Route path="/unauthorized" exact element={<Unauthorized />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
