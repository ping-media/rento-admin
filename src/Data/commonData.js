// for fetching & posting data to backend link
const endPointBasedOnURL = {
  "vehicle-master": "/getVehicleMasterData",
  "vehicle-master/": "/createVehicleMaster",
  "location-master": "/getLocationData",
  "location-master/": "/createLocation",
  "station-master": "/getStationData",
  "station-master/": "/createStation",
  "all-plans": "/getPlanData",
  "all-plans/": "/createPlan",
  "all-vehicles": "/getVehicleTblData",
  "all-users": "/getAllUsers",
  "all-users/": "/signup",
  "manage-bookings": "/getBookings",
  "all-coupons": "/getCoupons",
  "all-coupons/": "/createCoupon",
};

//tofetchData for based on key
const endPointBasedOnKey = {
  stationId: "/getStationData",
  locationId: "/getLocationData",
  userId: "/getAllUsers?userType=manager",
};

const States = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
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

const options = ["yes", "no"];

const activeStatus = ["active", "not-active"];

// for creating form fields
// const generateForm = {
//   "vehicle-master": [
//     "vehicleName",
//     "vehicleType",
//     "vehicleBrand",
//     "vehicleImage",
//   ],
//   "location-master": ["locationName", "locationImage"],
//   "station-master": [
//     "stationId",
//     "locationId",
//     "userId",
//     "stationName",
//     "address",
//     "city",
//     "state",
//     "pinCode",
//   ],
//   "all-vehicles": [
//     "vehicleMasterId",
//     "stationId",
//     "vehicleNumber",
//     "freeKms",
//     "extraKmsCharges",
//     "vehicleModel",
//     "vehicleColor",
//     "perDayCost",
//     "lastServiceDate",
//     "kmsRun",
//     "isBooked",
//     "condition",
//     "vehicleBookingStatus",
//     "vehicleStatus",
//     "vehiclePlan",
//   ],
//   "all-plans": [
//     "vehicleMasterId",
//     "planPrice",
//     "stationId",
//     "planName",
//     "planDuration",
//   ],
//   "all-coupon": ["couponName", "discount", "discountType", "isCouponActive"],
// };

export {
  endPointBasedOnURL,
  endPointBasedOnKey,
  States,
  userType,
  options,
  activeStatus,
};
