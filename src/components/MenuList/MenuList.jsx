import React from "react";

const MenuList = ({ menuListOptions }) => {
  return (
    <div className="absolute w-40 lg:w-48 top-12 right-0 z-50 bg-white flex flex-col items-center text-left gap-2 border border-gray-200 rounded-md p-1 dark:bg-gray-800 dark:border-none">
      {menuListOptions?.map((item, indx) => (
        <React.Fragment key={indx}>{item}</React.Fragment>
      ))}
    </div>
  );
};

export default MenuList;
