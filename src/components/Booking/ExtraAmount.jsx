import Tooltip from "../../components/Tooltip/Tooltip";
import { camelCaseToSpaceSeparated, formatPrice } from "../../utils/index";
import { renderTooltipBreakdown } from "../../utils/Helper/Helper";

const ExtraAmount = ({ item }) => {
  return (
    <div className="w-full flex items-center justify-between mb-1">
      <div>
        <span className="text-sm  font-semibold capitalize">
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
            />
          </span>
        )}
        {item.refundAmount > 0 && (
          <small className="ml-1">(Refund Amount)</small>
        )}
        <span className="text-sm  font-semibold mx-1">:</span>
      </div>
      <div>
        {item?.refundAmount > 0 ? (
          <span className="text-sm ml-1 text-red-500 font-semibold">
            ₹{formatPrice(item.refundAmount)}
          </span>
        ) : (
          <span className="text-sm  ml-1">₹{formatPrice(item?.amount)}</span>
        )}
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
  );
};

export default ExtraAmount;
