import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSideBar } from "../../Redux/SideBarSlice/SideBarSlice";
import { useIsMobile } from "../../utils";
import React, { useEffect, useMemo } from "react";
import { menuList } from "./menuList";
import SideBarDropDown from "./SideBarDropDown";
import rentoLogo from "../../assets/logo/rento-full-red.png";
import HeaderMenuList from "../Header/HeaderMenuList";

const SideBar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();

  const { is_open } = useSelector((state) => state.sideBar);
  const { loggedInRole } = useSelector((state) => state.user);

  useEffect(() => {
    if (isMobile) {
      if (!is_open) {
        dispatch(toggleSideBar());
      }
    }
  }, [location.pathname, isMobile, is_open, dispatch]);

  const filteredMenu = useMemo(() => {
    return menuList
      .filter((item) => item.roles?.includes(loggedInRole))
      .map((item) => {
        if (!item.nestedLink) return item;

        return {
          ...item,
          nestedLink: item.nestedLink.filter((nestedItem) =>
            nestedItem.roles?.includes(loggedInRole),
          ),
        };
      });
  }, [loggedInRole]);

  const isActiveRoute = (item) => {
    return (
      location.pathname.includes(item?.menuLink?.toLowerCase()) ||
      location.pathname.includes(item?.moreLink?.toLowerCase())
    );
  };

  return (
    <div className="relative flex flex-col h-dvh overflow-hidden shadow-lg dark:shadow-gray-500 bg-white border-r-2 border-gray-200">
      {/* <div className="shadow-lg min-h-screen dark:shadow-gray-500 bg-white border-r-2 border-gray-200"> */}

      {/* close button  */}
      {/* <div className="lg:hidden float-right px-5 py-4"> */}
      <div className="lg:hidden absolute right-0 top-0 z-10 px-5 py-4">
        <button
          className="border border-gray-300 rounded-lg p-2 dark:border-gray-100"
          title="close"
          onClick={() => dispatch(toggleSideBar())}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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

      <div className="py-[0.5rem] shrink-0">
        <div className="h-14 lg:h-16">
          <img
            src={rentoLogo}
            className="w-[48%] lg:w-3/4 h-full object-contain ml-5 lg:mx-auto"
            loading="lazy"
            alt="RENTO_BIKES"
          />
        </div>
      </div>
      {/* <div
        className="px-3.5 py-3 overflow-y-scroll w-full"
        style={{ height: "calc(100vh - 88px)" }}
      > */}
      <div className="sidebar-scroll px-3.5 py-3 flex-1 min-h-0 overflow-y-auto w-full">
        <ul className="leading-9">
          {filteredMenu.map((item, index) => {
            if (item.nestedLink) {
              return <SideBarDropDown item={item} key={index} />;
            }
            const active = isActiveRoute(item);

            return (
              <Link
                to={`${item?.menuLink}`}
                key={index}
                onClick={() => {
                  if (isMobile) {
                    dispatch(toggleSideBar());
                  }
                }}
              >
                <li
                  className={`px-4 py-1.5 group capitalize text-sm ${
                    active
                      ? "bg-theme text-white"
                      : "hover:bg-transparent sm:hover:bg-theme"
                  } transition duration-300 ease-in-out rounded-md flex items-center gap-1 mb-2`}
                >
                  <div
                    className={`w-7 h-7 sm:group-hover:text-gray-100 text-sm ${
                      active ? "text-white" : ""
                    }`}
                  >
                    {/* menuItem icon  */}
                    {item?.menuImg}
                  </div>
                  <span className="sm:group-hover:text-white">
                    {item?.menuTitle}
                  </span>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
      <div className="shrink-0">
        <HeaderMenuList
          variant="sidebar"
          onNavigate={() => isMobile && dispatch(toggleSideBar())}
        />
      </div>
    </div>
  );
};

export default React.memo(SideBar);
