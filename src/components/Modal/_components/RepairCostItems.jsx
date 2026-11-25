import ArrowSelect from "../../InputAndDropdown/ArrowSelect";
import { COST_CATEGORIES, INPUT_CLS, money } from "../../../utils/maintenance";

const RepairCostItems = ({
  editable,
  items,
  savedItems,
  total,
  onAdd,
  onChange,
  onRemove,
}) => (
  <div>
    <div className="flex justify-between items-center">
      <label className="font-semibold">Parts / labour / other</label>
      {editable && (
        <button type="button" className="text-theme text-sm" onClick={onAdd}>
          + Add item
        </button>
      )}
    </div>

    {editable
      ? items.map((c, idx) => (
          <div key={idx} className="flex gap-1 mt-1">
            <CategorySelect
              value={c.category}
              onChange={(v) => onChange(idx, "category", v)}
            />
            <input
              className={INPUT_CLS}
              placeholder="Description"
              value={c.description}
              onChange={(e) => onChange(idx, "description", e.target.value)}
            />
            <input
              type="number"
              min="0"
              className="w-28 border rounded-md px-2 text-sm"
              placeholder="₹"
              value={c.amount}
              onChange={(e) => onChange(idx, "amount", e.target.value)}
            />
            <button
              type="button"
              className="text-red-600 px-1"
              onClick={() => onRemove(idx)}
            >
              ✕
            </button>
          </div>
        ))
      : savedItems.map((c, idx) => (
          <div key={idx} className="flex justify-between border-b py-1">
            <span className="capitalize">
              {c.description} <i className="text-gray-400">({c.category})</i>
            </span>
            <span>{money(c.amount)}</span>
          </div>
        ))}

    <div className="text-right font-semibold mt-1">Total: {money(total)}</div>
  </div>
);

export default RepairCostItems;

const CategorySelect = ({ value, onChange }) => (
  <ArrowSelect
    wrapperClassName="w-28 shrink-0"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="block w-full rounded-md border border-gray-300 px-4 py-3 text-sm capitalize"
  >
    {COST_CATEGORIES.map((x) => (
      <option key={x} value={x}>
        {x}
      </option>
    ))}
  </ArrowSelect>
);
