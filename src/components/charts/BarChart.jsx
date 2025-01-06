// import { useEffect, useState } from "react";
// import Chart from "react-apexcharts";
// import dayjs from "dayjs";

// const BarChart = ({ data, type, themeColor = "#e23844" }) => {
//   const [chartData, setChartData] = useState({
//     series: [],
//     options: {},
//   });
//   const [viewMode, setViewMode] = useState("weekly"); // "weekly" or "monthly"

//   useEffect(() => {
//     if (!data) return;

//     // Helper functions to group data
//     const groupDataByWeek = () => {
//       const dailyRevenue = data.reduce((acc, item) => {
//         const day = dayjs(item.createdAt).format("ddd"); // Format as Mon, Tue, etc.
//         acc[day] = (acc[day] || 0) + (item.bookingPrice?.totalPrice || 0);
//         return acc;
//       }, {});

//       const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
//       const revenues = days.map((day) => dailyRevenue[day] || 0); // Ensure all days are present
//       return { categories: days, revenues };
//     };

//     const groupDataByMonth = () => {
//       const monthlyRevenue = data.reduce((acc, item) => {
//         const month = dayjs(item.createdAt).format("MMM"); // Format as Jan, Feb, etc.
//         acc[month] = (acc[month] || 0) + (item.bookingPrice?.totalPrice || 0);
//         return acc;
//       }, {});

//       const months = [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//       ];
//       const revenues = months.map((month) => monthlyRevenue[month] || 0); // Ensure all months are present
//       return { categories: months, revenues };
//     };

//     // Determine data based on view mode
//     const { categories, revenues } =
//       viewMode === "weekly" ? groupDataByWeek() : groupDataByMonth();

//     // Set chart data
//     setChartData({
//       series: [
//         {
//           name: `${viewMode === "weekly" ? "Daily" : "Monthly"} Revenue`,
//           data: revenues,
//         },
//       ],
//       options: {
//         chart: {
//           type: type,
//           height: 350,
//           toolbar: {
//             show: false,
//           },
//         },
//         plotOptions: {
//           bar: {
//             horizontal: false,
//             columnWidth: "55%",
//             endingShape: "rounded",
//           },
//         },
//         dataLabels: {
//           enabled: false,
//         },
//         colors: [themeColor],
//         stroke: {
//           show: true,
//           width: 2,
//           colors: ["transparent"],
//         },
//         xaxis: {
//           categories,
//           title: {
//             text:
//               viewMode === "weekly" ? "Days of the Week" : "Months of the Year",
//           },
//         },
//         yaxis: {
//           title: {
//             text: "Revenue (in rupees)",
//           },
//         },
//         fill: {
//           opacity: 1,
//         },
//         tooltip: {
//           y: {
//             formatter: (val) => `${val} rupees`,
//           },
//         },
//       },
//     });
//   }, [data, themeColor, viewMode, type]);

//   return (
//     <div>
//       <div className="flex justify-end mb-4">
//         <button
//           className={`px-4 py-1 rounded-sm mr-2 ${
//             viewMode === "weekly"
//               ? "bg-theme text-gray-100"
//               : "bg-gray-200 text-black"
//           }`}
//           onClick={() => setViewMode("weekly")}
//         >
//           Weekly
//         </button>
//         <button
//           className={`px-4 py-1 rounded-sm ${
//             viewMode === "monthly"
//               ? "bg-theme text-gray-100"
//               : "bg-gray-200 text-black"
//           }`}
//           onClick={() => setViewMode("monthly")}
//         >
//           Monthly
//         </button>
//       </div>
//       <Chart
//         options={chartData.options}
//         series={chartData.series}
//         type={type}
//         width="100%"
//         height="100%"
//       />
//     </div>
//   );
// };

// export default BarChart;

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
