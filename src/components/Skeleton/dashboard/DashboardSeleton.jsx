import React from "react";
import CardsLoader from "./CardSkeleton";
import TransactionListLoader from "./TransactionListSkeleton";
import ChartLoader from "../ChartSkeleton";

const DashboardSeleton = () => {
  return (
    <div className="space-y-6">
      {/* Page Title Skeleton */}
      <div className="h-6 bg-gray-300 rounded w-40 animate-pulse" />

      {/* Cards */}
      <CardsLoader />

      {/* Transactions + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-5">
        <div className="order-2 lg:order-1 min-w-0">
          <TransactionListLoader />
        </div>
        <div className="order-1 lg:order-2 min-w-0">
          <ChartLoader />
        </div>
      </div>
    </div>
  );
};

export default DashboardSeleton;
