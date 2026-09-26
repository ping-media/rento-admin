import React, { useState } from "react";

const DropdownTab = ({ options = [], tab, setTab, padding = "p-2" }) => {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.id === tab);

  const handleSelect = (id) => {
    setTab(id);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full border rounded flex justify-between items-center bg-white font-semibold ${padding}`}
      >
        <span>{selected?.title || "Select"}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto z-50">
          {options.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                tab === item.id ? "bg-theme text-white hover:bg-theme" : ""
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownTab;
