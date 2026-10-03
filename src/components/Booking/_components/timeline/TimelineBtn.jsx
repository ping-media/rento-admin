import React from "react";

export const TimelineBtn = ({ tab, setTab }) => {
  return (
    <>
      {["booking", "rides"].map((item) => (
        <button
          key={item}
          type="button"
          className={`flex-1 z-10 p-1 font-semibold transition-colors duration-300 ${
            tab === item ? "text-white" : "text-gray-800"
          }`}
          onClick={() => setTab(item)}
        >
          {item.charAt(0).toUpperCase() + item.slice(1)}
        </button>
      ))}
    </>
  );
};
