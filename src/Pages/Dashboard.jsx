import { useEffect, useMemo, useState } from "react";
import BarChart from "../components/charts/BarChart";
import InfoCard from "../components/Dashboard/InfoCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../Data/Function";
import PreLoader from "../components/Skeleton/PreLoader";
import {
  BookOnlineRounded,
  AccountBalanceRounded,
  AccountTreeRounded,
  Cancel,
  CurrencyRupee,
} from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import NotFound from "./NotFound";
import { useNavigate } from "react-router-dom";
import { monthNames } from "../Data/commonData";
import CustomMonthDropdown from "../components/DropDown/CustomDropDown";
import { tableIcons } from "../Data/Icons";

const Dashboard = () => {
  const now = new Date();
  const defaultMonth = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

  const { dasboardDataCount, loading } = useSelector(
    (state) => state.dashboard,
  );
  const { token, loggedInRole, userStation } = useSelector(
    (state) => state.user,
  );
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [currentMonth, setCurrentMonth] = useState(defaultMonth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //fetching dashboard data
  useEffect(() => {
    if (!token || currentMonth === "") return;
    // for manager role
    const roleBaseFilter =
      loggedInRole === "manager" ? `?stationId=${userStation?.stationId}` : "";

    fetchDashboardData(
      dispatch,
      token,
      roleBaseFilter,
      navigate,
      currentMonth,
      dasboardDataCount,
    );
  }, [token, loggedInRole, currentMonth]);

  const dataCountResult = useMemo(() => {
    if (!dasboardDataCount?.dashboard) return [];

    return Object.keys(dasboardDataCount.dashboard).map((key) => ({
      count: dasboardDataCount.dashboard[key],
      title:
        key !== "Amount"
          ? key === "bookingsCount"
            ? "TOTAL BOOKINGS"
            : key.replace(/Count$/, "")
          : "TOTAL REVENUE",
      icon:
        key === "bookingsCount" ? (
          <BookOnlineRounded fontSize={isMobile ? "medium" : "large"} />
        ) : key === "Amount" ? (
          <AccountBalanceRounded fontSize={isMobile ? "medium" : "large"} />
        ) : key === "extendBookingCount" ? (
          <AccountTreeRounded fontSize={isMobile ? "medium" : "large"} />
        ) : key === "cancelBookingsCount" ? (
          <Cancel fontSize={isMobile ? "medium" : "large"} />
        ) : key === "CashPaymentReceivedCount" ? (
          <CurrencyRupee fontSize={isMobile ? "medium" : "large"} />
        ) : (
          <BookOnlineRounded fontSize={isMobile ? "medium" : "large"} />
        ),
    }));
  }, [dasboardDataCount, isMobile]);

  const barChartData = useMemo(
    () => dasboardDataCount?.payments,
    [dasboardDataCount],
  );

  if (!token || loading || !dasboardDataCount?.dashboard) {
    return <PreLoader />;
  }

  if (!dataCountResult?.length) return <NotFound />;

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <h1 className="text-2xl captialize font-bold text-theme mb-5">
          Dashboard
        </h1>
        <CustomMonthDropdown
          tableIcons={tableIcons}
          value={currentMonth}
          setValue={setCurrentMonth}
        />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-5">
        {dataCountResult?.map((item, index) => (
          <InfoCard key={index} item={item} />
        ))}
      </div>
      <div className="shadow-lg p-3 lg:p-5 rounded-2xl bg-white">
        <BarChart data={barChartData} />
      </div>
    </>
  );
};

export default Dashboard;
