import Login from "./components/Auth/Login";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  CreateNewVehicle,
  // CreateNewPlan,
  Profile,
  AllVehicles,
  //AllPlans,
  Dashboard,
} from "./Pages/index";
import Layout from "./components/layout/Layout";
import AllVehiclesTbl from "./Pages/AllVehiclesTbl";
import CreateNewVehicleTbl from "./Pages/CreateNewVehicleTbl";
import CreateNewStation from "./Pages/CreateNewStation";
import CreateNewPlan from "./Pages/CreateNewPlan";
import AllUsers from "./Pages/AllUsers";
import AllStations from "./Pages/AllStations";
import AllPlans from "./Pages/AllPlans";
import AllLocations from "./Pages/AllLocations";
import CreateNewUser from "./Pages/CreateNewUser";
import CreateNewLocation from "./Pages/CreateNewLocation";
import AllStationManagers from "./Pages/AllStationManagers";
import AllStationCustomers from "./Pages/AllCustomers";
import AllKycApprovedUsers from "./Pages/AllKycApprovedUsers";
import AllEmailApprovedUser from "./Pages/AllEmailApprovedUser";
import AllContactApprovedUser from "./Pages/AllContactApprovedUser";
import PendingVehicles from "./Pages/PendingVehicles";
import ApprovedVehicles from "./Pages/ApprovedVehicles";
import AllBookings from "./Pages/AllBookings";
import ConfirmBookings from "./Pages/ConfirmBookings";
import PendingBookings from "./Pages/PendingBookings";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" exact element={<Dashboard />} />

          <Route path="vehicle-master" exact element={<AllVehicles />} />
          <Route path="manage-vehicles" exact element={<CreateNewVehicle />} />

          <Route path="all-vehicles" exact element={<AllVehiclesTbl />} />
          <Route path="pending-vehicles" exact element={<PendingVehicles />} />
          <Route path="approved-vehicles" exact element={<ApprovedVehicles />} />
          <Route path="manage-vehicleTbl" exact element={<CreateNewVehicleTbl />} />

          <Route path="all-bookings" exact element={<AllBookings />} />
          <Route path="confirmed-bookings" exact element={<ConfirmBookings />} />
          <Route path="pending-bookings" exact element={<PendingBookings />} />
          
          <Route path="all-users" exact element={<AllUsers />} />
          <Route path="manage-users" exact element={<CreateNewUser />} />
          <Route path="station-managers" exact element={<AllStationManagers />} />
          <Route path="customers" exact element={<AllStationCustomers />} />
          <Route path="kyc-approved-users" exact element={<AllKycApprovedUsers />} />
          <Route path="email-approved-users" exact element={<AllEmailApprovedUser />} />
          <Route path="phone-approved-users" exact element={<AllContactApprovedUser />} />

          <Route path="manage-station" exact element={<AllStations />} />
          {/* <Route path="manage-stations" exact element={<CreateNewStation />} /> */}

          <Route path="plans" exact element={<AllPlans />} />
          <Route path="manage-plans" exact element={<AllPlans />} />

          <Route path="location-master" exact element={<AllLocations />} />
          <Route path="manage-locations" exact element={<CreateNewLocation />} />

          <Route path="profile" exact element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
