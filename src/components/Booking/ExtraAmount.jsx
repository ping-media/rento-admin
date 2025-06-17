import Tooltip from "../../components/Tooltip/Tooltip";
import { camelCaseToSpaceSeparated, formatPrice } from "../../utils/index";
import { renderTooltipBreakdown } from "../../utils/Helper/Helper";

const ExtraAmount = ({ item }) => {
  return (
    <div className="flex items-center mb-1">
      <span className="text-sm text-gray-400 font-semibold capitalize">
        {item?.title?.includes("changed")
          ? "Vehicle Change"
          : camelCaseToSpaceSeparated(item?.title)}
      </span>
      {item?.amount > 0 && !item?.title?.includes("changed") && (
        <span className="inline-flex items-center ml-1">
          <Tooltip
            underLine={false}
            buttonMessage="(?)"
            tooltipData={renderTooltipBreakdown(
              item?.appliedPlans,
              item?.daysBreakdown
            )}
            className="text-gray-400"
          />
        </span>
      )}
      <span className="text-sm text-gray-400 font-semibold mx-1">:</span>
      <span className="text-sm text-gray-400 ml-1">
        ₹{formatPrice(item?.amount)}
      </span>
      <span
        className={`text-sm font-bold ${
          item?.status === "paid" ? "text-green-400" : "text-red-400"
        }`}
      >
        ({item?.status})
      </span>
    </div>
  );
};

export default ExtraAmount;
