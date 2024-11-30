import { useEffect, useState } from "react";
import BarChart from "../components/charts/BarChart";
import InfoCard from "../components/Dashboard/InfoCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../Data/Function";
import PreLoader from "../components/Skeleton/PreLoader";
import {
  CurrencyRupeeRounded,
  DirectionsCarRounded,
  GroupRounded,
  PersonRounded,
  BookOnlineRounded,
  LocationOnRounded,
  DockRounded,
  DiscountRounded,
  ReceiptRounded,
  BookmarkBorderRounded,
  ArticleRounded,
} from "@mui/icons-material";
import NotFound from "./NotFound";

const Dashboard = () => {
  // year chart
  const yearChartOptions = {
    chart: {
      id: "year-chart",
    },
    colors: ["#e23844"],
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
  };

  const yearChartSeries = [
    {
      name: "yearSales",
      data: [30, 40, 45, 50, 49, 60, 70, 90, 20, 55, 35, 55],
    },
  ];
  // weekly chart
  const weekChartOptions = {
    chart: {
      id: "week-chart",
    },
    colors: ["#e23844"],
    xaxis: {
      categories: ["Sun", "Mon", "Tuse", "Wed", "Thus", "Fri", "Sat"],
    },
  };
  const weekChartSeries = [
    {
      name: "weekSales",
      data: [30, 40, 45, 50, 49, 60, 70],
    },
  ];

  const { dasboardDataCount, loading } = useSelector(
    (state) => state.dashboard
  );
  const { token } = useSelector((state) => state.user);
  const [dataCountResult, setDataCountResult] = useState([]);
  const dispatch = useDispatch();

  //fetching dashboard data
  useEffect(() => {
    if (token) {
      fetchDashboardData(dispatch, token);
    }
  }, []);

  //binding fetched data
  useEffect(() => {
    if (dasboardDataCount) {
      let dataCount = Object.keys(dasboardDataCount).map((key) => {
        return {
          count: dasboardDataCount[key],
          title: "TOTAL " + key.substring(0, key.length - 5).toUpperCase(),
          link: "/all-" + key.substring(0, key.length - 5),
          icon:
            key == "usersCount" ? (
              <PersonRounded fontSize="large" />
            ) : key == "bookingsCount" ? (
              <BookOnlineRounded fontSize="large" />
            ) : key == "vehiclesCount" ? (
              <DirectionsCarRounded fontSize="large" />
            ) : key == "locationCount" ? (
              <LocationOnRounded fontSize="large" />
            ) : key == "stationsCount" ? (
              <DockRounded fontSize="large" />
            ) : key == "couponsCount" ? (
              <DiscountRounded fontSize="large" />
            ) : key == "invoicesCount" ? (
              <ReceiptRounded fontSize="large" />
            ) : key == "plansCount" ? (
              <ArticleRounded fontSize="large" />
            ) : key == "ordersCount" ? (
              <BookmarkBorderRounded fontSize="large" />
            ) : (
              <GroupRounded fontSize="large" />
            ),
        };
      });
      setDataCountResult(dataCount);
    }
  }, [dasboardDataCount]);

  return !loading ? (
    dataCountResult?.length > 0 ? (
      <>
        <h1 className="text-2xl uppercase font-bold text-theme mb-5">
          Dashboard
        </h1>
        <div className="grid gird-cols-2 lg:grid-cols-3 gap-5 mb-5">
          {dataCountResult?.map((item, index) => (
            <InfoCard key={index} item={item} />
          ))}
        </div>
        {/* <div className="flex items-center justify-between flex-wrap gap-6">
        <div className="flex-1 shadow-lg p-5 rounded-2xl bg-white">
          <h2 className="text-xl mb-3 font-semibold">Weekly Revenue</h2>
          <BarChart
            chartOptions={weekChartOptions}
            chartSeries={weekChartSeries}
            type={"bar"}
          />
        </div>
        <div className="flex-1 shadow-lg p-5 rounded-2xl bg-white">
          <h2 className="text-xl mb-3 font-semibold">Yearly Revenue</h2>
          <BarChart
            chartOptions={yearChartOptions}
            chartSeries={yearChartSeries}
            type={"line"}
          />
        </div>
      </div> */}
      </>
    ) : (
      <NotFound />
    )
  ) : (
    <PreLoader />
  );
};

export default Dashboard;
