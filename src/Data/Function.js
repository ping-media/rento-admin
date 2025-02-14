import { toggleClearModals } from "../Redux/SideBarSlice/SideBarSlice";
import {
  getData,
  getFullData,
  handleAdminLogin,
  postData,
  postDataWithRetry,
} from ".";
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
  SetLoggedInRole,
  updateCurrentUser,
} from "../Redux/UserSlice/UserSlice";
import {
  addTimeLineData,
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
        // return console.log(response?.data);
        // setting roles
        dispatch(
          SetLoggedInRole({
            loggedInRole: response?.data?.userType,
            userStation: response?.Station,
          })
        );
        handleAsyncError(dispatch, "Login Successfully", "success");
        // decrypting the user data and setting data
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
const fetchDashboardData = async (dispatch, token, roleBaseFilter) => {
  try {
    dispatch(handleLoadingDashboardData());
    const [dashboardResponse, paymentResponse] = await Promise.all([
      getData(`/getAllDataCount${roleBaseFilter}`, token),
      getData(`/getGraphData${roleBaseFilter}`, token),
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

const fetchVehicleMasterWithPagination = debounce(
  async (
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
  },
  50
);

const fetchVehicleMasterById = debounce(
  async (dispatch, id, token, endpoint, secondEndpoint = "") => {
    try {
      dispatch(fetchVehicleStart());
      const response = await getData(
        `${endpoint}${
          location.pathname !== "/profile" && endpoint.includes("?userId")
            ? ""
            : "?_id="
        }${id}`,
        token
      );
      if (response?.status == 200) {
        if (secondEndpoint !== "") {
          const timeLineResponse = await getData(
            `${secondEndpoint}?bookingId=${response?.data[0]?.bookingId}`,
            token
          );
          dispatch(addTimeLineData(timeLineResponse?.data));
        }
        dispatch(fetchVehicleMasterData(response?.data));
      } else {
        dispatch(fetchVehicleMasterData([]));
        dispatch(fetchVehicleEnd());
      }
    } catch (error) {
      dispatch(fetchVehicleEnd());
      handleAsyncError(dispatch, error?.message);
    }
  },
  50
);

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

  // for (const [key, value] of Object.entries(result)) {
  //   console.log(`${key}: ${value}`);
  // }
  // return;

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
  // console.log(endpoint, result);
  try {
    const response = await postData(endpoint, result, token);
    // console.log(response);
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
  userType,
  token,
  navigate
) => {
  event.preventDefault();
  setFormLoading(true);
  const response = new FormData(event.target);
  let result = Object.fromEntries(response.entries());
  // if there is id that means it we are updating the data and if there is not id than creating new data
  if (id) {
    result = Object.assign(result, { _id: id, userType: userType });
  }

  const endpoint = `/signup?_id=${id}`;
  try {
    const response = await postData(endpoint, result, token);
    if (response?.status != 200) {
      handleAsyncError(dispatch, response?.message);
    } else {
      dispatch(updateCurrentUser(result));
      dispatch(handleSignIn(response?.data));
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
  token,
  setLoading
) => {
  try {
    setLoading && setLoading(true);
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
    if (stationResponse?.status === 200) {
      return setStationData(stationResponse?.data);
    }
  } catch (error) {
    return console.error(error?.message);
  } finally {
    setLoading && setLoading(false);
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

const cancelBookingById = async (
  id,
  data,
  token,
  endpoint = "/createBooking"
) => {
  try {
    const response = await postData(
      endpoint === "/createBooking" ? `/createBooking?_id=${id}` : endpoint,
      data,
      token
    );
    if (response?.status !== 200) {
      return response?.message;
    }
    return true;
  } catch (error) {
    return error?.message;
  }
};

const updateTimeLine = async (data, token) => {
  const { _id, bookingPrice } = data;
  // checking whether user applied Discount or not
  const subAmount =
    bookingPrice?.discountTotalPrice && bookingPrice?.discountTotalPrice > 0
      ? bookingPrice?.discountTotalPrice
      : bookingPrice?.totalPrice;
  // checking whether user is paying full payment or half
  const finalAmount =
    bookingPrice?.userPaid && bookingPrice?.userPaid > 0
      ? bookingPrice?.userPaid
      : subAmount;
  // setting paymentStatus
  const paymentStatus =
    bookingPrice?.userPaid && bookingPrice?.userPaid > 0
      ? "partiallyPay"
      : "paid";

  // updating the timeline for booking
  const timeLineData = {
    currentBooking_id: _id,
    timeLine: [
      {
        title: "Payment Link Created",
        date: new Date().toLocaleString(),
        PaymentLink: `${
          import.meta.env.VITE_FRONTEND_URL
        }/payment?id=${_id}&paymentStatus=${paymentStatus}&finalAmount=${finalAmount}`,
        paymentAmount: finalAmount,
      },
    ],
  };
  await postData("/createTimeline", timeLineData, token);
  return timeLineData;
};

const updateTimeLineForPayment = async (
  data,
  token,
  title,
  isvehicleNumbers = ""
) => {
  const { _id, extendAmount, bookingPrice, bookingId } = data;

  const finalAmount =
    (extendAmount && extendAmount?.amount) ||
    (bookingPrice &&
      Number(
        bookingPrice?.diffAmount[bookingPrice?.diffAmount?.length - 1]?.amount
      ));
  // creating order id for the payment when finalAmount is greater than 0
  let orderId = "";
  if (finalAmount > 0) {
    let generateOrderId = await postDataWithRetry(
      "/createOrderId",
      { amount: finalAmount, booking_id: bookingId },
      token
    );
    if (generateOrderId?.status === "created") {
      orderId = generateOrderId?.id;
    } else {
      return "unable to update timeline for booking";
    }
  }

  // creating payment link only when amount is greater than 0
  const paymentLink =
    finalAmount > 0
      ? `${
          import.meta.env.VITE_FRONTEND_URL
        }/payment?id=${_id}&order=${orderId}&for=${
          isvehicleNumbers !== "" ? "change" : "extend"
        }&finalAmount=${finalAmount}`
      : "";

  // updating the timeline for booking
  const timeLineData = {
    currentBooking_id: _id,
    timeLine: [
      {
        title: title,
        date: new Date().toLocaleString(),
        PaymentLink: paymentLink,
        paymentAmount: finalAmount,
        changeToVehicle: isvehicleNumbers || "",
        id:
          extendAmount?.id ||
          bookingPrice?.diffAmount[bookingPrice?.diffAmount?.length - 1]?.id ||
          0,
      },
    ],
  };
  await postData("/createTimeline", timeLineData, token);
  return timeLineData;
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
  updateTimeLine,
  updateTimeLineForPayment,
};
