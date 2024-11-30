import { useState } from "react";
import { getData } from "../../Data";
import Spinner from "../Spinner/Spinner";

const InputWithSearchAndAddValue = ({ item, disabled = false, endpoint }) => {
  const [inputValue, setInputValue] = useState("");
  const [userList, setUserList] = useState([]);
  const [isvisible, setIsVisible] = useState(false);
  const [users, setUsers] = useState([]);

  const handleSearchData = async (e) => {
    setInputValue(e.target.value);
    try {
      const response = await getData(`${endpoint}/${e.target.value}`);
      console.log(response?.data);
      if (response?.data.length > 0) {
        setIsVisible(true);
        return setUserList(response?.data);
      }
    } catch (error) {
      return error?.message;
    }
  };

  return (
    <div className="w-full relative">
      <label
        htmlFor={item}
        className="block text-gray-800 font-semibold text-sm capitalize"
      >
        Enter {item}
      </label>
      <div className="mt-2">
        <input
          type="text"
          id={item}
          className={`block w-full rounded-md px-5 py-3 ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none ${
            item != "email" ? "capitalize" : ""
          } disabled:bg-gray-400 disabled:bg-opacity-20`}
          value={inputValue}
          onChange={(e) => handleSearchData(e)}
          name={item}
          placeholder={`${item}`}
          disabled={disabled}
        />
      </div>
      {isvisible && (
        <div className="absolute w-full">
          <ul>
            {userList.length > 0 ? (
              userList.map((list) => <li key={list?._id}>{list?.firstName}</li>)
            ) : (
              <Spinner message={"loading"} />
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InputWithSearchAndAddValue;
