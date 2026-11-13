import useMaintenanceRequests, {
  STATUS_OPTIONS,
  TYPE_OPTIONS,
} from "../hooks/use-maintenance-requests";
import RepairRequestModal from "../components/Modal/RepairRequestModal";
import { bookingDetailsPath, personName } from "../utils/maintenance";
import SimpleTable from "../components/Table/SimpleTable";
import { DateTimeCell } from "../components/Table/_components/TableComponents";
import ArrowSelect from "../components/InputAndDropdown/ArrowSelect";
import { useState } from "react";
import TablePageHeader from "../components/Table/TablePageHeader";
import { Link } from "react-router-dom";
import SendForServiceModal from "../components/Modal/SendForServiceModal";
import { useDispatch, useSelector } from "react-redux";
import { toggleAddRepair } from "../Redux/SideBarSlice/SideBarSlice";

const getColumns = (onOpen) => [
  {
    key: "vehicle",
    label: "Vehicle",
    tdClassName: "whitespace-nowrap uppercase",
    render: (r) => (
      <Link
        to={`/all-vehicles/details/${r.vehicleTableId?._id}`}
        className="w-full hover:underline underline-offset-4 hover:text-theme transition-all duration-200 ease-in-out"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {r.vehicleTableId?.vehicleNumber || "--"}
      </Link>
    ),
  },
  {
    key: "booking",
    label: "Booking",
    tdClassName: "whitespace-nowrap",
    render: (r) =>
      r.bookingId ? (
        <Link
          to={bookingDetailsPath(
            `${r.bookingId._id}_${r.bookingId?.bookingId}`,
          )}
          onClick={(e) => e.stopPropagation()}
          className="text-theme underline"
        >
          #{r.bookingId.bookingId}
        </Link>
      ) : (
        "--"
      ),
  },
  { key: "type", label: "Work Type", render: (r) => r.type.replace("_", " ") },
  {
    key: "problemDescription",
    label: "Problem",
    tdClassName: "max-w-32 truncate capitalize",
  },
  {
    key: "mechanic",
    label: "Mechanic",
    render: (r) => personName(r.mechanicId),
  },
  {
    key: "createdAt",
    label: "Created",
    render: (r) => <DateTimeCell value={r.createdAt} />,
  },
  {
    key: "action",
    label: "Action",
    tdClassName: "whitespace-nowrap",
    render: (r) => (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpen(r._id);
        }}
        className="px-3 py-0.5 rounded-full border border-theme text-theme hover:bg-theme hover:text-white transition"
      >
        Open
      </button>
    ),
  },
];

const MaintenanceRequests = () => {
  const { isAddRepairActive } = useSelector((state) => state.sideBar);
  const m = useMaintenanceRequests();
  const [inputSearchQuery, setInputSearchQuery] = useState("");
  const dispatch = useDispatch();

  return (
    <>
      {/* header  */}
      <div className="mt-1">
        <TablePageHeader
          inputSearchQuery={inputSearchQuery}
          setInputSearchQuery={setInputSearchQuery}
          bookingData={[]}
          addHandler={() => dispatch(toggleAddRepair())}
        />
      </div>

      {/* filters  */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3">
        <FilterSelect
          value={m.status}
          onChange={(v) => m.setFilter("repairStatus", v)}
        >
          {STATUS_OPTIONS.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          value={m.type}
          onChange={(v) => m.setFilter("repairType", v)}
        >
          {TYPE_OPTIONS.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </FilterSelect>

        {m.isAdmin && (
          <FilterSelect
            value={m.stationId}
            onChange={(v) => m.setFilter("stationId", v)}
          >
            <option value="">All stations</option>
            {m.stations.map((s) => (
              <option key={s._id} value={s.stationId}>
                {s.stationName}
              </option>
            ))}
          </FilterSelect>
        )}

        {m.hasFilters && (
          <button
            type="button"
            onClick={m.clearFilters}
            className="px-3 py-2 text-sm rounded-md border border-gray-300 bg-white hover:border-theme hover:text-theme"
          >
            Clear
          </button>
        )}
      </div>

      <SimpleTable
        columns={getColumns(m.setSelectedId)}
        rows={m.rows}
        loading={m.loading}
        onRowClick={(r) => m.setSelectedId(r._id)}
        pagination={{
          page: m.page,
          limit: m.limit,
          totalPages: m.totalPages,
          setPage: m.setPage,
          setLimit: m.setLimit,
        }}
      />

      {m.selectedId && (
        <RepairRequestModal
          requestId={m.selectedId}
          onClose={() => m.setSelectedId(null)}
          onChanged={m.refresh}
        />
      )}

      {isAddRepairActive && (
        <SendForServiceModal
          onClose={() => dispatch(toggleAddRepair())}
          onSent={(request) => {
            dispatch(toggleAddRepair());
            m.refresh();
            m.setSelectedId(request._id); // open the new request straight away
          }}
        />
      )}
    </>
  );
};

export default MaintenanceRequests;

const FilterSelect = ({ value, onChange, children }) => (
  <ArrowSelect
    wrapperClassName="w-[49%] sm:w-48"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm capitalize"
  >
    {children}
  </ArrowSelect>
);
