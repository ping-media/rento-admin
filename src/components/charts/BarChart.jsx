import Chart from "react-apexcharts";

const BarChart = ({ chartOptions, chartSeries, type }) => {
  return (
    <Chart
      options={chartOptions}
      series={chartSeries}
      type={type}
      width="100%"
      height="100%"
    />
  );
};

export default BarChart;
