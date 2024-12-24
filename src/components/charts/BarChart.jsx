import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import dayjs from "dayjs";

const BarChart = ({ data, type, themeColor = "#e23844" }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {},
  });
  const [viewMode, setViewMode] = useState("weekly"); // "weekly" or "monthly"

  useEffect(() => {
    if (!data) return;

    // Helper functions to group data
    const groupDataByWeek = () => {
      const dailyRevenue = data.reduce((acc, item) => {
        const day = dayjs(item.createdAt).format("ddd"); // Format as Mon, Tue, etc.
        acc[day] = (acc[day] || 0) + (item.bookingPrice?.totalPrice || 0);
        return acc;
      }, {});

      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const revenues = days.map((day) => dailyRevenue[day] || 0); // Ensure all days are present
      return { categories: days, revenues };
    };

    const groupDataByMonth = () => {
      const monthlyRevenue = data.reduce((acc, item) => {
        const month = dayjs(item.createdAt).format("MMM"); // Format as Jan, Feb, etc.
        acc[month] = (acc[month] || 0) + (item.bookingPrice?.totalPrice || 0);
        return acc;
      }, {});

      const months = [
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
      ];
      const revenues = months.map((month) => monthlyRevenue[month] || 0); // Ensure all months are present
      return { categories: months, revenues };
    };

    // Determine data based on view mode
    const { categories, revenues } =
      viewMode === "weekly" ? groupDataByWeek() : groupDataByMonth();

    // Set chart data
    setChartData({
      series: [
        {
          name: `${viewMode === "weekly" ? "Daily" : "Monthly"} Revenue`,
          data: revenues,
        },
      ],
      options: {
        chart: {
          type: type,
          height: 350,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },
        colors: [themeColor],
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        xaxis: {
          categories,
          title: {
            text:
              viewMode === "weekly" ? "Days of the Week" : "Months of the Year",
          },
        },
        yaxis: {
          title: {
            text: "Revenue (in rupees)",
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: (val) => `${val} rupees`,
          },
        },
      },
    });
  }, [data, themeColor, viewMode, type]);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          className={`px-4 py-1 rounded-sm mr-2 ${
            viewMode === "weekly"
              ? "bg-theme text-gray-100"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => setViewMode("weekly")}
        >
          Weekly
        </button>
        <button
          className={`px-4 py-1 rounded-sm ${
            viewMode === "monthly"
              ? "bg-theme text-gray-100"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => setViewMode("monthly")}
        >
          Monthly
        </button>
      </div>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type={type}
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default BarChart;
