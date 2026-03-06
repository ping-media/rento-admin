import { useEffect, useRef, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import userImage from "../../assets/logo/user.png";
import { toggleSideBar } from "../../Redux/SideBarSlice/SideBarSlice";
import { tableIcons } from "../../Data/Icons";
import HeaderMenuList from "./HeaderMenuList";
import { useLocation, useParams } from "react-router-dom";
import BackButton from "../../components/Buttons/BackButton";
import TitleAndButton from "./TitleAndButton";

const Header = () => {
  const { id } = useParams();
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();
  const adminRef = useRef(null);
  const { loggedInRole, userStation } = useSelector((state) => state.user);
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const location = useLocation();

  const isIDBasedPage =
    (id ?? "")?.trim() !== "" ||
    location.pathname.includes("/add-new") ||
    location.pathname === "/dashboard";

  //for dropdown menu
  useEffect(() => {
    if (isVisible) {
      setIsVisible(!isVisible);
    }
  }, [window.location.href]);

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // for closing dropdown menu when user click outside anywhere on screen
  const handleClickOutside = (event) => {
    if (adminRef.current && !adminRef.current.contains(event.target)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header>
      <div className="flex items-center justify-between px-5 py-1.5 shadow bg-white">
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
          {loggedInRole &&
            loggedInRole === "manager" &&
            !location.pathname.includes("/all-bookings/details/") && (
              <div className="relative capitalize hover:shadow-none shadow-md rounded-xl cursor-pointer flex items-center gap-2 px-4 py-2.5 lg:py-3 dark:bg-gray-700">
                {tableIcons?.map}{" "}
                {userStation?.stationName || "No Station Assign"}
              </div>
            )}

          <button
            className="relative border-2 rounded-full hover:shadow-none shadow-md cursor-pointer flex items-center gap-2 p-1.5 dark:bg-gray-700"
            ref={adminRef}
            onClick={handleToggleVisibility}
          >
            <img
              src={userImage}
              className="w-8 h-8 rounded-xl"
              loading="lazy"
              alt="USERIMAGE"
            />
            {isVisible && <HeaderMenuList />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
