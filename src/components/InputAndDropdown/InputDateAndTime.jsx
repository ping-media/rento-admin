import { useEffect, useState } from "react";
import { convertDateFormat } from "../../utils";

const InputDateAndTime = ({
  item,
  value = "",
  require = false,
  name,
  setDateAndTIme,
}) => {
  const [dateAndTime, setDateAndTime] = useState("");
  const [inputValue, setInputValue] = useState("");

  //changing the value of time
  const handleValueChange = (e) => {
    setInputValue(e.target.value);
    const databaseDate = convertDateFormat(e.target.value);
    setDateAndTime(databaseDate);
    setDateAndTIme && setDateAndTIme(databaseDate);
  };

  useEffect(() => {
    if (value) {
      const dataBaseDate = convertDateFormat(value);
      setDateAndTime(dataBaseDate);
    }
  }, [value]);

  return (
    <div className="w-full relative">
      <label
        htmlFor={name}
        className="block text-gray-800 font-semibold text-sm capitalize"
      >
        Enter {item} {require && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-2">
        <input type="hidden" name={name} value={dateAndTime} />
        <input
          type="datetime-local"
          id={name}
          className={`block w-full rounded-md px-5 py-3 ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none ${
            item != "email"
              ? item == "vehicleNumber"
                ? "uppercase"
                : "capitalize"
              : ""
          } disabled:bg-gray-400 disabled:bg-opacity-20`}
          value={inputValue}
          onChange={(e) => handleValueChange(e)}
          placeholder={`${item}`}
          required={require}
        />
      </div>
    </div>
  );
};

export default InputDateAndTime;
