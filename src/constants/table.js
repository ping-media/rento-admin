export const EXCLUDED_KEYS = new Set([
  "_id",
  "vehicleMasterId",
  "vehicleTableId",
  "stationMasterUserId",
  "vehiclePlan",
  "pinCode",
  "vehicleBrand",
  "vehicleBasic",
  "stationId",
  "createdAt",
  "updatedAt",
  "latitude",
  "bookedFrom",
  "imageFileName",
  "__v",
  "locationId",
  "freeKms",
  "extraKmsCharges",
  "vehicleModel",
  "vehicleBookingStatus",
  "refundableDeposit",
  "lateFee",
  "speedLimit",
  "kmsRun",
  "condition",
  "lastServiceDate",
  "country",
  "altContact",
  "dateofbirth",
  "gender",
  "addressProof",
  "address",
  "drivingLicence",
  "paymentUpdates",
  "lastMeterReading",
  "mapLink",
  "mobileToken",
  "weekendPriceIncrease",
  "weekendPercentage",
  "isGstActive",
  "gstPercentage",
  "extraAddOn",
  "transactionType",
  "payments",
  "deletedAt",
  "deletionReason",
  "isDeleted",
  "addresses",
  "radiusKm",
  "longitude",
  "lastLocation",
  "idProof",
  "priority",
  "weekendPriceType",
  "isUnderMaintenance",
  "mobileTokens",
  "vehicleAssigned",
  "weekendCost",
]);

export const ALL_BOOKINGS_EXCLUDED_KEYS = new Set([
  "paySuccessId",
  "vehicleImage",
  "vehicleBrand",
  "paymentgatewayOrderId",
  "paymentgatewayReceiptId",
  "paymentInitiatedDate",
  "discountCuopon",
  "paymentMethod",
  "payInitFrom",
  "notes",
  "extendBooking",
  "changeVehicle",
  "paymentStatus",
]);

export const ALL_VEHICLES_EXCLUDED_KEYS = new Set([
  "vehicleImage",
  "perDayCost",
  "vehicleStatus",
]);

export const PAYMENTS_EXCLUDED_KEYS = new Set(["userId", "paymentMethod"]);

export const INVOICES_EXCLUDED_KEYS = new Set([
  "userId",
  "email",
  "paidInvoice",
]);

export const SKIP_COLUMNS = new Set([
  "state",
  "isContactVerified",
  "isDocumentVerified",
  "kycApproved",
  "openEndTime",
]);

export const USER_PAGES = new Set([
  "/all-invoices",
  "/all-users",
  "/all-managers",
]);

export const SELF_CONTAINED = new Set(["couponName", "openStartTime"]);

export const ROUTE_EXCLUSIONS = {
  "/all-bookings": ALL_BOOKINGS_EXCLUDED_KEYS,
  "/all-vehicles": ALL_VEHICLES_EXCLUDED_KEYS,
  "/payments": PAYMENTS_EXCLUDED_KEYS,
  "/all-invoices": new Set([
    ...PAYMENTS_EXCLUDED_KEYS,
    ...INVOICES_EXCLUDED_KEYS,
  ]),
};
