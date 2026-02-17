import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveFilterName,
  setFilters,
  setSearch,
  setVehicleName,
} from "../Redux/PaginationSlice/PaginationSlice";
import { getData } from "../Data/index";
import { toggleFilterSideBar } from "../Redux/SideBarSlice/SideBarSlice";
import { fetchVehicleMasterData } from "../Redux/VehicleSlice/VehicleSlice";
import { handleAsyncError } from "../utils/Helper/handleAsyncError";
import { formatDateToISO } from "../utils/index";

const useSidebarFilter = () => {
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [stationName, setStationName] = useState("");
  const { page, limit, vehiclesFilter, activeFilterName } = useSelector(
    (state) => state.pagination,
  );
  const { token, loggedInRole, userStation } = useSelector(
    (state) => state.user,
  );
  const dispatch = useDispatch();

  const todaysDate = formatDateToISO(new Date())
    .replace(".000Z", "Z")
    .split("T")[0];

  const tomorrowDate = formatDateToISO(new Date(Date.now() + 86400000))
    .replace(".000Z", "Z")
    .split("T")[0];

  //booking status  list
  const filterMenuList = [
    { title: "All Bookings", searchTag: "", divider: false },
    {
      title: "Pending Pickups",
      searchTag:
        "rideStatus=pending&sortBy=BookingStartDateAndTime&sortOrder=asc",
      divider: false,
    },
    {
      title: "Pending Drops",
      searchTag:
        "rideStatus=ongoing&sortBy=BookingEndDateAndTime&sortOrder=asc",
      divider: false,
    },
    {
      title: "Today's Pending Pickups",
      searchTag: `search=${todaysDate}&rideStatus=pending&dateCheck=pickup`,
      divider: false,
    },
    {
      title: "Today's Drops",
      searchTag: `search=${todaysDate}&rideStatus=ongoing&dateCheck=dropoff`,
      divider: false,
    },
    {
      title: "Completed Ride",
      searchTag: "rideStatus=completed",
      divider: false,
    },
    {
      title: "cancelled Ride",
      searchTag: "rideStatus=canceled",
      divider: false,
    },
    {
      title: "Tomorrow's Pending Pickups",
      searchTag: `search=${tomorrowDate}&rideStatus=pending&dateCheck=pickup`,
      divider: false,
    },
    {
      title: "Tomorrow's Drops",
      searchTag: `search=${tomorrowDate}&rideStatus=ongoing`,
      divider: false,
    },
    { title: "Extended", searchTag: "bookingStatus=extended", divider: true },
    {
      title: "Today's Cash Bookings",
      searchTag: `search=${todaysDate}&isCash=true&dateCheck=pickup`,
      divider: false,
    },
    {
      title: "All Cash Bookings",
      searchTag: "isCash=true",
      divider: false,
    },
    {
      title: "Failed (Payment)",
      searchTag: "paymentStatus=failed",
      divider: false,
    },
    {
      title: "Refunded (Payment)",
      searchTag: "paymentStatus=refunded",
      divider: false,
    },
    {
      title: "Full Paid (Payment)",
      searchTag: "paymentStatus=paid",
      divider: false,
    },
    {
      title: "Partially Paid (Payment)",
      searchTag: "paymentStatus=partiallyPay",
      divider: false,
    },
  ];

  //user status  list
  const filterUserMenuList = [
    { title: "All", searchTag: "" },
    { title: "kyc Approved (Verified)", searchTag: "kycApproved=yes" },
    { title: "kyc Approved (Not Verified)", searchTag: "kycApproved=no" },
    { title: "Email Verified (Verified)", searchTag: "isEmailVerified=yes" },
    { title: "Email Verified (Not Verified)", searchTag: "isEmailVerified=no" },
    {
      title: "Contact Verified (Verified)",
      searchTag: "isContactVerified=yes",
    },
    {
      title: "Contact Verified (Not Verified)",
      searchTag: "isContactVerified=no",
    },
    { title: "Status (Active)", searchTag: "status=active" },
    { title: "Status (In-Active)", searchTag: "status=inactive" },
  ];

  //   search data based on flags
  const searchDataBasedOnFilters = async (
    searchTerm,
    title,
    isMobile = false,
  ) => {
    try {
      setLoading(true);

      const userType =
        location?.pathname === "/all-users"
          ? "userType=customer"
          : "userType=manager";

      let endpoint;
      let StationId = "";

      if (title) {
        dispatch(setActiveFilterName(title));
      } else {
        dispatch(setActiveFilterName(null));
      }

      if (loggedInRole === "manager") {
        StationId = `stationId=${userStation?.stationId}`;
      }

      if (location?.pathname === "/all-bookings") {
        endpoint =
          StationId !== ""
            ? searchTerm
              ? `/getBooking?${StationId}&${
                  searchTerm?.includes("Status=") ||
                  searchTerm.includes("isCash=")
                    ? ""
                    : "search="
                }${searchTerm}&page=${page}&limit=${limit}`
              : `/getBooking?${StationId}&page=${page}&limit=${limit}`
            : searchTerm
              ? `/getBooking?${
                  searchTerm?.includes("Status=") ||
                  searchTerm.includes("isCash=")
                    ? ""
                    : "search="
                }${searchTerm}&page=${page}&limit=${limit}`
              : `/getBooking?page=${page}&limit=${limit}`;
      } else {
        endpoint = searchTerm
          ? `/getAllUsers?${
              searchTerm?.includes("=") ? "" : "search="
            }${searchTerm}&${userType}&page=${page}&limit=${limit}`
          : `/getBooking?${userType}&page=${page}&limit=${limit}`;
      }

      if (stationName && stationName.trim() !== "") {
        endpoint += `&stationName=${encodeURIComponent(stationName.trim())}`;
      }

      // getting response
      const response = await getData(endpoint, token);
      if (response?.status === 200) {
        if (!isMobile) {
          dispatch(toggleFilterSideBar());
        }
        return dispatch(fetchVehicleMasterData(response));
      } else {
        return handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setLoading(false);
      dispatch(setFilters(searchTerm));
    }
  };

  //   search data based on station Name and vehicle Name
  const handleApplyFilters = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    let result = Object.fromEntries(formData.entries());

    // if (!result.vehicleName && !result.stationName) {
    if (!result.vehicleName && !result.stationId) {
      handleAsyncError(dispatch, "Atleast add one field in order filter data.");
      return;
    }

    if (
      result.vehicleName === vehiclesFilter.vehicleName &&
      result.stationName === vehiclesFilter.stationName
    )
      return;

    try {
      setFormLoading(true);
      if (result.vehicleName !== "" && result.stationName !== "") {
        dispatch(setVehicleName(result.vehicleName));
        dispatch(setSearch(result.stationName));
      } else if (result.vehicleName !== "") {
        dispatch(setVehicleName(result.vehicleName));
      } else if (result.stationName !== "") {
        dispatch(setSearch(result.stationName));
      }
      dispatch(toggleFilterSideBar());
    } catch (error) {
      handleAsyncError(
        dispatch,
        "Unable to find vehicle with filters!. try again",
      );
      return;
    } finally {
      setFormLoading(false);
    }
  };

  return {
    filterMenuList,
    filterUserMenuList,
    searchDataBasedOnFilters,
    handleApplyFilters,
    loading,
    formLoading,
    activeFilterName,
    stationName,
    setStationName,
  };
};

export default useSidebarFilter;
