import { tableIcons } from "../../Data/Icons";
import React, { useState } from "react";
import Chart from "react-apexcharts";

const BarChart = ({ data }) => {
  const [viewMode, setViewMode] = useState("Daily"); // Daily, Weekly, Monthly
  const options = ["Daily", "Weekly", "Monthly"];

  // format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Process Data for Weekly and Monthly Views
  const processChartData = (mode) => {
    if (mode === "Weekly") {
      return {
        categories: ["Week 1", "Week 2", "Week 3"], // Example weeks
        totalPrice: [30000, 20000, 15000], // Example total price data
        bookingCount: [10, 15, 12], // Example booking count data
      };
    } else if (mode === "Monthly") {
      return {
        categories: ["December", "January"], // Example months
        totalPrice: [50000, 30000], // Example total price data
        bookingCount: [25, 20], // Example booking count data
      };
    } else {
      return {
        categories: data.map((item) => formatDate(item._id)),
        totalPrice: data.map((item) => item.totalPrice),
        bookingCount: data.map((item) => item.bookingCount),
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
  // const totalPriceOptions = {
  //   chart: {
  //     type: "bar",
  //     toolbar: { show: false },
  //   },
  //   xaxis: {
  //     categories: chartData.categories,
  //     title: {
  //       text: "Dates",
  //       style: { fontSize: "14px", fontWeight: "bold" },
  //     },
  //   },
  //   yaxis: {
  //     title: {
  //       text: "Total Price",
  //       style: { fontSize: "14px", fontWeight: "bold" },
  //     },
  //   },
  //   plotOptions: {
  //     bar: { columnWidth: "50%" },
  //   },
  //   colors: ["#e23844"], // Red color for total price
  //   dataLabels: {
  //     enabled: true,
  //     style: {
  //       fontSize: "12px",
  //       fontWeight: "bold",
  //     },
  //   },
  // };
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
