import SimpleTable from "../Table/SimpleTable";
import { money } from "../../utils/maintenance";
// import { StatCard } from "./ReportParts";

const COLUMNS = [
  {
    key: "vehicleNumber",
    label: "Vehicle No.",
    tdClassName: "whitespace-nowrap uppercase",
  },
  { key: "repairCount", label: "Repairs" },
  {
    key: "total",
    label: "Expense",
    align: "right",
    render: (v) => money(v.total),
  },
];

const MonthlyReport = ({ rows, loading, pagination, onOpenVehicle }) => (
  <SimpleTable
    columns={COLUMNS}
    rows={rows}
    loading={loading}
    rowKey={(v) => v.vehicleTableId}
    onRowClick={onOpenVehicle}
    pagination={pagination}
  />
);
// const MonthlyReport = ({ month, setMonth, data, loading, onOpenVehicle }) => (
//   <div className="flex flex-col gap-3">
//     <div className="max-w-xs">
//       <label className="font-medium text-sm">Month</label>
//       <input
//         type="month"
//         className={INPUT_CLS}
//         value={month}
//         onChange={(e) => setMonth(e.target.value)}
//       />
//     </div>

//     <div className="grid grid-cols-2 gap-3 max-w-md">
//       <StatCard
//         label="Total Expense"
//         value={loading || !data ? "--" : money(data.grandTotal)}
//       />
//       <StatCard
//         label="Vehicles Repaired"
//         value={loading || !data ? "--" : data.vehicles.length}
//       />
//     </div>

//     <SimpleTable
//       columns={COLUMNS}
//       rows={data?.vehicles || []}
//       loading={loading}
//       rowKey={(v) => v.vehicleTableId}
//       onRowClick={onOpenVehicle}
//     />
//   </div>
// );

export default MonthlyReport;
