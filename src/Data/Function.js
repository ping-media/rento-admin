import { getData, handleAdminLogin, postData } from ".";
import {
  handleDashboardData,
  handleLoadingDashboardData,
  resetDashboardData,
} from "../Redux/DashboardSlice/DashboardSlice";
import {
  handleLoadingUserData,
  handleSetToken,
  handleSignIn,
} from "../Redux/UserSlice/UserSlice";
import {
  fetchVehicleEnd,
  fetchVehicleMasterData,
  fetchVehicleStart,
} from "../Redux/VehicleSlice/VehicleSlice";
import { modifyUrl, removeAfterSecondSlash } from "../utils";
import { handleAsyncError } from "../utils/Helper/handleAsyncError";
import { endPointBasedOnURL } from "./commonData";

// for login
const handleOtpLogin = async (event, dispatch, navigate, setLoading) => {
  event.preventDefault();
  setLoading(true);
  const response = new FormData(event.target);
  const result = Object.fromEntries(response.entries());
  // both fields should not be empty
  if (result?.email != "" && result?.password != "") {
    // handling login
    try {
      dispatch(handleLoadingUserData());
      const response = await handleAdminLogin("/adminLogin", result);
      if (response?.status == 200) {
        handleAsyncError(dispatch, response?.message, "success");
        dispatch(handleSetToken(response?.token));
        dispatch(handleSignIn(response?.data));
        navigate("/dashboard");
      } else {
        handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      handleAsyncError(dispatch, error?.message);
    }
  } else {
    handleAsyncError(dispatch, "Invalid Email & Password");
  }
  return setLoading(false);
};

// for fetching data & posting data
const fetchDashboardData = async (dispatch, token) => {
  try {
    dispatch(handleLoadingDashboardData());
    const response = await getData("/getAllDataCount", token);
    if (response?.status == 200) {
      dispatch(handleDashboardData(response?.data));
    } else {
      dispatch(resetDashboardData());
      handleAsyncError(dispatch, response?.message);
    }
  } catch (error) {
    dispatch(resetDashboardData());
    handleAsyncError(dispatch, error?.message);
  }
};

const fetchVehicleMaster = async (dispatch, token, endpoint) => {
  try {
    dispatch(fetchVehicleStart());
    const response = await getData(endpoint, token);
    if (response?.status == 200) {
      dispatch(fetchVehicleMasterData(response?.data));
    } else {
      dispatch(fetchVehicleEnd());
      handleAsyncError(dispatch, response?.message);
    }
  } catch (error) {
    dispatch(fetchVehicleEnd());
    handleAsyncError(dispatch, error?.message);
  }
};

const fetchVehicleMasterById = async (dispatch, id, token, endpoint) => {
  try {
    dispatch(fetchVehicleStart());
    const response = await getData(`${endpoint}?_id=${id}`, token);
    if (response?.status == 200) {
      dispatch(fetchVehicleMasterData(response?.data));
    } else {
      dispatch(fetchVehicleEnd());
      handleAsyncError(dispatch, response?.message);
    }
  } catch (error) {
    dispatch(fetchVehicleEnd());
    handleAsyncError(dispatch, error?.message);
  }
};

const handleCreateAndUpdateVehicle = async (
  event,
  dispatch,
  setFormLoading,
  id,
  token,
  navigate
) => {
  event.preventDefault();
  setFormLoading(true);
  const response = new FormData(event.target);
  let result = Object.fromEntries(response.entries());
  // if there is id that means it we are updating the data and if there is not id than creating new data
  if (id) {
    result = Object.assign(result, { _id: id });
  }
  // we want to pass pincode as stationId
  else if (result?.pinCode) {
    result = Object.assign(result, { stationId: result?.pinCode });
  }
  const endpoint = id
    ? `${
        endPointBasedOnURL[
          modifyUrl(location?.pathname) +
            `${
              modifyUrl(location.pathname) == "vehicle-master/" ||
              modifyUrl(location.pathname) == "location-master/"
                ? "update"
                : ""
            }`
        ]
      }?_id=${id}`
    : `${endPointBasedOnURL[modifyUrl(location?.pathname)]}`;
  console.log(endpoint, result);
  try {
    const response = await postData(endpoint, result, token);
    console.log(response);
    if (response?.status != 200) {
      handleAsyncError(dispatch, response?.message);
    } else {
      handleAsyncError(dispatch, response?.message, "success");
      navigate(removeAfterSecondSlash(location?.pathname));
    }
  } catch (error) {
    handleAsyncError(dispatch, error?.message);
  }
  return setFormLoading(false);
};

export {
  handleOtpLogin,
  fetchDashboardData,
  fetchVehicleMaster,
  fetchVehicleMasterById,
  handleCreateAndUpdateVehicle,
};
