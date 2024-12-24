import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import dayjs from "dayjs";

const PieChart = ({ data, themeColor = "#e23844" }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {},
  });

  useEffect(() => {
    if (!data) return;

    // Group payments by day of the week
    const dailyRevenue = data.reduce((acc, item) => {
      const day = dayjs(item.createdAt).format("ddd"); // Format as Mon, Tue, etc.
      acc[day] = (acc[day] || 0) + (item.bookingPrice?.totalPrice || 0);
      return acc;
    }, {});

    // Prepare data for the chart
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const revenues = days?.map((day) => dailyRevenue[day] || 0); // Ensure all days are present

    // Set chart data
    setChartData({
      series: revenues,
      options: {
        chart: {
          type: "pie",
          height: 350,
        },
        labels: days,
        colors: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          themeColor,
        ],
        legend: {
          position: "bottom",
        },
        tooltip: {
          y: {
            formatter: (val) => `${val} rupees`,
          },
        },
      },
    });
  }, [data, themeColor]);

  return (
    <Chart
      options={chartData.options}
      series={chartData.series}
      type="pie"
      width="100%"
      height="100%"
    />
  );
};

export default PieChart;
