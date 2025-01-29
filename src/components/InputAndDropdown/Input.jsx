import { useEffect, useState } from "react";
import { camelCaseToSpaceSeparated } from "../../utils";
import { useDebounce } from "../../utils/Helper/debounce";

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
  onChangeFilterFun,
  dateToBeAdd,
  setDateChange,
  isModalClose,
  isCouponInput = false,
}) => {
  const [inputValue, setInputValue] = useState(value);
  // for debouncing state
  const [isDebounceValue, setIsDebounceValue] = useState("");
  const debouncedDate = useDebounce(isDebounceValue, 500);
  const [isFirstRender, setIsFirstRender] = useState(true);

  // changing the value
  const handleChangeValue = (e) => {
    // this will block negative value and only allow for coupon field
    if (
      isCouponInput === false &&
      typeof e.target.value == "number" &&
      Number(e.target.value) < 0
    )
      return;

    setInputValue(e.target.value);
    setValueChange && setValueChange(e.target.value);
    // this is to change the date based on number of day's
    const newDate =
      onChangeFun &&
      dateToBeAdd &&
      onChangeFun(dateToBeAdd, Number(e.target.value));
    setDateChange && setDateChange(newDate);
    // this is to change the date based on filters
    onChangeFilterFun && setIsDebounceValue(e.target.value);
  };

  // for running function after there is a valid value
  useEffect(() => {
    // stopping this to run first time
    if (isFirstRender === true) {
      setIsFirstRender(false);
      return;
    }

    console.log("first");

    if (!onChangeFilterFun) return;
    if (onChangeFilterFun) {
      if (debouncedDate.length === 10 || debouncedDate.length === 0) {
        onChangeFilterFun(debouncedDate);
      }
    }
  }, [debouncedDate]);

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

  // for clearing the input's
  const handleClearInput = () => {
    setIsDebounceValue("");
    setInputValue("");
  };

  return (
    <div className={`${bodyWidth} relative`}>
      {/* this button is only for filter input  */}
      {onChangeFilterFun && debouncedDate?.length > 5 && (
        <button
          type="button"
          className="absolute right-2 top-0 border-2 border-theme rounded text-theme hover:bg-theme hover:text-gray-100 transition-all duration-200 ease-in-out px-1"
          onClick={handleClearInput}
        >
          clear
        </button>
      )}
      {/* main input  */}
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
