import { tableIcons } from "../../Data/Icons";
import React, { useState } from "react";
import Chart from "react-apexcharts";
import { formatPrice } from "../../utils/index";
import CustomMonthDropdown from "../../components/DropDown/CustomDropDown";

const BarChart = ({ data, month, setMonth }) => {
  const [viewMode, setViewMode] = useState("Daily");
  // const options = ["Daily", "Weekly", "Monthly"];
  const options = ["Daily", "Weekly"];

  const processDataForView = (data) => {
    if (!data || data.length === 0) return [];

    const sortedData = [...data].sort(
      (a, b) => new Date(a._id) - new Date(b._id)
    );

    if (viewMode === "Daily") {
      return sortedData;
    }

    const firstDate = new Date(sortedData[0]._id);
    const lastDate = new Date(sortedData[sortedData.length - 1]._id);

    const dataMap = {};
    sortedData.forEach((item) => {
      dataMap[item._id] = item;
    });

    const filledData = [];
    const currentDate = new Date(firstDate);

    while (currentDate <= lastDate) {
      const dateString = currentDate.toISOString().split("T")[0];

      if (dataMap[dateString]) {
        filledData.push(dataMap[dateString]);
      } else {
        filledData.push({
          _id: dateString,
          totalPrice: 0,
          bookingCount: 0,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return filledData;
  };

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  // Group data by week
  const groupByWeek = (data) => {
    const weeks = {};

    data.forEach((item) => {
      const date = new Date(item._id);
      // Get the week number within the month
      const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const dayOffset = firstDayOfMonth.getDay();
      const dayOfMonth = date.getDate();
      const weekNumber = Math.ceil((dayOfMonth + dayOffset) / 7);

      const weekKey = `Week ${weekNumber}`;

      if (!weeks[weekKey]) {
        weeks[weekKey] = {
          totalPrice: 0,
          bookingCount: 0,
        };
      }

      weeks[weekKey].totalPrice += item.totalPrice;
      weeks[weekKey].bookingCount += item.bookingCount;
    });

    // Convert to arrays
    return {
      categories: Object.keys(weeks),
      totalPrice: Object.values(weeks).map((w) => w.totalPrice),
    };
  };

  // Process data for different view modes
  const processChartData = (mode) => {
    const processedData = processDataForView(data);

    if (mode === "Daily") {
      return {
        categories: processedData.map((item) => formatDate(item._id)),
        totalPrice: processedData.map((item) => item.totalPrice),
      };
    } else if (mode === "Weekly") {
      return groupByWeek(processedData);
    } else if (mode === "Monthly") {
      // For a single month view, show the month total
      const monthName = new Date(data[0]._id).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      });

      return {
        categories: [monthName],
        totalPrice: [
          processedData.reduce((sum, item) => sum + item.totalPrice, 0),
        ],
      };
    }
  };

  const chartData = processChartData(viewMode);

  // Options for Total Price Chart
  const totalPriceOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "'Poppins', sans-serif",
      background: "#fff",
      dropShadow: {
        enabled: true,
        top: 3,
        left: 3,
        blur: 4,
        opacity: 0.12,
      },
    },
    xaxis: {
      categories: chartData.categories,
      title: {
        text: "Dates",
        style: { fontSize: "14px", fontWeight: "bold" },
      },
      labels: {
        rotate: -45,
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Total Revenue (₹)",
        style: { fontSize: "14px", fontWeight: "bold" },
      },
      labels: {
        formatter: (val) => {
          if (val >= 100000) return `₹${(val / 1000).toFixed(0)}K`;
          return `₹${val.toLocaleString()}`;
        },
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "60%",
        borderRadius: 4,
        distributed: viewMode === "Daily",
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => {
        if (val === 0) return "";
        if (val >= 10000) return `₹${(val / 1000).toFixed(0)}K`;
        return `₹${val.toLocaleString()}`;
      },
      style: {
        fontSize: "12px",
        colors: ["#333"],
        fontWeight: "bold",
      },
      offsetY: -20,
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 0.85,
        },
      },
    },
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
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
    colors:
      viewMode === "Daily"
        ? [
            "#e23844",
            "#f05d67",
            "#e23844",
            "#f05d67",
            "#e23844",
            "#f05d67",
            "#e23844",
            "#f05d67",
            "#e23844",
            "#f05d67",
          ]
        : ["#e23844"],
  };

  // Calculate total revenue for summary
  const totals = data.reduce(
    (acc, item) => {
      acc.totalBookings += item.bookingCount;
      acc.totalRevenue += item.totalPrice;
      return acc;
    },
    { totalBookings: 0, totalRevenue: 0 }
  );

  return (
    <div className="w-full bg-white p-2 rounded-lg">
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
        <CustomMonthDropdown
          tableIcons={tableIcons}
          value={month}
          setValue={setMonth}
        />
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">This Month Bookings</p>
          <p className="text-2xl font-bold text-gray-800">
            {totals.totalBookings}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">This Month Revenue</p>
          <p className="text-2xl font-bold text-gray-800">
            ₹ {formatPrice(totals.totalRevenue)}
          </p>
        </div>
      </div>

      {/* Total Price Chart */}
      <div className="w-full">
        <h2 className="text-base font-bold mb-3">{`Total Revenue (${viewMode})`}</h2>
        <Chart
          options={totalPriceOptions}
          series={[{ name: "Total Revenue", data: chartData.totalPrice }]}
          type="bar"
          height={400}
        />
      </div>
    </div>
  );
};

export default BarChart;
