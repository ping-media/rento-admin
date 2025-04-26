import React from "react";

const Tooltip = ({ buttonMessage, tooltipData }) => {
  return (
    <div className="relative group inline-block">
      <button className="underline underline-offset-4">{buttonMessage}</button>
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max text-sm text-white bg-gray-800 px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        {tooltipData}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
      </div>
    </div>
  );
};

export default Tooltip;
