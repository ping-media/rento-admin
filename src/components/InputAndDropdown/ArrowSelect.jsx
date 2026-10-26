import { useState } from "react";
import { tableIcons } from "../../Data/Icons";

const ArrowSelect = ({
  className = "",
  wrapperClassName = "",
  children,
  onChange,
  onBlur,
  onClick,
  onMouseDown,
  onKeyDown,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative ${wrapperClassName}`}>
      <select
        {...props}
        className={`appearance-none pr-8 ${className}`}
        onMouseDown={(e) => {
          const el = e.currentTarget;
          if (open) setTimeout(() => el.blur(), 0);
          setOpen((o) => !o);
          onMouseDown?.(e);
        }}
        onClick={onClick}
        onChange={(e) => {
          if (open) e.currentTarget.blur();
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
