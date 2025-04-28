import { tableIcons } from "../../Data/Icons";
import React, { useState } from "react";
import Chart from "react-apexcharts";

const BarChart = ({ data }) => {
  const [viewMode, setViewMode] = useState("Daily");
  const options = ["Daily", "Weekly", "Monthly"];

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  // Group data by week/month for different view modes
  const processChartData = (mode) => {
    // For Daily view, use the original data
    if (mode === "Daily") {
      return {
        categories: data.map((item) => formatDate(item._id)),
        totalPrice: data.map((item) => item.totalPrice),
        bookingCount: data.map((item) => item.bookingCount),
      };
    } else if (mode === "Weekly") {
      const weeklyData = {
        categories: ["Week 1"],
        totalPrice: [data.reduce((sum, item) => sum + item.totalPrice, 0)],
        bookingCount: [data.reduce((sum, item) => sum + item.bookingCount, 0)],
      };
      return weeklyData;
    } else if (mode === "Monthly") {
      const monthlyMap = {};

      data.forEach((item) => {
        const date = new Date(item._id);
        const monthYear = date.toLocaleDateString("en-GB", {
          month: "short",
          year: "numeric",
        });

        if (!monthlyMap[monthYear]) {
          monthlyMap[monthYear] = {
            totalPrice: 0,
            bookingCount: 0,
          };
        }

        monthlyMap[monthYear].totalPrice += item.totalPrice;
        monthlyMap[monthYear].bookingCount += item.bookingCount;
      });

      // Convert the map to arrays for the chart
      const months = Object.keys(monthlyMap);
      const totalPrices = months.map((month) => monthlyMap[month].totalPrice);
      const bookingCounts = months.map(
        (month) => monthlyMap[month].bookingCount
      );

      return {
        categories: months,
        totalPrice: totalPrices,
        bookingCount: bookingCounts,
      };
    }
  };

  const chartData = processChartData(viewMode);

  // Options for Booking Count Chart
  const bookingCountOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    xaxis: {
      categories: chartData.categories,
      title: {
        text: "Dates",
        style: { fontSize: "14px", fontWeight: "bold" },
      },
    },
    yaxis: {
      title: {
        text: "Booking Count",
        style: { fontSize: "14px", fontWeight: "bold" },
      },
    },
    plotOptions: {
      bar: { columnWidth: "50%" },
    },
    colors: ["#c32d3b"],
    dataLabels: {
      enabled: false,
    },
  };

  // Options for Total Price Chart
  const totalPriceOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    xaxis: {
      categories: chartData.categories,
      title: {
        text: "Dates",
        style: { fontSize: "14px", fontWeight: "bold" },
      },
    },
    yaxis: {
      title: {
        text: "Total Price",
        style: { fontSize: "14px", fontWeight: "bold" },
      },
    },
    plotOptions: {
      bar: { columnWidth: "50%" },
    },
    colors: ["#e23844"],
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      shared: false,
      y: {
        formatter: (val) => `₹${val.toLocaleString()}`,
      },
      style: {
        fontSize: "14px",
      },
    },
  };

  return (
    <div className="w-full">
      {/* View Mode Buttons */}
      <div className="mb-5 flex items-center justify-end gap-2">
        {options?.map((mode, index) => (
          <button
            className={`flex items-center gap-2 border-2 border-theme hover:bg-theme hover:text-gray-100 transition-all duration-200 ease-in-out hover:border-theme p-1 rounded-md ${
              viewMode === mode
                ? "bg-theme text-gray-100 border-theme"
                : "text-theme"
            }`}
            onClick={() => setViewMode(mode)}
            key={index}
          >
            {tableIcons?.dateCalender} {mode}
          </button>
        ))}
      </div>

      <div className="flex items-center flex-wrap gap-1 lg:gap-2 w-full">
        {/* Booking Count Chart */}
        <div className="flex-1">
          <h2 className="text-base font-bold mb-3">{`Booking Count (${viewMode})`}</h2>
          <Chart
            options={bookingCountOptions}
            series={[{ name: "Booking Count", data: chartData.bookingCount }]}
            type="bar"
            height={300}
          />
        </div>

        {/* Total Price Chart */}
        <div className="flex-1">
          <h2 className="text-base font-bold mb-3">{`Total Price (${viewMode})`}</h2>
          <Chart
            options={totalPriceOptions}
            series={[{ name: "Total Price", data: chartData.totalPrice }]}
            type="bar"
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default BarChart;
