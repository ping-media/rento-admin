import { useState } from "react";
import ArrowSelect from "../../InputAndDropdown/ArrowSelect";
import { COST_CATEGORIES, INPUT_CLS } from "../../../utils/maintenance";

const emptyForm = { amount: "", category: "parts", description: "" };

const RepairAdjustment = ({ saving, onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const set = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const submit = () =>
    onSubmit(form, () => {
      setForm(emptyForm);
      setOpen(false);
    });

  if (!open)
    return (
      <div className="border-t pt-3 flex justify-end">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-4 py-1.5 rounded-md border border-theme text-theme text-sm"
        >
          + Add Adjustment
        </button>
      </div>
    );

  return (
    <div className="border-t pt-3 flex flex-col gap-2">
      <div className="font-medium">Add adjustment</div>
      <p className="text-xs text-gray-500">
        Use a negative amount for a refund or correction, for example -200.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500">Category</label>
          <CategorySelect
            value={form.category}
            onChange={(v) => set("category", v)}
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Amount (₹)</label>
          <input
            type="number"
            className={INPUT_CLS}
            value={form.amount}
            onChange={(e) => set("amount", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500">Reason / description *</label>
        <input
          className={INPUT_CLS}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          disabled={saving}
          onClick={() => setOpen(false)}
          className="px-4 py-1.5 rounded-md border border-gray-400 text-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={submit}
          className="px-4 py-1.5 rounded-md bg-theme text-white text-sm"
        >
          Save Adjustment
        </button>
      </div>
    </div>
  );
};

export default RepairAdjustment;

const CategorySelect = ({ value, onChange }) => (
  <ArrowSelect
    wrapperClassName="w-full"
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
