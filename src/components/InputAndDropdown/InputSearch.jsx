import { useState } from "react";
import { getData } from "../../Data";

const InputSearch = ({
  item,
  value = "",
  type = "text",
  disabled = false,
  require = false,
  name,
  token,
}) => {
  const [inputValue, setInputValue] = useState(value);

  const fetchData = async (id) => {
    const userResponse = await getData(`/getAllUsers?contact=${id}`, token);
    if (userResponse) {
      console.log(userResponse);
    }
  };

  const handleSelectUser = async (e) => {
    setInputValue(e.target.value);
    if (e.target.value.length == 10) {
      const userData = await fetchData(e.target.value);
      console.log("validNumber");
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-gray-800 font-semibold text-sm capitalize"
      >
        Enter {item} {require && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-2">
        <input
          type={type}
          id={name}
          className={`block w-full rounded-md px-5 py-3 ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none ${
            item != "email"
              ? item == "vehicleNumber"
                ? "uppercase"
                : "capitalize"
              : ""
          } disabled:bg-gray-400 disabled:bg-opacity-20`}
          value={
            item == "vehicleNumber" ? inputValue.toUpperCase() : inputValue
          }
          onChange={(e) => handleSelectUser(e)}
          name={name}
          placeholder={`${item}`}
          disabled={disabled}
          required={require}
        />
      </div>
    </div>
  );
};

export default InputSearch;
