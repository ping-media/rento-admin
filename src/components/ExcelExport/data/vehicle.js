import { formatFullDateAndTime } from "../../../utils";

export function transformVehicles(data) {
  return data.map((item) => {
    const plans = item?.vehiclePlan || [];

    // Create unified plan list including 1 day price
    const unifiedPlans = [
      {
        planDuration: 1,
        planPrice: item?.perDayCost ?? "--",
      },
      ...plans,
    ];

    //  Sort plans by duration to keep order consistent
    const sortedPlans = [...unifiedPlans].sort(
      (a, b) => Number(a.planDuration) - Number(b.planDuration),
    );

    // Build dynamic plan price object
    const planPriceFields = {};

    sortedPlans.forEach((plan) => {
      planPriceFields[`${plan.planDuration} Days Price`] =
        plan.planPrice ?? "--";
    });

    // Final object in strict column order
    return {
      VehicleName: `${item?.vehicleBrand || "--"} ${item?.vehicleName || ""}`,
      VehicleNumber: item?.vehicleNumber || "--",
      StationName: item?.stationName || "--",
      kmsRun: item?.kmsRun || "--",
      LastServiceDate: item?.lastServiceDate || "--",

      // All price fields together
      ...planPriceFields,

      // Always last column
      CreatedAt: item?.createdAt
        ? formatFullDateAndTime(item?.createdAt)
        : "--",
    };
  });
}
