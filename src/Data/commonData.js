import { lazy } from "react";

const CouponForm = lazy(() => import("../components/Form/CouponsForm.jsx"));
const BookingForm = lazy(() => import("../components/Form/BookingForm.jsx"));
const PlanForm = lazy(() => import("../components/Form/PlanForm.jsx"));
const StationMasterForm = lazy(() =>
  import("../components/Form/StationMasterForm.jsx")
);
const VehicleForm = lazy(() => import("../components/Form/VehicleForm.jsx"));
const LocationMasterForm = lazy(() =>
  import("../components/Form/LocationMasterForm.jsx")
);
const UserForm = lazy(() => import("../components/Form/UserForm.jsx"));
const VehicleMasterForm = lazy(() =>
  import("../components/Form/VehicleMasterForm.jsx")
);

// for fetching & posting data to backend link
const endPointBasedOnURL = {
  "vehicle-master": "/getVehicleMasterData",
  "vehicle-master/": "/createVehicleMaster",
  "vehicle-master/update": "/updateVehicleMaster",
  "vehicle-master/delete": "/deleteVehicleMaster",
  "location-master": "/getLocationData",
  "location-master/": "/createLocation",
  "location-master/update": "/updateLocation",
  "location-master/delete": "/deleteLocation",
  "station-master": "/getStationData",
  "station-master/": "/createStation",
  "all-plans": "/getPlanData",
  "all-plans/": "/createPlan",
  "all-vehicles": "/getAllVehiclesData",
  "all-vehicles/": "/createVehicle",
  "all-users": "/getAllUsers",
  "all-managers": "/getAllUsers",
  "all-users/": "/signup",
  "all-managers/": "/signup",
  "users-documents": "/getAllDocument",
  "users-documents/": "/uploadDocument",
  "all-bookings": "/getBooking",
  "all-bookings/": "/createBooking",
  "all-coupons": "/getCoupons",
  "all-coupons/": "/createCoupon",
  payments: "/paymentRec",
  "all-invoices": "/getAllInvoice",
  "all-pickup-image": "/getPickupImage",
};

//tofetchData for based on key
const endPointBasedOnKey = {
  stationId: "/getStationData",
  locationId: "/getLocationData",
  userId: "/getAllUsers?userType=manager",
  userIdAll: "/getAllUsers",
  vehicleMasterId: "/getVehicleMasterData",
  vehicleTableId: "/getAllVehiclesData",
  AllPlanDataId: "/getPlanData",
};

// states
const States = [
  "andhra pradesh",
  "arunachal pradesh",
  "assam",
  "bihar",
  "chhattisgarh",
  "goa",
  "delhi",
  "gujarat",
  "haryana",
  "himachal pradesh",
  "jharkhand",
  "karnataka",
  "kerala",
  "madhya pradesh",
  "maharashtra",
  "manipur",
  "meghalaya",
  "mizoram",
  "nagaland",
  "odisha",
  "punjab",
  "rajasthan",
  "sikkim",
  "tamil nadu",
  "telangana",
  "tripura",
  "uttar pradesh",
  "uttarakhand",
  "west bengal",
];

const userType = ["customer", "manager", "admin"];

// brands
const vehicleBrands = [
  "Vespa",
  "Honda",
  "Yamaha",
  "Suzuki",
  "KTM",
  "BMW",
  "TVS",
  "Bajaj",
  "Hero",
  "Ather",
  "Ola",
  "Mahindra",
  "Royal Enfield",
  "Harley-Davidson",
  "Kawasaki",
  "Ducati",
];

const vehicleColor = ["white", "black", "gray", "blue", "yellow", "dark blue"];

const forms = {
  "vehicle-master": VehicleMasterForm,
  "location-master": LocationMasterForm,
  "station-master": StationMasterForm,
  "all-vehicles": VehicleForm,
  "all-users": UserForm,
  "all-plans": PlanForm,
  "all-bookings": BookingForm,
  "all-managers": UserForm,
  "all-coupons": CouponForm,
};

export {
  endPointBasedOnURL,
  endPointBasedOnKey,
  States,
  userType,
  vehicleBrands,
  forms,
  vehicleColor,
};
