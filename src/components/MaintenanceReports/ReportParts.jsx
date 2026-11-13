import { money } from "../../utils/maintenance";

export const StatCard = ({ label, value }) => (
  <div className="border rounded-md p-3 bg-gray-50">
    <div className="text-xs text-gray-500">{label}</div>
    <div className="text-lg font-semibold text-theme">{value}</div>
  </div>
);

export const CategoryList = ({ items = [] }) => (
  <div className="border rounded-md">
    {items.length === 0 && (
      <div className="p-3 text-sm text-gray-400 italic text-center">
        No data.
      </div>
    )}
    {items.map((c) => (
      <div
        key={c.category}
        className="flex justify-between px-3 py-1.5 text-sm border-b last:border-b-0 capitalize"
      >
        <span>{c.category}</span>
        <span>{money(c.total)}</span>
      </div>
    ))}
  </div>
);
