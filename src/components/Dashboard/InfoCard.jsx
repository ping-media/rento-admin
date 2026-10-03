import CountUp from "react-countup";
import { Link } from "react-router-dom";
import { camelCaseToSpaceSeparated } from "../../utils/index";

const InfoCard = ({ item }) => {
  const count = Number(item?.count) || 0;
  const isRevenue = item?.title?.includes("REVENUE");
  const hasData = count > 0;

  const emptyText = isRevenue
    ? "No revenue yet"
    : `No ${camelCaseToSpaceSeparated(item?.title || "records").toLowerCase()} yet`;

  return (
    <Link to={item?.link}>
      <div className="shadow-md rounded-xl bg-white px-4 py-4">
        <div className="block md:flex flex-wrap justify-center lg:justify-start items-center gap-3">
          <div className="bg-theme w-14 h-14 flex items-center justify-center mx-auto rounded-full text-gray-100 mb-2">
            <span>{item?.icon}</span>
          </div>
          <div className="flex-1">
            <p
              className="text-semibold text-gray-400 text-sm text-center uppercase truncate max-w-[140px] lg:w-full lg:text-start"
              title={camelCaseToSpaceSeparated(item?.title)}
            >
              {camelCaseToSpaceSeparated(item?.title)}
            </p>
            {hasData ? (
              <h2 className="lg:text-xl font-bold text-center lg:text-start">
                <CountUp
                  end={count}
                  prefix={isRevenue ? "₹" : ""}
                  separator=","
                />
              </h2>
            ) : (
              <p
                className="text-sm font-medium text-gray-800 text-center lg:text-start truncate max-w-[140px]"
                title={emptyText}
              >
                {emptyText}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default InfoCard;
