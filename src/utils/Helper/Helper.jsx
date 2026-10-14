export const renderTooltipBreakdown = (appliedPlans, daysBreakDown) => {
  const weekend =
    daysBreakDown?.length > 0
      ? daysBreakDown.filter((day) => day.isWeekend === true)
      : [];
  const weekDays =
    daysBreakDown?.length > 0
      ? daysBreakDown.filter((day) => day.isWeekend === false)
      : [];

  return (
    <ul>
      {appliedPlans?.length > 0 && (
        <li>
          <span className="font-semibold mr-1">
            {appliedPlans[0]?.days} Days Package:
          </span>
          ₹{appliedPlans[0]?.planPrice}{" "}
          {appliedPlans[0]?.count > 1 && `x ${appliedPlans[0]?.count}`}
        </li>
      )}
      {weekend?.length > 0 && (
        <li>
          <span className="font-semibold mr-1">Weekend:</span>₹
          {weekend[0]?.dailyRate} x {weekend?.length}
        </li>
      )}
      {weekDays?.length > 0 && (
        <li>
          <span className="font-semibold mr-1">Week:</span>₹
          {weekDays[0]?.dailyRate} x {weekDays?.length}
        </li>
      )}
    </ul>
  );
};
