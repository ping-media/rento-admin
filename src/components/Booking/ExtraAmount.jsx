import { camelCaseToSpaceSeparated, formatPrice } from "../../utils/index";

const ExtraAmount = ({ item }) => {
  return (
    <>
      <span className="text-sm text-gray-400 font-semibold capitalize">
        {camelCaseToSpaceSeparated(item?.title)}:
      </span>
      <span className="text-sm text-gray-400">
        ₹{formatPrice(item?.amount)}
      </span>
      <span className="text-sm text-gray-400 semibold">({item?.status})</span>
    </>
  );
};

export default ExtraAmount;
