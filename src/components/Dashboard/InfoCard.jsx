import CountUp from "react-countup";
import { Link } from "react-router-dom";
import { camelCaseToSpaceSeparated } from "../../utils/index";

const InfoCard = ({ item }) => {
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
            <h1 className="lg:text-xl font-bold text-center lg:text-start">
              {item?.title?.includes("REVENUE") ? "₹" : ""}
              <CountUp className="ml-1" end={item?.count} />
            </h1>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default InfoCard;
