import { useEffect, useState } from "react";
import { fetchUserDataBasedOnQuery } from "../../Data/Function";
import { useDispatch, useSelector } from "react-redux";
import {
  addTempVehicleData,
  removeTempVehicleData,
} from "../../Redux/VehicleSlice/VehicleSlice";
import { getData } from "../../Data";
import PreLoader from "../Skeleton/PreLoader";

const InputSearch = ({
  item,
  value = "",
  type = "text",
  disabled = false,
  require = false,
  name,
  token,
}) => {
  const [userId, setUserId] = useState(value);
  const [inputValue, setInputValue] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const { tempVehicleData } = useSelector((state) => state.vehicles);
  const dispatch = useDispatch();

  // search user data based on query entered
  const handleSelectUser = async (e) => {
    const value = e.target.value;
    setInputValue(value);
    // remove data if there is not search query
    if (value?.length == 0) {
      dispatch(removeTempVehicleData());
    }
    // Clear the previous timeout to prevent immediate API calls
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    // Set a new timeout to call fetchData after 500ms
    const newTimeoutId = setTimeout(async () => {
      if (value) {
        const data = await fetchUserDataBasedOnQuery(
          `/getAllUsers?search=${value}`,
          token
        );
        dispatch(addTempVehicleData(data));
      }
    }, 300);
    // Store the timeout ID to clear it if the user types again before 500ms
    setTimeoutId(newTimeoutId);
  };

  // setting user data to input
  const handleSelectUserById = (item) => {
    setUserId(item?._id);
    setInputValue(`${item?.firstName} | ${item?.contact} | ${item?.userType}`);
    dispatch(removeTempVehicleData());
  };

  // when editing the user
  useEffect(() => {
    if (value != "") {
      (async () => {
        setUserLoading(true);
        const response = await getData(`/getAllUsers?_id=${value}`, token);
        if (response.status == 200) {
          const data = response?.data;
          setInputValue(
            `${data[0]?.firstName} | ${data[0]?.contact} | ${data[0]?.userType}`
          );
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
        <input type="hidden" name={name} value={userId} />
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
      {tempVehicleData != null && (
        <div className="absolute top-20 w-full rounded-md px-3 py-2 bg-white border-2 z-30">
          <ul>
            {tempVehicleData?.length > 0 ? (
              tempVehicleData?.map((item) => (
                <li
                  key={item?._id}
                  className="my-2 cursor-pointer text-gray-500"
                  onClick={() => handleSelectUserById(item)}
                >
                  {item?.firstName} {item?.lastName} | {item?.contact} |{" "}
                  {item?.userType}
                </li>
              ))
            ) : (
              <li className="my-2 cursor-pointer italic text-gray-400">
                no user found.
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

export default InputSearch;
