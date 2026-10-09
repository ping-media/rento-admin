import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSideBar } from "../../Redux/SideBarSlice/SideBarSlice";
import { tableIcons } from "../../Data/Icons";
import { Link, useLocation, useParams } from "react-router-dom";
import BackButton from "../../components/Buttons/BackButton";
import TitleAndButton from "./TitleAndButton";
import useListParams from "../../hooks/use-list-params";
import { LogoutBtn } from "./HeaderMenuList";

const NON_TITLE_PAGE = [
  "/dashboard",
  "all-users/notifications",
  "/profile",
  "/settings",
];

const isDev = import.meta.env.VITE_ENV === "development";

const Header = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loggedInRole, userStation } = useSelector((state) => state.user);
  const { filters: urlFilters, clearAll } = useListParams();
  const filters = urlFilters || null;
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const location = useLocation();

  const isIDBasedPage =
    (id ?? "")?.trim() !== "" ||
    location.pathname.includes("/add-new") ||
    NON_TITLE_PAGE.some((page) => location.pathname.startsWith(page));

  const showClearFilters =
    location.pathname === "/all-bookings" && filters !== null;

  return (
    <header>
      <div className="flex items-center justify-between gap-1.5 sm:gap-0 px-4 py-1.5 shadow bg-white min-h-14">
        {/* hamburger menu  */}
        <div className="flex items-center gap-4">
          <button
            className="group block lg:hidden"
            onClick={() => dispatch(toggleSideBar())}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              className="stroke-black group-hover:stroke-theme transition duration-200 ease-in-out"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {!isIDBasedPage && <TitleAndButton className="flex md:hidden" />}

          {/* for showing booking id in sidebar  */}
          {location.pathname.includes("/all-bookings/details/") && (
            <>
              <BackButton endpoint={"/all-bookings"} />
              <div className="relative capitalize shadow-md rounded-xl flex items-center gap-2 px-4 py-2.5 lg:py-3 dark:bg-gray-700">
                <p className="text-theme text-base uppercase font-medium">
                  Booking Id:
                </p>
                <p className="text-base">
                  {vehicleMaster && vehicleMaster?.length > 0
                    ? vehicleMaster[0]?.bookingId
                    : "--"}
                </p>
              </div>
            </>
          )}
        </div>

        {/* user menu */}
        <div className="flex gap-2 items-center">
          {isDev && !location.pathname.includes("/all-bookings/details/") && (
            <Link
              className="relative hidden sm:flex border-2 rounded-md hover:shadow-none shadow-md cursor-pointer items-center gap-2 p-2 dark:bg-gray-700"
              to={"/logs"}
            >
              View Logs
            </Link>
          )}

          {/* clearing extra filters in booking page */}
          {showClearFilters && (
            <button
              className="relative min-h-10 border-2 rounded-md hover:shadow-none shadow-md cursor-pointer flex items-center gap-0.5 sm:gap-2 p-1 sm:p-2 dark:bg-gray-700 text-sm sm:text-base"
              onClick={clearAll}
            >
              <span className="text-theme">X</span> Clear filters
            </button>
          )}

          {loggedInRole &&
            loggedInRole === "manager" &&
            !location.pathname.includes("/all-bookings/details/") && (
              <div className="relative capitalize hover:shadow-none shadow-md rounded-xl cursor-pointer hidden md:flex items-center gap-2 px-4 py-2.5 lg:py-3 dark:bg-gray-700">
                {tableIcons?.map}{" "}
                {userStation?.stationName || "No Station Assign"}
              </div>
            )}

          <Link
            className={`${location.pathname.includes("/all-bookings/details/") || showClearFilters ? "hidden" : "flex"} border sm:hover:border-theme sm:hover:text-theme bg-white rounded-md shadow-md p-2 lg:p-2.5 items-center transition-all duration-200 ease-in`}
            title="Send push notification"
            to={"/all-users/notifications"}
          >
            <div className="-rotate-45">{tableIcons.send}</div>
            <span className="hidden sm:block ml-1">Push Notification</span>
          </Link>

          <LogoutBtn
            className={`flex sm:hidden p-0 ${showClearFilters ? "hidden" : ""}`}
          />
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
