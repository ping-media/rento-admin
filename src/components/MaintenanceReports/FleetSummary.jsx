import { money, INPUT_CLS } from "../../utils/maintenance";
import { StatCard, CategoryList } from "./ReportParts";

const FleetSummary = ({
  from,
  setFrom,
  to,
  setTo,
  data,
  loading,
  onOpenVehicle,
}) => {
  const maxMonth = Math.max(
    ...(data?.monthlyTrend || []).map((m) => m.total),
    1,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="font-medium text-sm">From</label>
          <input
            type="date"
            className={INPUT_CLS}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div>
          <label className="font-medium text-sm">To</label>
          <input
            type="date"
            className={INPUT_CLS}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        {(from || to) && (
          <button
            type="button"
            onClick={() => {
              setFrom("");
              setTo("");
            }}
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:border-theme hover:text-theme"
          >
            Clear
          </button>
        )}
      </div>

      {loading && <FleetSkeleton />}

      {!loading && data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              label="Total Maintenance Expense"
              value={money(data.totalExpense)}
            />
            <StatCard label="Total Repairs" value={data.repairCount} />
            <StatCard
              label="Average Cost per Repair"
              value={money(data.averagePerRepair)}
            />
            <StatCard
              label="Highest-Expense Vehicle"
              value={
                data.highestExpenseVehicle
                  ? `${data.highestExpenseVehicle.vehicleNumber || "--"}`
                  : "--"
              }
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm mb-1">
                Repair cost by category
              </h3>
              <CategoryList items={data.byCategory} />
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-1">
                Top vehicles (click for lifetime)
              </h3>
              <div className="border rounded-md">
                {data.topVehicles.length === 0 && (
                  <div className="p-3 text-sm text-gray-400 italic text-center">
                    No data.
                  </div>
                )}
                {data.topVehicles.map((v) => (
                  <button
                    key={v.vehicleTableId}
                    type="button"
                    onClick={() => onOpenVehicle(v)}
                    className="w-full flex justify-between px-3 py-1.5 text-sm border-b last:border-b-0 hover:bg-gray-50 uppercase"
                  >
                    <span>{v.vehicleNumber || "--"}</span>
                    <span>{money(v.total)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-1">Monthly trend</h3>
            <div className="border rounded-md p-3 flex flex-col gap-1.5">
              {data.monthlyTrend.length === 0 && (
                <div className="text-sm text-gray-400 italic text-center">
                  No data.
                </div>
              )}
              {data.monthlyTrend.map((m) => (
                <div key={m.month} className="flex items-center gap-2 text-sm">
                  <span className="w-20 shrink-0">{m.month}</span>
                  <div className="flex-1 bg-gray-100 rounded h-3">
                    <div
                      className="bg-theme h-3 rounded"
                      style={{
                        width: `${Math.max((m.total / maxMonth) * 100, 2)}%`,
                      }}
                    />
                  </div>
                  <span className="w-24 text-right">{money(m.total)}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FleetSummary;

const FleetSkeleton = () => (
  <div className="flex flex-col gap-4 animate-pulse">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-16 bg-gray-200 rounded-md" />
      ))}
    </div>
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="h-40 bg-gray-200 rounded-md" />
      <div className="h-40 bg-gray-200 rounded-md" />
    </div>
    <div className="h-32 bg-gray-200 rounded-md" />
  </div>
);
