import { tableIcons } from "../../Data/Icons";
import React, { useEffect, useRef, useState } from "react";
import MenuList from "./MenuList";

const MenuToggle = ({ menuList }) => {
  const [isVisible, setIsVisible] = useState(false);
  const adminRef = useRef(null);

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
    <div className="flex gap-2 items-center">
      <div
        className="relative cursor-pointer dark:bg-gray-700"
        ref={adminRef}
        onClick={handleToggleVisibility}
      >
        {tableIcons?.verticalMenu}
        {isVisible && <MenuList menuListOptions={menuList} />}
      </div>
    </div>
  );
};

export default MenuToggle;
