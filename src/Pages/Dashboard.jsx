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
import PieChart from "../components/charts/PieChart";

const Dashboard = () => {
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
      let dataCount = Object.keys(dasboardDataCount?.dashboard).map((key) => {
        return {
          count: dasboardDataCount?.dashboard[key],
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

  // console.log(dasboardDataCount);

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
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="flex-1 shadow-lg p-5 rounded-2xl bg-white">
            <h2 className="text-xl mb-3 font-semibold">Payments</h2>
            <BarChart
              data={dasboardDataCount && dasboardDataCount?.payments}
              type={"bar"}
            />
          </div>
          <div className="flex-1 shadow-lg p-5 rounded-2xl bg-white">
            <h2 className="text-xl mb-3 font-semibold">Payments</h2>
            <BarChart
              data={dasboardDataCount && dasboardDataCount?.payments}
              type={"bar"}
            />
          </div>
        </div>
      </>
    ) : (
      <NotFound />
    )
  ) : (
    <PreLoader />
  );
};

export default Dashboard;
