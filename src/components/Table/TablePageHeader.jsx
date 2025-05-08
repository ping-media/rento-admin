import { Link } from "react-router-dom";
import { formatPathNameToTitle } from "../../utils/index";
import { tableIcons } from "../../Data/Icons";
import BulkActionButtons from "./BulkActionButtons";
import { toggleFilterSideBar } from "../../Redux/SideBarSlice/SideBarSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { bookingSearchList } from "../../Data/commonData";
import { handleChangeSearchType } from "../../Redux/PaginationSlice/PaginationSlice";
import { toggleRefresh } from "../../Redux/VehicleSlice/VehicleSlice";

const TablePageHeader = ({ inputSearchQuery, setInputSearchQuery }) => {
  const { vehiclesFilter } = useSelector((state) => state.pagination);
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);

  // stopping to reload the page
  const handleControlSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    let newCount = 0;

    if (vehiclesFilter.vehicleName !== "") newCount += 1;
    if (vehiclesFilter.search !== "") newCount += 1;
    if (vehiclesFilter.maintenanceType !== "") newCount += 1;

    setCount(newCount);
  }, [vehiclesFilter]);

  // for clearing the input state
  useEffect(() => {
    setInputSearchQuery("");
  }, [location.pathname]);

  return (
    <div className="flex items-center flex-wrap justify-between gap-2 w-full">
      <div className="flex items-center justify-between lg:justify-start gap-2">
        <h1 className="text-xl xl:text-2xl uppercase font-bold text-theme">
          {location.pathname === "/station-master"
            ? formatPathNameToTitle(location.pathname).replace("Master", "")
            : location.pathname === "/all-users"
            ? "All Customers"
            : location.pathname === "/all-plans"
            ? "Plan Master"
            : location.pathname === "/location-master"
            ? "Cities"
            : formatPathNameToTitle(location.pathname)}
        </h1>
        {!(
          location.pathname == "/payments" ||
          location.pathname == "/all-invoices" ||
          location.pathname == "/users-documents" ||
          location.pathname == "/all-users"
        ) && (
          <Link
            className="bg-theme font-semibold text-gray-100 px-2.5 py-1 lg:py-1.5 rounded-md shadow-lg hover:bg-theme-light hover:shadow-md inline-flex items-center gap-1"
            to={location.pathname != "/all-pickup-image" ? "add-new" : "#"}
          >
            {tableIcons.add}
            Add
          </Link>
        )}
        {/* this button is to perform bulk action */}
        {location?.pathname === "/all-vehicles" && <BulkActionButtons />}
      </div>
      {!(location.pathname == "/users-documents") && (
        <div className="flex items-center flex-wrap lg:flex-nowrap gap-2">
          <div className="w-full bg-white rounded-md shadow-lg">
            <form
              onSubmit={handleControlSubmit}
              className="flex items-center justify-center p-1 lg:p-2"
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
              {location.pathname !== "/all-bookings" && (
                <button
                  type="submit"
                  className="bg-gray-800 text-white rounded-md px-3 py-1 lg:px-4 lg:py-1 ml-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
                >
                  {tableIcons.search}
                </button>
              )}
              {location.pathname === "/all-bookings" && (
                <div
                  className={`${
                    location.pathname === "/all-bookings" ? "" : ""
                  } bg-gray-800 text-white rounded-md p-2 lg:px-2 lg:py-1 ml-1 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50`}
                >
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
          {/* refresh button  */}
          <button
            className="border hover:border-theme hover:text-theme bg-white rounded-md shadow-md p-2 lg:p-2.5 flex items-center transition-all duration-200 ease-in"
            title="Refresh"
            onClick={() => dispatch(toggleRefresh())}
          >
            {tableIcons?.refresh}{" "}
            <span className="block ml-1 lg:hidden text-sm">Refresh</span>
          </button>
          {/* filters  */}
          {(location.pathname === "/all-users" ||
            location.pathname === "/all-managers" ||
            location.pathname === "/all-bookings" ||
            location.pathname === "/all-vehicles") && (
            <button
              className="border hover:border-theme hover:text-theme bg-white rounded-md shadow-md p-1.5 lg:p-2.5 flex items-center transition-all duration-200 ease-in relative"
              title="filters"
              onClick={() => dispatch(toggleFilterSideBar())}
            >
              {count > 0 && (
                <span className="text-sm absolute -top-3 -right-2 bg-theme text-white w-7 h-7 p-1 rounded-full">
                  {count}
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
