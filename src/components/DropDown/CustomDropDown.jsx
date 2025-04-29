import React, { useState, useRef, useEffect } from "react";
import { getFullYearMonthOptions } from "../../utils/index";

const CustomMonthDropdown = ({ tableIcons, value = "", setValue }) => {
  const options = getFullYearMonthOptions(12);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value !== "" ? value : options[0]);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const handleSelect = (option) => {
    setSelected(option);
    setValue && setValue(option);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div
        className="flex items-center gap-1 px-1 md:px-2 lg:px-3 py-1 border-2 border-theme rounded-md cursor-pointer text-theme"
        onClick={toggleDropdown}
      >
        <span>{tableIcons?.dateCalender}</span>
        <span className="flex-1">{selected}</span>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className="text-sm p-2 hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomMonthDropdown;
