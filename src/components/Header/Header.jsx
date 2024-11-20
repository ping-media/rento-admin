import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import userImage from "../../assets/logo/user.png";
import { useNavigate } from "react-router-dom";
import {
  toggleModal,
  toggleSideBar,
} from "../../Redux/SideBarSlice/SideBarSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faSignOut, faWallet } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
// import { toggleTheme } from "../../Redux/ThemeSlice/ThemeSlice";
import Search from "../SearchBar/Search";

const Header = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adminRef = useRef(null);
  // const { currentUser } = useSelector((state) => state.currentUser);
  const { theme } = useSelector((state) => state.theme);

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

  const currentUser = {
    userProfileImage: "",
    balance: "",
    phone: "",
    userName: "Admin",
    isbusinessPartner: false,
  };
  return (
    <header>
      <div className="flex items-center justify-between px-5 lg:px-10 py-4 shadow dark:shadow-gray-200 bg-theme-black">
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
              className="stroke-white group-hover:stroke-theme transition duration-200 ease-in-out"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <Search />
        </div>
        {/* wallet & admin menu */}
        <div className="flex gap-2 items-center">
          {/* <button className="rounded-xl items-center gap-2 bg-white p-1.5 md:p-3 lg:p-3.5 shadow-md flex dark:bg-gray-800">
            <img
              src={walletImage}
              className="w-8 object-cover border-r-2 p-1"
              alt="WALLET_ICON"
            />
          </button> */}
          <button
            className="relative hover:shadow-none shadow-md rounded-xl cursor-pointer flex items-center gap-2 px-2 py-1 bg-gray-700"
            ref={adminRef}
            onClick={handleToggleVisibility}
          >
            <img
              src={userImage}
              className="w-8 h-8 rounded-xl"
              loading="lazy"
              alt="USERIMAGE"
            />
            <div className="hidden md:block lg:block">
              <h2 className="font-semibold text-md lg:text-lg capitalize text-gray-100">
                {currentUser?.userName.split(" ")[0]}
              </h2>
              <small className="float-left text-gray-400 text-sm lg:text-md text-gray-200">
                {currentUser.isbusinessPartner
                  ? "Business Partner"
                  : "User" || "User"}
              </small>
            </div>
            {isVisible && (
              // <div className="absolute w-40 lg:w-52 top-16 -right-12 lg:-right-16 z-10 bg-white flex flex-col items-center text-left gap-2 border border-gray-200 rounded-xl p-2 dark:bg-gray-800 dark:border-none">
              <div className="absolute w-40 top-16 right-0 z-10 bg-white flex flex-col items-center text-left gap-2 border border-gray-200 rounded-xl p-2 dark:bg-gray-800 dark:border-none">
                <Link className="lg:hidden border-b-2 text-center font-semibold md:hidden py-1.5 hover:bg-theme hover:text-white transition duration-200 ease-in-ou w-full capitalize">
                  <FontAwesomeIcon className=" mr-1" icon={faUser} />
                  {currentUser.userName}
                </Link>
                <Link
                  className="py-1.5 px-1.5 hover:bg-theme rounded-md hover:text-white transition duration-200 ease-in-ou w-full"
                  to={"/profile"}
                >
                  <FontAwesomeIcon className=" mr-1" icon={faUser} />
                  View Profile
                </Link>
                {/* <Link
                  className="py-1.5 px-1.5 hover:bg-theme rounded-md hover:text-white transition duration-200 ease-in-out w-full"
                  to={"/wallet"}
                >
                  <FontAwesomeIcon className=" mr-1" icon={faWallet} />
                  View Wallet
                </Link> */}
                <Link
                  className="py-1.5 px-1.5 hover:bg-theme rounded-md hover:text-white transition duration-200 ease-in-ou w-full"
                  onClick={() => dispatch(toggleModal())}
                >
                  <FontAwesomeIcon className=" mr-1" icon={faSignOut} />
                  Logout
                </Link>
              </div>
            )}
          </button>
          {/* theme button  */}
          {/* <button
            className="rounded-xl items-center gap-2 bg-white p-1.5 md:p-3 lg:p-4 shadow-md hover:shadow-none dark:bg-gray-800"
            onClick={() => dispatch(toggleTheme())}
          >
            {theme == "light" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="stroke-black"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="stroke-white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
