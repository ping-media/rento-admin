import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleModal } from "../../Redux/SideBarSlice/SideBarSlice";
import { tableIcons } from "../../Data/Icons";

// menuList
const menuListOptions = [
  {
    title: "Profile",
    link: "/profile",
    icon: "user-circle",
    role: ["admin", "manager"],
  },
  { title: "Settings", link: "/settings", icon: "settings", role: ["admin"] },
  { title: "Logout", icon: "logout", role: ["admin", "manager"] },
];

const HeaderMenuList = ({ variant = "dropdown", onNavigate }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, loggedInRole } = useSelector((state) => state.user);

  if (variant === "sidebar") {
    // const fullName =
    //   `${currentUser?.firstName ?? ""} ${currentUser?.lastName ?? ""}`.trim() ||
    //   "--";
    const fullName = `${currentUser?.firstName ?? ""}`.trim() || "--";

    return (
      <div className="flex items-center gap-2 border-t border-gray-200 dark:border-gray-700 px-3 py-3">
        {/* avatar + name + role -> profile */}
        <button
          type="button"
          className="flex items-center gap-2 flex-1 min-w-0 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 p-1 transition"
          title={fullName ?? "Profile"}
          onClick={() => {
            navigate("/profile");
            onNavigate?.();
          }}
        >
          <span className="w-9 h-9 shrink-0 rounded-full bg-theme text-white flex items-center justify-center font-semibold uppercase">
            {fullName.charAt(0)}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold capitalize truncate">
              {fullName}
            </span>
            <span className="block text-xs uppercase tracking-wide text-gray-500 truncate">
              {loggedInRole || "--"}
            </span>
          </span>
        </button>

        {/* logout */}
        <LogoutBtn />
      </div>
    );
  }

  return (
    <div className="absolute w-40 lg:w-48 top-12 right-0 z-50 bg-white flex flex-col items-center text-left gap-2 border border-gray-200 rounded-md p-2 dark:bg-gray-800 dark:border-none">
      <div className="border-b-2 py-1.5 w-full text-center">
        <p className="font-semibold capitalize">
          {`${currentUser?.firstName} ${currentUser?.lastName}` || ""}
        </p>
        <small className="uppercase tracking-wide">
          ({loggedInRole || "--"})
        </small>
      </div>
      {menuListOptions
        ?.filter((f) => f?.role?.includes(loggedInRole))
        ?.map((item, indx) => (
          <div
            className="flex items-center gap-1 py-1.5 px-1.5 w-full hover:bg-theme hover:text-white rounded-md transition duration-200 ease-in-out"
            key={indx}
          >
            {tableIcons[item?.icon]}
            <div
              className="text-left text-sm w-full"
              type="button"
              onClick={() =>
                item?.link ? navigate(item?.link) : dispatch(toggleModal())
              }
              key={indx}
            >
              {item?.title}
            </div>
          </div>
        ))}
    </div>
  );
};

export default HeaderMenuList;

export const LogoutBtn = ({ className = "" }) => {
  const dispatch = useDispatch();

  return (
    <button
      type="button"
      className={`shrink-0 p-2 rounded-md hover:bg-theme hover:text-white transition ${className}`}
      title="Logout"
      onClick={() => dispatch(toggleModal())}
    >
      {tableIcons.logout}
    </button>
  );
};
