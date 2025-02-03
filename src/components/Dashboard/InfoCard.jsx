import CountUp from "react-countup";
import { Link } from "react-router-dom";

const InfoCard = ({ item }) => {
  return (
    <Link to={item?.link}>
      <div className="shadow-md rounded-xl bg-white px-4 py-4">
        <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3">
          <div className="bg-theme p-2.5 rounded-full text-gray-100">
            <span>{item?.icon}</span>
          </div>
          <div>
            <p className="text-semibold text-gray-400 text-sm">{item?.title}</p>
            <h1 className="lg:text-xl font-bold text-center lg:text-start">
              {item?.title?.includes("PAYMENTS") ? "₹" : ""}
              <CountUp className="ml-1" end={item?.count} />
            </h1>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default InfoCard;
