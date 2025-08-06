import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleModal } from "../../Redux/SideBarSlice/SideBarSlice";
import { tableIcons } from "../../Data/Icons";

const HeaderMenuList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, loggedInRole } = useSelector((state) => state.user);

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
