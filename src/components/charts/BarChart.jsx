import { tableIcons } from "../../Data/Icons";
import React, { useState } from "react";
import Chart from "react-apexcharts";

// Format date
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

const BarChart = ({ data, onBarClick }) => {
  const [viewMode, setViewMode] = useState("Daily");
  const options = ["Daily", "Weekly"];
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  const processDataForView = (data) => {
    if (!data || data.length === 0) return [];

    const sortedData = [...data].sort(
      (a, b) => new Date(a._id) - new Date(b._id),
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

  // Group data by week
  const groupByWeek = (data) => {
    if (!data || data.length === 0)
      return { categories: [], totalPrice: [], weekRanges: [] };

    // get month/year from first data point
    const firstDate = new Date(data[0]._id);
    const year = firstDate.getFullYear();
    const month = firstDate.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate(); // last day of month

    const pad = (n) => String(n).padStart(2, "0");
    const toDateStr = (day) =>
      `${year}-${pad(month + 1)}-${pad(Math.min(day, lastDay))}`;

    // fixed 4 week ranges — week 4 always goes to end of month
    const weekDefs = [
      { key: "Week 1", start: 1, end: 7 },
      { key: "Week 2", start: 8, end: 14 },
      { key: "Week 3", start: 15, end: 21 },
      { key: "Week 4", start: 22, end: lastDay },
    ];

    const weekMap = {};
    weekDefs.forEach((w) => {
      weekMap[w.key] = {
        totalPrice: 0,
        bookingCount: 0,
        startDate: toDateStr(w.start),
        endDate: toDateStr(w.end),
      };
    });

    data.forEach((item) => {
      const day = new Date(item._id).getDate();
      const weekKey =
        day <= 7
          ? "Week 1"
          : day <= 14
            ? "Week 2"
            : day <= 21
              ? "Week 3"
              : "Week 4";

      weekMap[weekKey].totalPrice += item.totalPrice;
      weekMap[weekKey].bookingCount += item.bookingCount;
    });

    // only show weeks that have data
    const nonEmpty = weekDefs.filter(
      (w) => weekMap[w.key].totalPrice > 0 || weekMap[w.key].bookingCount > 0,
    );

    return {
      categories: nonEmpty.map((w) => w.key),
      totalPrice: nonEmpty.map((w) => weekMap[w.key].totalPrice),
      weekRanges: nonEmpty.map((w) => ({
        startDate: weekMap[w.key].startDate,
        endDate: weekMap[w.key].endDate,
      })),
    };
  };
  // const groupByWeek = (data) => {
  //   const weeks = {};

  //   data.forEach((item) => {
  //     const date = new Date(item._id);
  //     // Get the week number within the month
  //     const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  //     const dayOffset = firstDayOfMonth.getDay();
  //     const dayOfMonth = date.getDate();
  //     const weekNumber = Math.ceil((dayOfMonth + dayOffset) / 7);

  //     const weekKey = `Week ${weekNumber}`;

  //     if (!weeks[weekKey]) {
  //       weeks[weekKey] = {
  //         totalPrice: 0,
  //         bookingCount: 0,
  //         startDate: item._id,
  //         endDate: item._id,
  //       };
  //     }

  //     weeks[weekKey].totalPrice += item.totalPrice;
  //     weeks[weekKey].bookingCount += item.bookingCount;
  //     if (item._id < weeks[weekKey].startDate)
  //       weeks[weekKey].startDate = item._id;
  //     if (item._id > weeks[weekKey].endDate) weeks[weekKey].endDate = item._id;
  //   });

  //   // Convert to arrays
  //   return {
  //     categories: Object.keys(weeks),
  //     totalPrice: Object.values(weeks).map((w) => w.totalPrice),
  //     weekRanges: Object.values(weeks).map((w) => ({
  //       startDate: w.startDate,
  //       endDate: w.endDate,
  //     })),
  //   };
  // };

  // Process data for different view modes
  const processChartData = (mode) => {
    const processedData = processDataForView(data);

    if (mode === "Daily") {
      return {
        categories: processedData.map((item) => formatDate(item._id)),
        rawDates: processedData.map((item) => item._id),
        weekRanges: null,
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
      events: {
        dataPointSelection: (event, chartContext, config) => {
          if (!onBarClick) return;
          const index = config.dataPointIndex;

          if (viewMode === "Daily") {
            const rawDate = chartData.rawDates?.[index];
            if (rawDate) onBarClick({ date: rawDate });
          } else if (viewMode === "Weekly") {
            const weekRange = chartData.weekRanges?.[index];
            if (weekRange)
              onBarClick({
                startDate: weekRange.startDate,
                endDate: weekRange.endDate,
              });
          }
        },
      },
      // events: {
      //   dataPointSelection: (event, chartContext, config) => {
      //     if (viewMode !== "Daily" || !onBarClick) return;
      //     const index = config.dataPointIndex;
      //     const rawDate = chartData.rawDates?.[index];
      //     if (rawDate) onBarClick(rawDate);
      //   },
      // },
    },
    xaxis: {
      categories: chartData.categories,
      title: {
        text: "Dates",
        style: { fontSize: "14px", fontWeight: "bold" },
      },
      labels: {
        rotate: -45,
        hideOverlappingLabels: true,
        trim: true,
        style: {
          fontSize: "10px",
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
        columnWidth: chartData.categories.length <= 3 ? "20%" : "60%",
        borderRadius: 4,
        distributed: viewMode === "Daily",
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    // dataLabels: {
    //   enabled: !isMobile,
    //   formatter: (val) => {
    //     if (val === 0) return "";
    //     if (val >= 10000) return `₹${(val / 1000).toFixed(0)}K`;
    //     return `₹${val.toLocaleString()}`;
    //   },
    //   style: {
    //     fontSize: "12px",
    //     colors: ["#333"],
    //     fontWeight: "bold",
    //   },
    //   offsetY: -20,
    // },
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
    { totalBookings: 0, totalRevenue: 0 },
  );

  return (
    <div className="w-full bg-white sm:px-4 md:px-6 px-2 py-4 rounded-lg">
      {/* View Mode Buttons */}
      <div className="mb-3 pb-2 flex items-center justify-between border-b-2 border-theme/60 gap-2">
        <h2 className="text-base font-bold text-theme">{`Total Revenue (${viewMode})`}</h2>
        <div className="inline-flex items-center gap-2">
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
      </div>

      {/* Summary Card */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
      </div> */}

      {/* Total Price Chart */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[600px]">
          <Chart
            options={totalPriceOptions}
            series={[{ name: "Total Revenue", data: chartData.totalPrice }]}
            type="bar"
            height={400}
          />
        </div>
      </div>
    </div>
  );
};

export default BarChart;
