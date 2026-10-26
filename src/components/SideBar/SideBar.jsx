import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSideBar } from "../../Redux/SideBarSlice/SideBarSlice";
import { useIsMobile } from "../../utils";
import React, { useEffect, useMemo, useState } from "react";
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
      .map((item) => {
        if (item.children) {
          const children = item.children.filter((child) =>
            child.roles?.includes(loggedInRole),
          );
          if (children.length === 0) return null;
          // single visible child: no point showing a dropdown, render it flat
          if (children.length === 1) {
            return { ...children[0], menuImg: item.menuImg };
          }
          return { ...item, children };
        }

        if (!item.roles?.includes(loggedInRole)) return null;
        if (!item.nestedLink) return item;

        return {
          ...item,
          nestedLink: item.nestedLink.filter((nestedItem) =>
            nestedItem.roles?.includes(loggedInRole),
          ),
        };
      })
      .filter(Boolean);
  }, [loggedInRole]);

  const isActiveRoute = (item) => {
    return (
      location.pathname.includes(item?.menuLink?.toLowerCase()) ||
      location.pathname.includes(item?.moreLink?.toLowerCase())
    );
  };

  const getActiveGroup = () =>
    filteredMenu.find((item) => item.children?.some(isActiveRoute))
      ?.menuTitle ?? null;

  const [openGroup, setOpenGroup] = useState(getActiveGroup);

  // on every page change, keep only the group that contains the current page
  // open, or close everything when the page is a flat item
  useEffect(() => {
    setOpenGroup(getActiveGroup());
  }, [location.pathname, filteredMenu]);

  return (
    <div className="relative flex flex-col h-dvh overflow-hidden shadow-lg dark:shadow-gray-500 bg-white border-r-2 border-gray-200">
      {/* close button  */}
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

      <div className="sidebar-scroll px-1 sm:px-1.5 py-3 flex-1 min-h-0 overflow-y-auto w-full">
        <ul className="leading-9">
          {filteredMenu.map((item, index) => {
            if (item.children) {
              return (
                <SidebarGroup
                  key={index}
                  item={item}
                  open={openGroup === item.menuTitle}
                  onToggle={() =>
                    setOpenGroup((prev) =>
                      prev === item.menuTitle ? null : item.menuTitle,
                    )
                  }
                  isActiveRoute={isActiveRoute}
                  onNavigate={() => isMobile && dispatch(toggleSideBar())}
                />
              );
            }
            if (item.nestedLink) {
              return <SideBarDropDown item={item} key={index} />;
            }
            const active = isActiveRoute(item);

            return (
              <Link
                to={`${item?.menuLink}`}
                key={index}
                onClick={() => {
                  setOpenGroup(null);
                  if (isMobile) {
                    dispatch(toggleSideBar());
                  }
                }}
              >
                <li
                  className={`px-2 py-1.5 group capitalize text-sm ${
                    active
                      ? "bg-theme/90 text-white"
                      : "hover:bg-theme/90 hover:text-white"
                  } transition duration-300 ease-in-out rounded-md flex items-center gap-1 mb-2`}
                >
                  <div
                    className={`w-7 h-7 group-hover:text-gray-100 text-sm ${
                      active ? "text-white" : ""
                    }`}
                  >
                    {/* menuItem icon  */}
                    {item?.menuImg}
                  </div>
                  <span className="group-hover:text-white">
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

const SidebarGroup = ({ item, open, onToggle, isActiveRoute, onNavigate }) => {
  const hasActiveChild = item.children.some(isActiveRoute);

  return (
    <li
      className={`mb-2 list-none transition-colors duration-300 ${open ? "bg-gray-100 rounded-b-md" : ""} ${open && !hasActiveChild ? "rounded-t-md" : ""}`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`w-full px-2 py-1.5 capitalize text-sm rounded-md flex items-center gap-1 transition duration-300 ease-in-out hover:bg-theme hover:text-white ${open && !hasActiveChild ? "bg-white" : ""} ${
          hasActiveChild ? "bg-theme/90 text-white font-medium" : ""
        }`}
      >
        <div className="w-7 h-7 text-sm">{item.menuImg}</div>
        <span className="flex-1 text-left">{item.menuTitle}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="min-h-0 overflow-hidden pt-1">
          <ul className="ml-5 pl-1 border-l border-gray-400">
            {item.children.map((child) => {
              const active = isActiveRoute(child);
              return (
                <li key={child.menuLink}>
                  <Link
                    to={child.menuLink}
                    onClick={onNavigate}
                    tabIndex={open ? 0 : -1}
                    className={`block px-2 py-1.5 mb-1 capitalize text-sm rounded-md transition duration-300 ease-in-out ${
                      active
                        ? "text-theme bg-theme/25 font-semibold"
                        : "hover:bg-theme/25 hover:text-theme hover:font-semibold"
                    }`}
                  >
                    {child.menuTitle}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </li>
  );
};
