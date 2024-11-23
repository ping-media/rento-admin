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
  "manage-bookings": "/getBookings",
  "all-coupons": "/getCoupon",
  "all-coupons/": "/createCoupon",
};

//tofetchData for based on key
const endPointBasedOnKey = {
  stationId: "/getStationData",
  locationId: "/getLocationData",
  userId: "/getAllUsers",
};

// for creating form fields
const generateForm = {
  "vehicle-master": [
    "vehicleName",
    "vehicleType",
    "vehicleBrand",
    "vehicleImage",
  ],
  "location-master": ["locationName", "locationImage"],
  "station-master": [
    "stationId",
    "locationId",
    "userId",
    "stationName",
    "address",
    "city",
    "state",
    "pinCode",
  ],
  "all-vehicles": [
    "vehicleMasterId",
    "stationId",
    "vehicleNumber",
    "freeKms",
    "extraKmsCharges",
    "vehicleModel",
    "vehicleColor",
    "perDayCost",
    "lastServiceDate",
    "kmsRun",
    "isBooked",
    "condition",
    "vehicleBookingStatus",
    "vehicleStatus",
    "vehiclePlan",
  ],
  "all-plans": [
    "vehicleMasterId",
    "planPrice",
    "stationId",
    "planName",
    "planDuration",
  ],
  "all-coupon": ["couponName", "discount", "discountType", "isCouponActive"],
};

export { endPointBasedOnURL, generateForm, endPointBasedOnKey };
