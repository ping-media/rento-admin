import { useEffect, useState } from "react";
import { fetchUserDataBasedOnQuery } from "../../Data/Function";
import { getData } from "../../Data";
import PreLoader from "../Skeleton/PreLoader";

const InputVehicleSearch = ({
  item,
  value = "",
  type = "text",
  disabled = false,
  require = false,
  name,
  token,
  suggestedData,
  setSuggestionData,
  setValueChanger,
  setSlectedVehicle,
}) => {
  const [vehicleId, setvehicleId] = useState(value);
  const [inputValue, setInputValue] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

  // search user data based on query entered
  const handleSelectUser = async (e) => {
    const value = e.target.value;
    setInputValue(value);
    // remove data if there is not search query
    if (value?.length == 0) {
      //   dispatch(removeTempVehicleData());
      setSuggestionData(null);
    }
    // Clear the previous timeout to prevent immediate API calls
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    // Set a new timeout to call fetchData after 500ms
    const newTimeoutId = setTimeout(async () => {
      if (value) {
        const data = await fetchUserDataBasedOnQuery(
          `/getAllVehiclesData?search=${value}`,
          token
        );
        setSuggestionData(data);
      }
    }, 300);
    // Store the timeout ID to clear it if the user types again before 500ms
    setTimeoutId(newTimeoutId);
  };

  // setting user data to input
  const handleSelectUserById = (item) => {
    setvehicleId(item?._id);
    setValueChanger && setValueChanger(item?._id);
    setInputValue(`${item?.vehicleName} | ${item?.vehicleNumber}`);
    setSuggestionData(null);
    setSlectedVehicle && setSlectedVehicle(item);
  };

  // when editing the user
  useEffect(() => {
    if (value != "") {
      (async () => {
        setUserLoading(true);
        const response = await getData(
          `/getAllVehiclesData?_id=${value}`,
          token
        );
        if (response.status == 200) {
          const data = response?.data;
          setInputValue(`${data[0]?.vehicleName} | ${data[0]?.vehicleNumber}`);
        }
        setUserLoading(false);
      })();
    }
  }, [value]);

  return userLoading == false ? (
    <div className="w-full relative">
      <label
        htmlFor={name}
        className="block text-gray-800 font-semibold text-sm capitalize"
      >
        Enter {item} {require && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-2">
        <input type="hidden" name={name} value={vehicleId} />
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
          placeholder={`${item}`}
          disabled={disabled}
          required={require}
          autoComplete="off"
        />
      </div>
      {suggestedData != null && (
        <div className="absolute top-20 w-full rounded-md px-3 py-2 bg-white border-2 z-30">
          <ul>
            {suggestedData?.length > 0 ? (
              suggestedData?.map((item) => (
                <li
                  key={item?._id}
                  className="my-2 cursor-pointer"
                  onClick={() => handleSelectUserById(item)}
                >
                  {item?.vehicleName} | {item?.vehicleNumber}
                </li>
              ))
            ) : (
              <li className="my-2 cursor-pointer italic text-gray-400">
                no vehicle found.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  ) : (
    <PreLoader />
  );
};

export default InputVehicleSearch;
