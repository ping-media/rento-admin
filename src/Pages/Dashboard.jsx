import { useEffect, useState } from "react";
import BarChart from "../components/charts/BarChart";
import InfoCard from "../components/Dashboard/InfoCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../Data/Function";
import PreLoader from "../components/Skeleton/PreLoader";
import {
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
import { useMediaQuery } from "@mui/material";
import NotFound from "./NotFound";
import { useNavigate } from "react-router-dom";
import { monthNames } from "../Data/commonData";

const Dashboard = () => {
  const { dasboardDataCount, loading } = useSelector(
    (state) => state.dashboard
  );
  const { token, loggedInRole, userStation } = useSelector(
    (state) => state.user
  );
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dataCountResult, setDataCountResult] = useState([]);
  const [dataCountLoading, setDataCountLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //fetching dashboard data
  useEffect(() => {
    if (currentMonth === "") return;
    // for manager role
    const roleBaseFilter =
      loggedInRole === "manager" ? `?stationId=${userStation?.stationId}` : "";
    if (token) {
      fetchDashboardData(
        dispatch,
        token,
        roleBaseFilter,
        navigate,
        currentMonth,
        dasboardDataCount
      );
    }
  }, [token, loggedInRole, currentMonth]);

  // turning loading to false after all data is fetched
  useEffect(() => {
    if (!loading && !dataCountLoading) {
      setDashboardLoading(false);
    }
  }, [loading, dataCountLoading]);

  useEffect(() => {
    if (currentMonth === "") {
      const currentMonth = monthNames[new Date()?.getMonth()];
      const currentYear = new Date()?.getFullYear();
      const currentMonthAndYear = `${currentMonth} ${currentYear}`;
      setCurrentMonth(currentMonthAndYear);
    }
  }, []);

  //binding fetched data
  useEffect(() => {
    if (dasboardDataCount) {
      try {
        setDataCountLoading(true);
        let dataCount = Object.keys(dasboardDataCount?.dashboard).map((key) => {
          return {
            count: dasboardDataCount?.dashboard[key],
            title:
              "TOTAL " +
              (key !== "Amount"
                ? key.substring(0, key.length - 5).toUpperCase()
                : "PAYMENTS"),
            link:
              key !== "Amount"
                ? key === "locationCount" || key === "stationsCount"
                  ? key === "stationsCount"
                    ? "/" + key.substring(0, key.length - 6) + "-master"
                    : "/" + key.substring(0, key.length - 5) + "-master"
                  : "/all-" + key.substring(0, key.length - 5)
                : "/payments",
            icon:
              key == "usersCount" ? (
                <PersonRounded fontSize={isMobile ? "medium" : "large"} />
              ) : key == "bookingsCount" ? (
                <BookOnlineRounded fontSize={isMobile ? "medium" : "large"} />
              ) : key == "vehiclesCount" ? (
                <DirectionsCarRounded
                  fontSize={isMobile ? "medium" : "large"}
                />
              ) : key == "locationCount" ? (
                <LocationOnRounded fontSize={isMobile ? "medium" : "large"} />
              ) : key == "stationsCount" ? (
                <DockRounded fontSize={isMobile ? "medium" : "large"} />
              ) : key == "couponsCount" ? (
                <DiscountRounded fontSize={isMobile ? "medium" : "large"} />
              ) : key == "invoicesCount" ? (
                <ReceiptRounded fontSize={isMobile ? "medium" : "large"} />
              ) : key == "plansCount" ? (
                <ArticleRounded fontSize={isMobile ? "medium" : "large"} />
              ) : key == "ordersCount" ? (
                <BookmarkBorderRounded
                  fontSize={isMobile ? "medium" : "large"}
                />
              ) : (
                <GroupRounded fontSize={isMobile ? "medium" : "large"} />
              ),
          };
        });
        setDataCountResult(dataCount);
      } finally {
        setDataCountLoading(false);
      }
    }
  }, [dasboardDataCount]);

  if (dashboardLoading) {
    return <PreLoader />;
  }

  return !loading && !dashboardLoading ? (
    dataCountResult && dataCountResult?.length > 0 ? (
      <>
        <h1 className="text-xl uppercase font-bold text-theme mb-5">
          Dashboard
        </h1>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-5">
          {dataCountResult?.map((item, index) => (
            <InfoCard key={index} item={item} />
          ))}
        </div>
        <h2 className="text-xl mb-5 font-bold uppercase text-theme">
          Booking &amp; Payments
        </h2>
        <div className="shadow-lg p-3 lg:p-5 rounded-2xl bg-white">
          <BarChart
            data={dasboardDataCount && dasboardDataCount?.payments}
            month={currentMonth}
            setMonth={setCurrentMonth}
          />
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
