import { useDispatch, useSelector } from "react-redux";
import { toggleFilterSideBar } from "../../Redux/SideBarSlice/SideBarSlice";
import Input from "../InputAndDropdown/Input";
import FilterRadioInput from "./FilterRadioInput";
import { getData } from "../../Data/index";
import { fetchVehicleMasterData } from "../../Redux/VehicleSlice/VehicleSlice";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { useEffect, useState } from "react";
import PreLoader from "../../components/Skeleton/PreLoader";

const FilterSideBar = () => {
  const dispatch = useDispatch();
  const { isFilterOpen } = useSelector((state) => state.sideBar);
  const { page, limit } = useSelector((state) => state.pagination);
  const { token } = useSelector((state) => state.user);
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(false);

  //booking status  list
  const filterMenuList = [
    { title: "All", searchTag: "" },
    { title: "Pending (Ride)", searchTag: "rideStatus=pending" },
    { title: "ongoing (Ride)", searchTag: "rideStatus=ongoing" },
    { title: "Completed (Ride)", searchTag: "rideStatus=completed" },
    { title: "cancelled (Ride)", searchTag: "rideStatus=canceled" },
    { title: "cancelled (Booking)", searchTag: "bookingStatus=canceled" },
    { title: "Extended (Booking)", searchTag: "bookingStatus=extended" },
    { title: "Done (Booking)", searchTag: "bookingStatus=done" },
    { title: "Failed (Payment)", searchTag: "paymentStatus=failed" },
    { title: "Refunded (Payment)", searchTag: "paymentStatus=refunded" },
    { title: "Full Paid (Payment)", searchTag: "paymentStatus=paid" },
    {
      title: "Partially Paid (Payment)",
      searchTag: "paymentStatus=partiallyPay",
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

  // change the data based on page
  useEffect(() => {
    if (location.pathname === "/all-bookings") {
      setMenuList(filterMenuList);
    } else {
      setMenuList(filterUserMenuList);
    }
  }, []);

  //   search data based on flags
  const searchDataBasedOnFilters = async (searchTerm) => {
    try {
      setLoading(true);
      // creating endpoint based on filter type whether it is date or flag
      const userType =
        location?.pathname === "/all-users"
          ? "userType=customer"
          : "userType=manager";
      const endpoint =
        location?.pathname === "/all-bookings"
          ? searchTerm !== ""
            ? `/getBooking?${
                searchTerm?.includes("Status=") ? "" : "search="
              }${searchTerm}&page=${page}&limit=${limit}`
            : `/getBooking?page=${page}&limit=${limit}`
          : searchTerm !== ""
          ? `/getAllUsers?${
              searchTerm?.includes("=") ? "" : "search="
            }${searchTerm}&${userType}&page=${page}&limit=${limit}`
          : `/getBooking?${userType}&page=${page}&limit=${limit}`;
      // getting response
      const response = await getData(endpoint, token);
      if (response?.status === 200) {
        dispatch(toggleFilterSideBar());
        return dispatch(fetchVehicleMasterData(response));
      } else {
        return handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed w-full z-50 top-0 right-0 ${
        isFilterOpen ? "bg-black bg-opacity-50" : "hidden"
      } transition-all duration-300 ease-in-out`}
    >
      {loading && <PreLoader />}
      <div
        className={`shadow-lg min-h-screen dark:shadow-gray-500 bg-white border-r-2 border-gray-200 w-full lg:w-[25%] lg:float-right ${
          isFilterOpen ? "translate-x-[0]" : "translate-x-[100%]"
        } transition-all duration-300 ease-in-out`}
      >
        {/* close button  */}
        <div className="flex items-center justify-between px-5 py-4 border-b-2">
          <h2 className="text-md lg:text-xl uppercase text-theme font-semibold">
            Filters
          </h2>
          <button
            className="border border-gray-300 rounded-lg p-2 dark:border-gray-100"
            title="close"
            onClick={() => dispatch(toggleFilterSideBar())}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="stroke-black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div
          className="px-3.5 py-3 overflow-y-scroll no-scrollbar"
          style={{ height: "calc(100vh - 88px)" }}
        >
          {location.pathname === "/all-bookings" && (
            <div className="mb-3">
              <Input
                item={"startDateAndTime"}
                type="date"
                onChangeFilterFun={searchDataBasedOnFilters}
              />
            </div>
          )}

          <h2 className="font-semibold uppercase mb-2">Status:</h2>
          <ul className="leading-8">
            {menuList &&
              menuList?.length > 0 &&
              menuList?.map((item, index) => (
                <li key={index}>
                  <FilterRadioInput
                    title={item?.title}
                    searchTag={item?.searchTag}
                    onChangeFn={
                      searchDataBasedOnFilters && searchDataBasedOnFilters
                    }
                  />
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FilterSideBar;
