import { camelCaseToSpaceSeparated, formatPrice } from "../../utils/index";

const ExtendSummary = ({
  appliedPlans,
  daysBreakdown,
  item,
  bookingDuration,
}) => {
  const weekend =
    daysBreakdown?.length > 0
      ? daysBreakdown?.filter((day) => day.isWeekend === true)
      : [];

  const weekDays =
    daysBreakdown?.length > 0
      ? daysBreakdown?.filter((day) => day.isWeekend === false)
      : [];

  return (
    <div className="p-2 mb-2 rounded-md bg-theme/10">
      <div className="w-full flex items-center justify-between">
        <div>
          <div>
            <span className="text-sm font-semibold capitalize">
              {camelCaseToSpaceSeparated(item?.title)}
            </span>
            <span className="text-sm font-semibold mx-1">:</span>
            {bookingDuration && (
              <span className="text-sm font-semibold">
                {bookingDuration} Day(s)
              </span>
            )}
          </div>
        </div>
        <div>
          <span className="text-sm font-bold text-theme ml-1">
            ₹
            {formatPrice(
              item?.amount +
                (Number(item?.tax) || 0) +
                (Number(item?.addonTax) || 0)
            )}
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

const RideSummary = ({
  appliedPlans,
  daysBreakdown,
  item,
  mainBookingDuration,
}) => {
  const weekend =
    daysBreakdown?.length > 0
      ? daysBreakdown?.filter((day) => day.isWeekend === true)
      : [];
  const weekDays =
    daysBreakdown?.length > 0
      ? daysBreakdown?.filter((day) => day.isWeekend === false)
      : [];

  return (
    <div className="p-2 mb-2 rounded-md bg-theme/10">
      <div className="w-full flex items-center justify-between">
        <div>
          <div>
            <span className="text-sm font-semibold capitalize">
              Main Booking
            </span>
            <span className="text-sm font-semibold mx-1">:</span>
            <span className="text-sm font-semibold">
              {mainBookingDuration} Day(s)
            </span>
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
              {appliedPlans[0]?.days} Days Package ₹{appliedPlans[0]?.planPrice}{" "}
              {`x ${appliedPlans[0]?.count}`}
            </span>
            <span
              className={`mx-2 ${
                weekend?.length > 0 || weekDays?.length > 0
                  ? "inline"
                  : "hidden"
              }`}
            >
              |
            </span>
          </>
        )}
        {weekend?.length > 0 && (
          <>
            <span>
              Weekend ₹{weekend[0]?.dailyRate} x {weekend?.length}
            </span>
            <span
              className={`mx-2 ${weekDays?.length > 0 ? "inline" : "hidden"}`}
            >
              |
            </span>
          </>
        )}
        {weekDays?.length > 0 && (
          <span>
            Weekday ₹{weekDays[0]?.dailyRate} x {weekDays?.length}
          </span>
        )}
      </div>
    </div>
  );
};

export { ExtendSummary, RideSummary };
