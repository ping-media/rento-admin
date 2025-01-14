import { toggleClearModals } from "../Redux/SideBarSlice/SideBarSlice";
import { getData, getFullData, handleAdminLogin, postData } from ".";
import {
  handleDashboardData,
  handleLoadingDashboardData,
  resetDashboardData,
} from "../Redux/DashboardSlice/DashboardSlice";
import {
  handleLoadingUserData,
  handleSetToken,
  handleSignIn,
  handleSignOut,
} from "../Redux/UserSlice/UserSlice";
import {
  fetchVehicleEnd,
  fetchVehicleMasterData,
  fetchVehicleStart,
} from "../Redux/VehicleSlice/VehicleSlice";
import { modifyUrl, removeAfterSecondSlash } from "../utils";
import { handleAsyncError } from "../utils/Helper/handleAsyncError";
import { endPointBasedOnURL } from "./commonData";
import { debounce } from "lodash";

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
    const [dashboardResponse, paymentResponse] = await Promise.all([
      getData("/getAllDataCount", token),
      getData("/getGraphData", token),
      // getData("/getAllUsers", token),
    ]);

    dispatch(
      handleDashboardData({
        dashboard: dashboardResponse?.data,
        payments: paymentResponse?.data,
        // users: userResponse?.data,
      })
    );
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
      // console.log(response);
      dispatch(fetchVehicleMasterData(response?.data));
    } else {
      dispatch(fetchVehicleEnd());
      // handleAsyncError(dispatch, response?.message);
    }
  } catch (error) {
    dispatch(fetchVehicleEnd());
    handleAsyncError(dispatch, error?.message);
  }
};

const fetchVehicleMasterWithPagination = async (
  dispatch,
  token,
  endpoint,
  isSearchTermPresent,
  page,
  limit,
  searchBasedOnFilter = ""
) => {
  try {
    dispatch(fetchVehicleStart());
    // setting dynamic route
    const dynamicEndpoint =
      isSearchTermPresent !== null
        ? searchBasedOnFilter === ""
          ? `${endpoint}?search=${isSearchTermPresent}&page=${page}&limit=${limit}`
          : `${endpoint}?search=${isSearchTermPresent}&${searchBasedOnFilter}&page=${page}&limit=${limit}`
        : searchBasedOnFilter === ""
        ? `${endpoint}?page=${page}&limit=${limit}`
        : `${endpoint}?${searchBasedOnFilter}&page=${page}&limit=${limit}`;

    const response = await getFullData(dynamicEndpoint, token);
    if (response?.status == 200) {
      dispatch(fetchVehicleMasterData(response?.data));
    } else {
      dispatch(fetchVehicleEnd());
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
  token,
  navigate,
  tempIds,
  removeTempIds,
  id
) => {
  event.preventDefault();
  setFormLoading(true);
  const response = new FormData(event.target);
  let result = Object.fromEntries(response.entries());
  // if there is id that means it we are updating the data and if there is not id than creating new data
  if (id) {
    result = Object.assign(result, { _id: id });
  }
  if (tempIds && tempIds.length > 0) {
    result = Object.assign(result, { vehiclePlan: tempIds });
    dispatch(removeTempIds());
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
    if (response?.status !== 200) {
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

const handleUpdateAdminProfile = async (
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

  const endpoint = `/signup?_id=${id}`;
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

const fetchStationBasedOnLocation = async (
  vehicleMaster,
  isLocationSelected,
  setStationData,
  token
) => {
  let stationResponse;
  if (vehicleMaster && vehicleMaster?.length == 1) {
    stationResponse = await getData(
      `/getStationData?locationId=${isLocationSelected}`,
      token
    );
  } else {
    stationResponse = await getData(
      `/getStationData?locationId=${isLocationSelected}`,
      token
    );
  }
  if (stationResponse?.status == 200) {
    return setStationData(stationResponse?.data);
  }
};

const tenYearBeforeCurrentYear = () => {
  let modals = [];
  const currentYear = new Date().getFullYear();
  const tenYearsBefore = currentYear - 10;
  for (let i = currentYear; i > tenYearsBefore; i--) {
    modals.push(i);
  }
  return modals;
};

const fetchUserDataBasedOnQuery = async (endpoint, token) => {
  const userResponse = await getData(endpoint, token);
  if (userResponse) {
    return userResponse?.data;
  }
};

const handleGenerateInvoice = async (
  dispatch,
  id,
  token,
  setLoadingStates,
  bookingData,
  handleInvoiceCreated
) => {
  if (!id && !bookingData)
    return handleAsyncError(dispatch, "failed to create Invoice! try again.");
  // let currentBooking = bookingData?.find((item) => item?._id == id);
  let currentBooking = bookingData;
  if (!currentBooking)
    return handleAsyncError(dispatch, "failed to create Invoice! try again");
  const updatedBooking = {
    ...currentBooking,
    bookingPrice: {
      ...currentBooking.bookingPrice,
      isInvoiceCreated: true,
    },
  };
  setLoadingStates((prevState) => ({
    ...prevState,
    [id]: true,
  }));
  try {
    const response = await postData(
      "/createInvoice",
      { currentBookingId: id },
      token
    );
    if (response?.status === 200) {
      dispatch(handleInvoiceCreated(updatedBooking));
      handleAsyncError(dispatch, response?.message, "success");
    } else {
      handleAsyncError(dispatch, response?.message);
    }
  } catch (error) {
    console.log(error);
  } finally {
    setLoadingStates((prevState) => ({
      ...prevState,
      [id]: false,
    }));
  }
};

const validateUser = debounce(
  async (token, handleLogoutUser, dispatch, setPreLoaderLoading) => {
    try {
      setPreLoaderLoading && setPreLoaderLoading(true);
      if (!token) return;
      const response = await postData(`/validedToken`, { token: token }, token);
      const isUserValid = response?.isUserValid;
      if (isUserValid === true) {
        if (location.pathname == "/") return navigate("/dashboard");
      } else {
        handleLogoutUser(dispatch);
      }
    } catch (error) {
      handleLogoutUser(dispatch);
    } finally {
      setPreLoaderLoading && setPreLoaderLoading(false);
    }
  },
  60
);

const handleLogoutUser = (dispatch) => {
  dispatch(handleSignOut());
  dispatch(toggleClearModals());
};

const handleDeleteAndEditAllData = async (
  data,
  operation,
  handleAsyncError,
  changeTempLoadingTrue,
  changeTempLoadingFalse,
  dispatch,
  removeTempIds,
  restvehicleMaster,
  token,
  handleIsHeaderChecked
) => {
  dispatch(changeTempLoadingTrue(operation));
  try {
    const response = await postData("/updateMultipleVehicles", data, token);
    if (response?.status == 200) {
      dispatch(removeTempIds());
      dispatch(restvehicleMaster());
      handleIsHeaderChecked && dispatch(handleIsHeaderChecked(false));
      return handleAsyncError(dispatch, response?.message, "success");
    } else {
      return handleAsyncError(dispatch, response?.message);
    }
  } catch (error) {
    return handleAsyncError(dispatch, "something went wrong! try again.");
  } finally {
    dispatch(changeTempLoadingFalse());
  }
};

const cancelBookingById = async (id, data, token) => {
  try {
    const response = await postData(`/createBooking?_id=${id}`, data, token);
    if (response?.status !== 200) {
      return response?.message;
    }
    return true;
  } catch (error) {
    return error?.message;
  }
};

export {
  handleOtpLogin,
  fetchDashboardData,
  fetchVehicleMaster,
  fetchVehicleMasterById,
  handleCreateAndUpdateVehicle,
  fetchStationBasedOnLocation,
  tenYearBeforeCurrentYear,
  handleUpdateAdminProfile,
  fetchUserDataBasedOnQuery,
  handleGenerateInvoice,
  fetchVehicleMasterWithPagination,
  validateUser,
  handleLogoutUser,
  handleDeleteAndEditAllData,
  cancelBookingById,
};
