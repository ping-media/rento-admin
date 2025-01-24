import { useEffect, useRef, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import userImage from "../../assets/logo/user.png";
import {
  toggleModal,
  toggleSideBar,
} from "../../Redux/SideBarSlice/SideBarSlice";
import { Link } from "react-router-dom";
import { tableIcons } from "../../Data/Icons";

const Header = () => {
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();
  const adminRef = useRef(null);
  const { currentUser, loggedInRole, userStation } = useSelector(
    (state) => state.user
  );

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
      <div className="flex items-center justify-between px-5 lg:px-10 py-2.5 shadow dark:shadow-gray-200 bg-white">
        {/* <div className="flex items-center justify-between px-5 lg:px-10 py-4 shadow dark:shadow-gray-200 bg-theme-seconday-dark"> */}
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
        </div>
        {/* user menu */}
        <div className="flex gap-2 items-center">
          {loggedInRole && loggedInRole === "manager" && (
            <div className="relative hover:shadow-none shadow-md rounded-xl cursor-pointer flex items-center gap-2 px-4 py-2.5 lg:py-4 dark:bg-gray-700">
              {tableIcons?.map} {userStation?.stationName}
            </div>
          )}
          <button
            className="relative hover:shadow-none shadow-md rounded-xl cursor-pointer flex items-center gap-2 px-4 py-1 dark:bg-gray-700"
            ref={adminRef}
            onClick={handleToggleVisibility}
          >
            <img
              src={userImage}
              className="w-8 h-8 rounded-xl"
              loading="lazy"
              alt="USERIMAGE"
            />
            <div className="hidden md:block lg:block text-left">
              <h2 className="font-semibold text-md lg:text-lg capitalize dark:text-gray-100">
                {currentUser?.firstName}
              </h2>
              <small className="float-left text-gray-400 text-sm lg:text-md text-gray-200">
                {currentUser?.userType}
              </small>
            </div>
            {isVisible && (
              <div className="absolute w-40 top-16 right-0 z-10 bg-white flex flex-col items-center text-left gap-2 border border-gray-200 rounded-xl p-2 dark:bg-gray-800 dark:border-none">
                <p className="lg:hidden border-b-2 text-center font-semibold md:hidden py-1.5 hover:bg-theme hover:text-white transition duration-200 ease-in-ou w-full capitalize">
                  {currentUser?.firstName}
                </p>
                <Link
                  className="py-1.5 px-1.5 hover:bg-theme rounded-md hover:text-white transition duration-200 ease-in-ou w-full"
                  to={"/dashboard"}
                >
                  View Dashboard
                </Link>
                <Link
                  className="py-1.5 px-1.5 hover:bg-theme rounded-md hover:text-white transition duration-200 ease-in-out w-full"
                  to={"/profile"}
                >
                  View profile
                </Link>
                <Link
                  className="py-1.5 px-1.5 hover:bg-theme rounded-md hover:text-white transition duration-200 ease-in-ou w-full"
                  onClick={() => dispatch(toggleModal())}
                >
                  Logout
                </Link>
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
