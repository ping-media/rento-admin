import ManagerSelect from "../../InputAndDropdown/ManagerSelect";
import { REPAIR_TYPES, INPUT_CLS } from "../../../utils/maintenance";
import ArrowSelect from "../../InputAndDropdown/ArrowSelect";
import CheckBox from "../../InputAndDropdown/CheckBox";

const RepairOptionFields = ({
  isRepair,
  setIsRepair,
  repairType,
  setRepairType,
  odometer,
  setOdometer,
  mechanicId,
  setMechanicId,
  isAdmin,
  showOdometer,
}) => (
  <div className="mb-2 text-left border border-gray-300 rounded-md px-4 py-3">
    <label
      className={`flex items-center gap-2 text-sm font-medium cursor-pointer transition-all duration-200 ease-in-out ${isRepair ? "border-b border-gray-300 pb-1.5" : ""}`}
    >
      <CheckBox
        id="isRepairCheckbox"
        checked={isRepair}
        handleSelect={(e) => setIsRepair(e.target.checked)}
      />
      This is for repair / service
    </label>

    {isRepair && (
      <div className="mt-2 flex flex-col gap-2 text-sm">
        <div className="flex flex-col gap-1.5">
          <label className="font-medium">Work type</label>
          <WorkTypeSelect value={repairType} onChange={setRepairType} />
        </div>

        {showOdometer && (
          <div className="flex flex-col gap-1.5">
            <label className="font-medium">Odometer (km)</label>
            <input
              type="number"
              min="0"
              className={INPUT_CLS}
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
            />
          </div>
        )}

        {isAdmin ? (
          <div className="flex flex-col gap-1.5">
            <label className="font-medium">Assign manager</label>
            <ManagerSelect value={mechanicId} onChange={setMechanicId} />
          </div>
        ) : (
          <p className="text-xs text-gray-500">
            You will be set as the mechanic for this repair.
          </p>
        )}
      </div>
    )}
  </div>
);

export default RepairOptionFields;

const WorkTypeSelect = ({ value, onChange }) => (
  <ArrowSelect
    wrapperClassName="w-full"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="block w-full rounded-md border border-gray-300 px-5 py-3 text-sm capitalize"
  >
    {REPAIR_TYPES.map(([v, l]) => (
      <option key={v} value={v}>
        {l}
      </option>
    ))}
  </ArrowSelect>
);
