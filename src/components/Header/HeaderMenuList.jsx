import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleModal } from "../../Redux/SideBarSlice/SideBarSlice";

const HeaderMenuList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  // menuList
  const menuListOptions = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Profile", link: "/profile" },
    { title: "Logout" },
  ];

  return (
    <div className="absolute w-40 top-12 right-0 z-10 bg-white flex flex-col items-center text-left gap-2 border border-gray-200 rounded-md p-2 dark:bg-gray-800 dark:border-none">
      <p className="border-b-2 text-center font-semibold py-1.5 w-full capitalize">
        {currentUser?.firstName}
      </p>
      {menuListOptions?.map((item, indx) => (
        <input
          className="text-left py-1.5 px-1.5 text-sm hover:bg-theme rounded-md hover:text-white transition duration-200 ease-in-out w-full"
          type="button"
          onClick={() =>
            item?.link ? navigate(item?.link) : dispatch(toggleModal())
          }
          key={indx}
        >
          {item?.title}
        </input>
      ))}
    </div>
  );
};

export default HeaderMenuList;
