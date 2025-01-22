import { useEffect, useState } from "react";
import { camelCaseToSpaceSeparated } from "../../utils";

const Input = ({
  item,
  value = "",
  type = "text",
  disabled = false,
  require = false,
  setValueChange,
  customClass = "w-full px-5 py-3",
  bodyWidth = "w-full",
  onChangeFun,
  dateToBeAdd,
  setDateChange,
  isModalClose,
}) => {
  const [inputValue, setInputValue] = useState(value);

  // changing the value
  const handleChangeValue = (e) => {
    setInputValue(e.target.value);
    setValueChange && setValueChange(e.target.value);
    // this is to change the date based on number of day's
    const newDate =
      onChangeFun &&
      dateToBeAdd &&
      onChangeFun(dateToBeAdd, Number(e.target.value));
    setDateChange && setDateChange(newDate);
  };

  // Prevent increment and decrement via arrow keys
  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
    }
  };

  // resetting the value
  useEffect(() => {
    if (isModalClose === false) {
      setInputValue("");
    }
  }, [isModalClose]);

  return (
    <div className={`${bodyWidth}`}>
      <label
        htmlFor={item}
        className="block text-gray-800 font-semibold text-sm capitalize text-left"
      >
        Enter{" "}
        {item?.includes("Proof")
          ? camelCaseToSpaceSeparated(item).replace("Proof", "")
          : camelCaseToSpaceSeparated(item)}{" "}
        {require && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-2">
        <input
          type={type}
          id={item}
          className={`block ${customClass} rounded-md ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none ${
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
