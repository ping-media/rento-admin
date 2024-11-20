import CountUp from "react-countup";

// importing icons
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import PointOfSaleRoundedIcon from "@mui/icons-material/PointOfSaleRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import LeaderboardRoundedIcon from "@mui/icons-material/LeaderboardRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";

const InfoCard = ({ index, totalCounts }) => {
  // const data = [
  //   { title: "Total Users", amount: 50000, icon: <CurrencyRupeeRoundedIcon /> },
  //   {
  //     title: "Spend this month",
  //     amount: 20000,
  //     icon: <CurrencyRupeeRoundedIcon />,
  //   },
  //   { title: "sales", amount: 60000, icon: <PointOfSaleRoundedIcon /> },
  //   {
  //     title: "Your balance",
  //     amount: 100675,
  //     icon: <AccountBalanceRoundedIcon />,
  //   },
  //   {
  //     title: "Leads this month",
  //     amount: 100,
  //     icon: <LeaderboardRoundedIcon />,
  //   },
  //   { title: "All Leads", amount: 250, icon: <LeaderboardRoundedIcon /> },
  //   { title: "Total Vehicle", amount: 110, icon: <DirectionsCarRoundedIcon /> },
  //   {
  //     title: "Vehicle On Rent",
  //     amount: 50,
  //     icon: <DirectionsCarRoundedIcon />,
  //   },
  //   { title: "All Users", amount: 350, icon: <GroupRoundedIcon /> },
  // ];
  return (
    <div className="shadow-md rounded-xl bg-white px-6 py-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="bg-theme p-3 rounded-full text-gray-100">
          <span>{totalCounts[index].icon}</span>
        </div>
        <div>
          <h2 className="text-semibold text-gray-400">{totalCounts[index].title}</h2>
          <h2 className="lg:text-2xl font-bold">
            {index < 4 ? "₹" : ""}
            <CountUp end={totalCounts[index].count} />
          </h2>
          {/* {index % 2 == 0 && (
            <p>
              <span className="text-green-500 text-sm lg:text-md">+23%</span>{" "}
              Since last month
            </p>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
