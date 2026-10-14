import { useState } from "react";
import { tableIcons } from "../../Data/Icons";

const ArrowSelect = ({
  className = "",
  wrapperClassName = "",
  children,
  onChange,
  onBlur,
  onClick,
  onKeyDown,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative ${wrapperClassName}`}>
      <select
        {...props}
        className={`appearance-none pr-8 ${className}`}
        onClick={(e) => {
          setOpen((o) => !o);
          onClick?.(e);
        }}
        onChange={(e) => {
          setOpen(false);
          onChange?.(e);
        }}
        onBlur={(e) => {
          setOpen(false);
          onBlur?.(e);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape" || e.key === "Enter") setOpen(false);
          onKeyDown?.(e);
        }}
      >
        {children}
      </select>
      <span
        className={`pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 transition-transform duration-200 ${
          open ? "rotate-180" : ""
        }`}
      >
        {tableIcons.downArrow}
      </span>
    </div>
  );
};

export default ArrowSelect;
