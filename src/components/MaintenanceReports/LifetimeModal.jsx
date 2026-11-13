import Spinner from "../../components/Spinner/Spinner";
import ModalWrapper from "../../components/Modal/ModalWrapper";
import { money } from "../../utils/maintenance";
import { StatCard, CategoryList } from "./ReportParts";

const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-IN") : "--");

const LifetimeModal = ({ lifetime, onClose }) => {
  const { vehicle, data, loading } = lifetime;

  return (
    <ModalWrapper
      active={lifetime.open}
      onClose={onClose}
      size="lg"
      position="responsive"
      zIndexClass="z-50"
      className="text-left"
      title={
        <span className="text-theme text-lg uppercase">
          Lifetime Expense{" "}
          {vehicle?.vehicleNumber ? `· ${vehicle.vehicleNumber}` : ""}
        </span>
      }
    >
      <div className="p-4 pt-0 flex flex-col gap-3 text-sm">
        {loading && <Spinner message="loading" textColor="text-black" />}
        {!loading && data && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Total Expense"
                value={money(data.totalExpense)}
              />
              <StatCard label="Total Repairs" value={data.repairCount} />
              <StatCard
                label="Average per Repair"
                value={money(data.averagePerRepair)}
              />
              <StatCard
                label="First – Last Expense"
                value={`${fmt(data.firstExpense)} – ${fmt(data.lastExpense)}`}
              />
            </div>
            <div>
              <h3 className="font-semibold mb-1">By category</h3>
              <CategoryList items={data.byCategory} />
            </div>
          </>
        )}
      </div>
    </ModalWrapper>
  );
};

export default LifetimeModal;
