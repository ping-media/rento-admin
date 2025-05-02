import React, { useEffect, useState } from "react";

const TabButton = ({ options, tab, setTab }) => {
  const [nextIndex, setNextIndex] = useState(1);

  useEffect(() => {
    const index = options?.findIndex((t) => t.id === tab);
    if (index === -1 || !options) return;

    const isLast = index === options.length - 1;
    if (!isLast) {
      setNextIndex(index + 1);
    }
  }, [tab, options]);

  return (
    <div className="relative flex border rounded overflow-hidden flex-1">
      <div
        className={`absolute top-0 left-0 h-full bg-theme transition-all duration-300 rounded text-white z-0`}
        style={{
          width: "50%",
          transform: `translateX(${
            tab === options[nextIndex]?.id ? "100%" : "0%"
          })`,
        }}
      />
      {options?.length > 0 &&
        options.map((item) => (
          <button
            key={item?.id}
            type="button"
            className={`flex-1 z-10 p-1 font-semibold transition-colors duration-300 ${
              tab === item?.id ? "text-white" : "text-gray-800"
            }`}
            onClick={() => setTab(item?.id)}
          >
            {item.title}
          </button>
        ))}
    </div>
  );
};

export default TabButton;
