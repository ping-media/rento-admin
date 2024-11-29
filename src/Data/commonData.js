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
  "all-users/": "/signup",
  "all-bookings": "/getBookings",
  "all-coupons": "/getCoupons",
  "all-coupons/": "/createCoupon",
};

//tofetchData for based on key
const endPointBasedOnKey = {
  stationId: "/getStationData",
  locationId: "/getLocationData",
  userId: "/getAllUsers?userType=manager",
  userIdAll: "/getAllUsers",
  vehicleMasterId: "/getVehicleMasterData",
  vehicleTableId: "/getVehicleTblData",
};

const States = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Delhi",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const userType = ["customer", "manager", "admin"];

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

export {
  endPointBasedOnURL,
  endPointBasedOnKey,
  States,
  userType,
  vehicleBrands,
};
