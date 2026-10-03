import { useEffect, useRef, useState } from "react";
import { camelCaseToSpaceSeparated } from "../../utils";
import { useDebounce } from "../../utils/Helper/debounce";
import { tableIcons } from "../../Data/Icons";

const Input = ({
  item,
  value = "",
  defaultValue = "",
  type = "text",
  disabled = false,
  require = false,
  setValueChange,
  customClass = "w-full px-5 py-3",
  bodyWidth = "w-full",
  onChangeFun,
  onChangeFilterFun,
  dateToBeAdd,
  DBDateToBeAdd,
  setDateChange,
  setDBDateChange,
  isModalClose,
  isCouponInput = false,
  name,
  placeholder,
  handlevalidateInput,
  excludeLocation,
  isCapital = true,
  isPassword = false,
  isbtn = false,
  isLabel = true,
  btnFn,
  btnLabel,
  btnLoading,
  isFull = true,
  btnDisable,
  afterOnChange,
  ...rest
}) => {
  const [inputValue, setInputValue] = useState(value || defaultValue || "");
  // for debouncing state
  const [isDebounceValue, setIsDebounceValue] = useState("");
  const debouncedDate = useDebounce(isDebounceValue, 500);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputRef = useRef(null);

  // changing the value
  const handleChangeValue = (e) => {
    // this will block negative value and only allow for coupon field
    if (
      isCouponInput === false &&
      typeof e.target.value == "number" &&
      Number(e.target.value) < 0
    )
      return;

    afterOnChange?.(e);

    setInputValue(e.target.value);
    setValueChange && setValueChange(e.target.value);
    // this is to change the date based on number of day's
    const newDate =
      onChangeFun &&
      dateToBeAdd &&
      onChangeFun(dateToBeAdd, Number(e.target.value));
    setDateChange && setDateChange(newDate);

    // for db dates
    if (setDBDateChange && DBDateToBeAdd && onChangeFun) {
      const newDBDate = onChangeFun(DBDateToBeAdd, Number(e.target.value));
      setDBDateChange(newDBDate);
    }

    // this is to change the date based on filters
    onChangeFilterFun && setIsDebounceValue(e.target.value);
  };

  // for toggling from password to text
  const togglePasswordToText = () => {
    setPasswordVisible(!passwordVisible);
    if (inputRef.current.type == "password") {
      inputRef.current.type = "text";
    } else {
      inputRef.current.type = "password";
    }
  };

  // for running function after there is a valid value
  useEffect(() => {
    // stopping this to run first time
    if (isFirstRender === true) {
      setIsFirstRender(false);
      return;
    }

    if (!onChangeFilterFun) return;
    if (onChangeFilterFun) {
      if (debouncedDate.length === 10 || debouncedDate.length === 0) {
        onChangeFilterFun(debouncedDate);
      }
    }
  }, [debouncedDate]);

  // for updating the value
  useEffect(() => {
    if (value !== undefined && value !== "") {
      setInputValue(value);
    } else if (defaultValue !== undefined) {
      setInputValue(defaultValue);
    }
  }, [value, defaultValue]);
  // useEffect(() => {
  //   setInputValue(value);
  // }, [value]);

  // Prevent increment and decrement via arrow keys
  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
    }
  };

  // resetting the value
  useEffect(() => {
    if (excludeLocation && location.pathname === excludeLocation) return;
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
      {isLabel && (
        <label
          htmlFor={item}
          className="block text-gray-800 font-semibold text-sm capitalize text-left"
        >
          {!isFull
            ? placeholder
            : `Enter ${
                placeholder ||
                (item?.includes("Proof")
                  ? camelCaseToSpaceSeparated(item).replace("Proof", "")
                  : item?.includes("_For")
                    ? camelCaseToSpaceSeparated(item).replace("_For", "")
                    : camelCaseToSpaceSeparated(item))
              }`}{" "}
          {require && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="mt-2">
        <input
          type={type}
          id={item}
          className={`block ${customClass} rounded-md ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none ${
            item !== "email" && isCapital
              ? item === "vehicleNumber"
                ? "uppercase"
                : isPassword
                  ? ""
                  : "capitalize"
              : ""
          } relative disabled:bg-gray-400/20 disabled:bg-opacity-20`}
          value={
            item === "vehicleNumber" || item === "couponName"
              ? inputValue.toUpperCase()
              : inputValue
          }
          onChange={(e) => handleChangeValue(e)}
          onKeyDown={handleKeyDown}
          onWheel={(e) => e.target.blur()}
          onBlur={(e) =>
            handlevalidateInput ? handlevalidateInput(e, name || item) : {}
          }
          ref={inputRef}
          name={name || item}
          placeholder={`${
            item.includes("Proof")
              ? camelCaseToSpaceSeparated(
                  placeholder || item.replace("Proof", ""),
                )
              : camelCaseToSpaceSeparated(placeholder || item)
          }`}
          disabled={disabled}
          required={require}
          step="3600"
          {...rest}
        />
        {isPassword && (
          <button
            className="absolute right-2 top-10"
            type="button"
            onClick={togglePasswordToText}
          >
            {passwordVisible ? tableIcons.eyeOpen : tableIcons?.eyeClose}
          </button>
        )}

        {isbtn && btnFn && (
          <button
            className="absolute right-2 top-10 text-theme disabled:text-gray-400"
            type="button"
            onClick={btnFn}
            disabled={btnDisable || btnLoading}
          >
            {btnLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
