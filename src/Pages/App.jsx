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
import AllUsers from "./Pages/AllUsers";
import AllStations from "./Pages/AllStations";
import AllPlans from "./Pages/AllPlans";
import AllLocations from "./Pages/AllLocations";
import CreateNewUser from "./Pages/CreateNewUser";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" exact element={<Dashboard />} />

          <Route path="vehicles" exact element={<AllVehicles />} />
          <Route path="manage-vehicles" exact element={<CreateNewVehicle />} />

          <Route path="vehicleTbl" exact element={<AllVehiclesTbl />} />
          <Route path="manage-vehicleTbl" exact element={<CreateNewVehicleTbl />} />

          <Route path="users" exact element={<AllUsers />} />
          <Route path="manage-users" exact element={<CreateNewUser />} />

          <Route path="stations" exact element={<AllStations />} />
          <Route path="manage-stations" exact element={<CreateNewStation />} />

          <Route path="plans" exact element={<AllPlans />} />
          <Route path="manage-plans" exact element={<CreateNewPlan />} />
          

          {/* 

          
          
          
          
          
          
          <Route path="locations" exact element={<AllLocations />} />
          <Route path="manage-locations" exact element={<AllLocations />} /> */}

          <Route path="profile" exact element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
