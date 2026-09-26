import { useEffect, useState } from "react";
import { camelCaseToSpaceSeparated } from "../../utils";

const TextArea = ({
  item,
  value = "",
  disabled = false,
  require = false,
  setValueChange,
  customClass = "w-full px-5 py-3",
  bodyWidth = "w-full",
  isModalClose,
  name,
  placeholder,
  excludeLocation,
}) => {
  const [inputValue, setInputValue] = useState(value);
  // changing the value
  const handleChangeValue = (e) => {
    setInputValue(e.target.value);
    setValueChange && setValueChange(e.target.value);
  };

  // for updating the value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // resetting the value
  useEffect(() => {
    if (excludeLocation && location.pathname === excludeLocation) return;
    if (isModalClose === false) {
      setInputValue("");
    }
  }, [isModalClose]);

  return (
    <div className={`${bodyWidth} relative`}>
      {/* main input  */}
      <label
        htmlFor={item}
        className="block text-gray-800 font-semibold text-sm capitalize text-left"
      >
        Enter{" "}
        {placeholder ||
          (item?.includes("Proof")
            ? camelCaseToSpaceSeparated(item).replace("Proof", "")
            : item?.includes("_For")
            ? camelCaseToSpaceSeparated(item).replace("_For", "")
            : camelCaseToSpaceSeparated(item))}{" "}
        {require && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-2">
        <textarea
          id={item}
          className={`block ${customClass} rounded-md ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none relative disabled:bg-gray-400/20 disabled:bg-opacity-20 resize-none`}
          value={inputValue}
          onChange={(e) => handleChangeValue(e)}
          name={name || item}
          placeholder={`${
            item.includes("Proof")
              ? camelCaseToSpaceSeparated(
                  placeholder || item.replace("Proof", "")
                )
              : camelCaseToSpaceSeparated(placeholder || item)
          }`}
          disabled={disabled}
          required={require}
        ></textarea>
      </div>
    </div>
  );
};

export default TextArea;
