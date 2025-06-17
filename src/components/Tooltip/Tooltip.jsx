import { useState } from "react";

const Tooltip = ({
  buttonMessage,
  tooltipData,
  underLine = true,
  className,
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className={`${
          underLine ? "underline underline-offset-4" : ""
        } ${className}`}
      >
        {buttonMessage}
      </button>
      {visible && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max text-sm text-white bg-gray-800 px-3 py-1 rounded transition-opacity duration-300 z-10">
          {tooltipData}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
