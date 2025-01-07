import { useState } from "react";

const SelectDropDownVehicle = ({
  item,
  name,
  require,
  options,
  value = "",
  setValueChanger,
  setSelectedChanger,
}) => {
  const [inputSelect, setInputSelect] = useState(value);
  const handleChangeValue = (e) => {
    setInputSelect(e.target.value);
    setValueChanger && setValueChanger(e.target.value);
    if (setSelectedChanger) {
      // const newSelectedOption = options.map(
      //   (item) => item?._id === e.target.value
      // );
      const newSelectedOption = options.find(
        (item) => item?._id === e.target.value
      );
      setSelectedChanger(newSelectedOption);
    }
  };
  return (
    <div className="w-full">
      <label
        htmlFor={item}
        className="block text-gray-800 font-semibold text-sm capitalize"
      >
        Select {item}
        {require && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="mt-2">
        <select
          name={name}
          id={item}
          value={inputSelect}
          onChange={(e) => handleChangeValue(e)}
          className="block w-full rounded-md px-5 py-3 ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none capitalize disabled:bg-gray-300 disabled:bg-opacity-30"
          disabled={!options || options?.length == 0 ? true : false}
          required={require}
        >
          <option value="">
            {(options?.length == 0 && `No ${item} Found`) || `Select ${item}`}
          </option>
          {options &&
            options.map((items) => {
              return (
                <option
                  value={items?._id}
                  key={items?._id}
                  className="capitalize"
                >
                  {items?.vehicleNumber} | {items?.vehicleName}
                </option>
              );
            })}
        </select>
      </div>
    </div>
  );
};

export default SelectDropDownVehicle;
