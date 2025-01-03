import CountUp from "react-countup";
import { Link } from "react-router-dom";

const InfoCard = ({ item }) => {
  return (
    <Link to={item?.link}>
      <div className="shadow-md rounded-xl bg-white px-6 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-theme p-3 rounded-full text-gray-100">
            <span>{item?.icon}</span>
          </div>
          <div>
            <h2 className="text-semibold text-gray-400">{item?.title}</h2>
            <h2 className="lg:text-2xl font-bold">
              {item?.title?.includes("PAYMENTS") ? "₹" : ""}
              <CountUp className="ml-1" end={item?.count} />
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default InfoCard;
