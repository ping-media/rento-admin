import React, { useState } from "react";
import Chart from "react-apexcharts";

const BarChart = ({ data }) => {
  const [viewMode, setViewMode] = useState("Daily"); // Daily, Weekly, Monthly

  // Process Data for Weekly and Monthly Views
  const processChartData = (mode) => {
    if (mode === "Weekly") {
      // Aggregate data weekly
      return {
        categories: ["Week 1", "Week 2", "Week 3"], // Example weeks
        series: [
          {
            name: "Total Price",
            data: [30000, 20000, 15000], // Example data
          },
          {
            name: "Booking Count",
            data: [10, 15, 12], // Example data
          },
        ],
      };
    } else if (mode === "Monthly") {
      // Aggregate data monthly
      return {
        categories: ["December", "January"], // Example months
        series: [
          {
            name: "Total Price",
            data: [50000, 30000], // Example data
          },
          {
            name: "Booking Count",
            data: [25, 20], // Example data
          },
        ],
      };
    } else {
      // Default: Daily View
      return {
        categories: data.map((item) => item._id),
        series: [
          {
            name: "Total Price",
            data: data.map((item) => item.totalPrice),
          },
          {
            name: "Booking Count",
            data: data.map((item) => item.bookingCount),
          },
        ],
      };
    }
  };

  const chartData = processChartData(viewMode);

  const options = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: chartData.categories,
      title: {
        text: "Dates",
        style: {
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
    },
    yaxis: [
      {
        title: {
          text: "Total Price",
          style: {
            fontSize: "14px",
            fontWeight: "bold",
          },
        },
      },
      {
        opposite: true,
        title: {
          text: "Booking Count",
          style: {
            fontSize: "14px",
            fontWeight: "bold",
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        dataLabels: {
          position: "center", // Place labels inside bars
        },
      },
    },
    colors: ["#e23844", "#851e25"], // Custom bar colors
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#fff"], // White text inside bars
        fontSize: "12px",
        fontWeight: "bold",
      },
      formatter: (val) => val.toLocaleString(), // Format numbers
      textAnchor: "middle",
      dropShadow: {
        enabled: true,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      style: {
        fontSize: "14px",
      },
    },
    legend: {
      position: "top",
      fontSize: "14px",
    },
  };

  return (
    <div>
      <div className="mb-5 flex items-center gap-2">
        <button
          className={`border-2 hover:bg-theme hover:text-gray-100 transition-all duration-200 ease-in-out hover:border-theme p-1 rounded-lg ${
            viewMode === "Daily" && "bg-theme text-gray-100 border-theme"
          }`}
          onClick={() => setViewMode("Daily")}
        >
          Daily
        </button>
        <button
          className={`border-2 hover:bg-theme hover:text-gray-100 transition-all duration-200 ease-in-out hover:border-theme p-1 rounded-lg ${
            viewMode === "Weekly" && "bg-theme text-gray-100 border-theme"
          }`}
          onClick={() => setViewMode("Weekly")}
        >
          Weekly
        </button>
        <button
          className={`border-2 hover:bg-theme hover:text-gray-100 transition-all duration-200 ease-in-out hover:border-theme p-1 rounded-lg ${
            viewMode === "Monthly" && "bg-theme text-gray-100 border-theme"
          }`}
          onClick={() => setViewMode("Monthly")}
        >
          Monthly
        </button>
      </div>
      <Chart
        options={options}
        series={chartData.series}
        type="bar"
        height={400}
      />
    </div>
  );
};

export default BarChart;
