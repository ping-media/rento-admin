import { useState } from "react";
import { camelCaseToSpaceSeparated } from "../../utils";

const Input = ({
  item,
  value = "",
  type = "text",
  disabled = false,
  require = false,
  setValueChange,
}) => {
  const [inputValue, setInputValue] = useState(value);

  // changing the value
  const handleChangeValue = (e) => {
    setInputValue(e.target.value);
    setValueChange && setValueChange(e.target.value);
  };

  // Prevent increment and decrement via arrow keys
  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor={item}
        className="block text-gray-800 font-semibold text-sm capitalize text-left"
      >
        Enter {camelCaseToSpaceSeparated(item)}{" "}
        {require && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-2">
        <input
          type={type}
          id={item}
          className={`block w-full rounded-md px-5 py-3 ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none ${
            item != "email"
              ? item == "vehicleNumber"
                ? "uppercase"
                : "capitalize"
              : ""
          } disabled:bg-gray-400 disabled:bg-opacity-20`}
          value={
            item === "vehicleNumber" || item === "couponName"
              ? inputValue.toUpperCase()
              : inputValue
          }
          onChange={(e) => handleChangeValue(e)}
          onKeyDown={handleKeyDown}
          name={item}
          placeholder={`${item}`}
          disabled={disabled}
          required={require}
        />
      </div>
    </div>
  );
};

export default Input;
