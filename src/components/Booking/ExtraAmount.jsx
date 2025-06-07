import { camelCaseToSpaceSeparated, formatPrice } from "../../utils/index";

const ExtraAmount = ({ item }) => {
  return (
    <>
      <span className="text-sm text-gray-400 font-semibold capitalize">
        {item?.title?.includes("changed")
          ? "Vehicle Change"
          : camelCaseToSpaceSeparated(item?.title)}
        :
      </span>
      {item?.amount > 0 && (
        <>
          <span className="text-sm text-gray-400 hidden lg:inline">
            ₹
            {item?.extendDuration
              ? formatPrice(
                  (item?.amount - item?.addOnAmount) /
                    Number(item?.extendDuration)
                )
              : "--"}
          </span>
          <span className="text-sm text-gray-400 hidden lg:inline">
            x {item?.extendDuration || "--"} day(s) + ₹
            {item?.addOnAmount ? formatPrice(item?.addOnAmount) : "--"} =
          </span>
        </>
      )}
      <span className="text-sm text-gray-400">
        ₹{formatPrice(item?.amount)}
      </span>
      <span
        className={`text-sm font-bold ${
          item?.status === "paid" ? "text-green-400" : "text-red-400"
        }`}
      >
        ({item?.status})
      </span>
    </>
  );
};

export default ExtraAmount;
