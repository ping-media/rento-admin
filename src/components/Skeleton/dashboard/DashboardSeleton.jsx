import React from "react";
import CardsLoader from "./CardSkeleton";
import ChartLoader from "../ChartSkeleton";

const DashboardSeleton = () => {
  return (
    <div className="space-y-6">
      {/* Page Title Skeleton */}
      <div className="h-6 bg-gray-300 rounded w-40 animate-pulse" />

      {/* Cards */}
      <CardsLoader />

      {/* Chart */}
      <ChartLoader />
    </div>
  );
};

export default DashboardSeleton;
