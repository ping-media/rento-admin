import { Link, useLocation } from "react-router-dom";
import { formatPathNameToTitle } from "../../utils/index";
import { tableIcons } from "../../Data/Icons";
import BulkActionButtons from "./BulkActionButtons";
import { toggleFilterSideBar } from "../../Redux/SideBarSlice/SideBarSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { bookingSearchList } from "../../Data/commonData";
import { handleChangeSearchType } from "../../Redux/PaginationSlice/PaginationSlice";
import useSidebarFilter from "../../hooks/use-sidebar-filter";
import ExportButton from "../../components/ExcelExport/ExportButton";

const ROUTE_TITLES = {
  "/station-master": "Stations",
  "/all-users": "Customers",
  "/all-plans": "Plan Master",
  "/all-vehicles": "Vehicles",
  "/all-bookings": "Bookings",
  "/all-coupons": "Coupons",
  "/all-managers": "Managers",
  "/location-master": "Cities",
  "/all-invoices": "Invoices",
};

const FILTER_ENABLED_ROUTES = [
  "/all-users",
  "/all-managers",
  "/all-bookings",
  "/all-vehicles",
];

const NO_ADD_BUTTON_ROUTES = ["/payments", "/all-invoices", "/users-documents"];

export function getPageTitle(pathname, activeFilterName) {
  // Special dynamic case
  if (pathname.includes("/all-bookings") && activeFilterName) {
    return activeFilterName;
  }

  // Exact match override
  if (ROUTE_TITLES[pathname]) {
    return ROUTE_TITLES[pathname];
  }

  // Default fallback
  return formatPathNameToTitle(pathname);
}

const TablePageHeader = ({
  inputSearchQuery,
  setInputSearchQuery,
  bookingData,
}) => {
  const { vehiclesFilter, activeFilterName } = useSelector(
    (state) => state.pagination,
  );
  const { pathname } = useLocation();
  const { loggedInRole } = useSelector((state) => state.user);
  const { searchDataBasedOnFilters, loading } = useSidebarFilter();
  const dispatch = useDispatch();

  const pageTitle = getPageTitle(pathname, activeFilterName);

  const isBookings = pathname === "/all-bookings";
  const showAddButton = !NO_ADD_BUTTON_ROUTES.includes(pathname);
  const showFilters = FILTER_ENABLED_ROUTES.includes(pathname);
  const showExport =
    loggedInRole === "admin" &&
    ["/all-bookings", "/all-users", "/all-vehicles"].includes(pathname);

  const filterCount = useMemo(() => {
    let count = 0;
    if (vehiclesFilter.vehicleName) count++;
    if (vehiclesFilter.search) count++;
    if (vehiclesFilter.maintenanceType) count++;
    return count;
  }, [vehiclesFilter]);

  // stopping to reload the page
  const handleControlSubmit = (e) => {
    e.preventDefault();
  };

  // for clearing the input state
  useEffect(() => {
    if (!pathname.includes("/details")) {
      setInputSearchQuery("");
    }
  }, [pathname, setInputSearchQuery]);

  return (
    <div className="flex items-center flex-wrap justify-between gap-2 w-full">
      <div className="flex items-center justify-between lg:justify-start gap-2">
        <h1 className="text-xl xl:text-2xl capitalize font-bold text-theme">
          {pageTitle}
        </h1>

        {showAddButton && (
          <Link
            className="bg-theme font-semibold text-gray-100 px-2.5 py-1 lg:py-1.5 rounded-md shadow-lg hover:bg-theme-light hover:shadow-md inline-flex items-center gap-1"
            to={location.pathname != "/all-pickup-image" ? "add-new" : "#"}
          >
            {tableIcons.add}
            Add
          </Link>
        )}
        {/* this button is to perform bulk action */}
        {pathname === "/all-vehicles" && <BulkActionButtons />}
      </div>

      {!(location.pathname == "/users-documents") && (
        <div className="flex items-center flex-wrap lg:flex-nowrap gap-2">
          <div className="w-full bg-white rounded-md shadow-lg">
            <form
              onSubmit={handleControlSubmit}
              className="flex items-center justify-center p-2"
            >
              <input
                type="text"
                placeholder="Search Here.."
                name="searchQuery"
                className="w-full rounded-md p-1 lg:px-2 lg:py-1 focus:outline-none focus:border-transparent"
                value={inputSearchQuery}
                onChange={(e) => setInputSearchQuery(e.target.value)}
                autoComplete="off"
              />
              {/* {location.pathname !== "/all-bookings" && ( */}
              {!isBookings && (
                <button
                  type="submit"
                  className="bg-gray-800 text-white rounded-md px-3 py-1 lg:px-4 lg:py-1 ml-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
                >
                  {tableIcons.search}
                </button>
              )}

              {isBookings && (
                <div className="bg-gray-800 text-white rounded-md p-2 lg:px-2 lg:py-1 ml-1 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">
                  <div className="inset-y-0 w-full my-auto h-4 lg:h-6 flex items-center pr-2 relative">
                    <select
                      className="text-sm lg:text-md outline-none rounded-lg h-full px-2 cursor-pointer font-semibold tracking-wide bg-transparent"
                      onChange={(e) =>
                        dispatch(handleChangeSearchType(e.target.value))
                      }
                    >
                      {bookingSearchList.map((list) => (
                        <option
                          value={list.value}
                          label={list.label}
                          className="cursor-pointer w-full bg-transparent text-gray-500 hover:text-white font-semibold tracking-wide"
                          key={list.label}
                        ></option>
                      ))}
                    </select>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-100">
                      {tableIcons.downArrow}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* export to excel button  */}
          {showExport && <ExportButton data={bookingData} />}

          {/* most used filters button */}
          <button
            className="flex md:hidden border hover:border-theme hover:text-theme bg-white rounded-md shadow-md p-2 lg:p-2.5 items-center transition-all duration-200 ease-in"
            title="pending-pickup"
            disabled={loading}
            onClick={() => {
              searchDataBasedOnFilters(
                "rideStatus=pending&sortBy=BookingStartDateAndTime&sortOrder=asc",
                "Pending Pickups",
                true,
              );
            }}
          >
            Pending Pickups
          </button>
          <button
            className="flex md:hidden border hover:border-theme hover:text-theme bg-white rounded-md shadow-md p-2 lg:p-2.5 items-center transition-all duration-200 ease-in"
            title="pending-dropoff"
            disabled={loading}
            onClick={() => {
              searchDataBasedOnFilters(
                "rideStatus=ongoing&sortBy=BookingEndDateAndTime&sortOrder=asc",
                "Pending Drops",
                true,
              );
            }}
          >
            Pending Drops
          </button>

          {showFilters && (
            <button
              className="border hover:border-theme hover:text-theme bg-white rounded-md shadow-md p-1.5 lg:p-2.5 flex items-center transition-all duration-200 ease-in relative"
              title="filters"
              onClick={() => dispatch(toggleFilterSideBar())}
            >
              {filterCount > 0 && (
                <span className="text-sm absolute -top-3 -right-2 bg-theme text-white w-7 h-7 p-1 rounded-full">
                  {filterCount}
                </span>
              )}
              {tableIcons?.filter} <span className="ml-1">Filters</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TablePageHeader;
