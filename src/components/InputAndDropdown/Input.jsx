import { useState } from "react";

const Input = ({ item, value = "", type = "text" }) => {
  const [inputValue, setInputValue] = useState(value);
  return (
    <div className="w-full">
      <label
        htmlFor={item}
        className="block text-gray-800 font-semibold text-sm capitalize"
      >
        Enter {item}
      </label>
      <div className="mt-2">
        <input
          type={type}
          id={item}
          className="block w-full rounded-md px-5 py-3 ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none capitalize"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          name={item}
          placeholder={`${item}`}
        />
      </div>
    </div>
  );
};

export default Input;
