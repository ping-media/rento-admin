import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleModal } from "../../Redux/SideBarSlice/SideBarSlice";
import { tableIcons } from "../../Data/Icons";

const HeaderMenuList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  // menuList
  const menuListOptions = [
    // { title: "Dashboard", link: "/dashboard" },
    { title: "Profile", link: "/profile", icon: "user-circle" },
    { title: "Logout", icon: "logout" },
  ];

  return (
    <div className="absolute w-40 lg:w-48 top-12 right-0 z-10 bg-white flex flex-col items-center text-left gap-2 border border-gray-200 rounded-md p-2 dark:bg-gray-800 dark:border-none">
      <p className="border-b-2 text-center font-semibold py-1.5 w-full capitalize">
        {currentUser?.firstName}
      </p>
      {menuListOptions?.map((item, indx) => (
        <div className="flex items-center gap-1 py-1.5 px-1.5 w-full hover:bg-theme hover:text-white rounded-md transition duration-200 ease-in-out">
          {tableIcons[item?.icon]}
          <input
            className="text-left text-sm w-full"
            type="button"
            onClick={() =>
              item?.link ? navigate(item?.link) : dispatch(toggleModal())
            }
            key={indx}
            value={item?.title}
          />
        </div>
      ))}
    </div>
  );
};

export default HeaderMenuList;
