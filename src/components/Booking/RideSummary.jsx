import { camelCaseToSpaceSeparated, formatPrice } from "../../utils/index";

const ExtendSummary = ({ appliedPlans, daysBreakdown, item }) => {
  const weekend =
    daysBreakdown?.length > 0
      ? daysBreakdown?.filter((day) => day.isWeekend === true)
      : [];
  const weekDays =
    daysBreakdown?.length > 0
      ? daysBreakdown?.filter((day) => day.isWeekend === false)
      : [];

  return (
    <div className="bg-theme/10 p-1 mb-1 rounded-md">
      <div className="w-full flex items-center justify-between">
        <div>
          <div>
            <span className="text-sm font-semibold capitalize">
              {camelCaseToSpaceSeparated(item?.title)}
            </span>
            <span className="text-sm font-semibold mx-1">:</span>
          </div>
        </div>
        <div>
          <span className="text-sm font-bold text-theme ml-1">
            ₹{formatPrice(item?.amount)}
          </span>
          {item?.status === "unpaid" && (
            <span
              className={`text-sm font-bold ${
                item?.status === "paid" ? "text-green-400" : "text-red-400"
              }`}
            >
              ({item?.status})
            </span>
          )}
        </div>
      </div>
      <div className="text-xs">
        {appliedPlans?.length > 0 && (
          <>
            <span>
              {appliedPlans[0]?.days} Days Package: ₹
              {appliedPlans[0]?.planPrice}{" "}
              {appliedPlans[0]?.count > 1 && `x ${appliedPlans[0]?.count}`}
            </span>
            <span className="mx-2">|</span>
          </>
        )}
        {weekend?.length > 0 && (
          <>
            <span>
              Weekend ₹{weekend[0]?.dailyRate} x {weekend?.length}
            </span>
            <span className="mx-2">|</span>
          </>
        )}
        {weekDays?.length > 0 && (
          <span>
            Week ₹{weekDays[0]?.dailyRate} x {weekDays?.length}
          </span>
        )}
      </div>
    </div>
  );
};

const RideSummary = ({ appliedPlans, daysBreakdown, item }) => {
  const weekend =
    daysBreakdown?.length > 0
      ? daysBreakdown?.filter((day) => day.isWeekend === true)
      : [];
  const weekDays =
    daysBreakdown?.length > 0
      ? daysBreakdown?.filter((day) => day.isWeekend === false)
      : [];

  return (
    <div className="bg-theme/10 p-1 mb-1 rounded-md">
      <div className="w-full flex items-center justify-between">
        <div>
          <div>
            <span className="text-sm font-semibold capitalize">
              Main Booking
            </span>
            <span className="text-sm font-semibold mx-1">:</span>
          </div>
        </div>
        <div>
          <span className="text-sm font-bold text-theme ml-1">
            ₹{formatPrice(item?.totalPrice)}
          </span>
          {item?.status === "unpaid" && (
            <span
              className={`text-sm font-bold ${
                item?.status === "paid" ? "text-green-400" : "text-red-400"
              }`}
            >
              ({item?.status})
            </span>
          )}
        </div>
      </div>
      <div className="text-xs">
        {appliedPlans?.length > 0 && (
          <>
            <span>
              {appliedPlans[0]?.days} Days Package: ₹
              {appliedPlans[0]?.planPrice}{" "}
              {appliedPlans[0]?.count > 1 && `x ${appliedPlans[0]?.count}`}
            </span>
            <span className="mx-2">|</span>
          </>
        )}
        {weekend?.length > 0 && (
          <>
            <span>
              Weekend ₹{weekend[0]?.dailyRate} x {weekend?.length}
            </span>
            <span className="mx-2">|</span>
          </>
        )}
        {weekDays?.length > 0 && (
          <span>
            Week ₹{weekDays[0]?.dailyRate} x {weekDays?.length}
          </span>
        )}
      </div>
    </div>
  );
};

export { ExtendSummary, RideSummary };
