import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const SideBarDropDown = ({ item }) => {
  return (
    // <div className="mx-auto mt-8 grid max-w-xl divide-y divide-neutral-200">
    <div>
      <details
        className={`group capitalize ${
          location.pathname.includes(item?.menuLink.toLowerCase()) ||
          location.pathname.includes(item?.moreLink?.toLowerCase())
            ? "bg-theme text-gray-100"
            : ""
        } transition duration-300 ease-in-out mb-2 dark:text-gray-100`}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between group-hover:bg-theme px-4 py-2 rounded-lg group-open:bg-theme w-full">
          <div className="flex items-center gap-1">
            <div
              className={`w-7 h-7 group-hover:text-gray-100 text-lg ${
                location.pathname.includes(item?.menuLink.toLowerCase())
                  ? "text-gray-100"
                  : ""
              }`}
            >
              {item?.menuImg}
            </div>
            <span
              className={`${
                location.pathname.includes(item?.menuLink.toLowerCase())
                  ? "text-gray-100"
                  : ""
              } group-hover:text-gray-100`}
            >
              {item?.menuTitle}
            </span>
          </div>
          <span className="transition group-open:rotate-180 group-hover:text-gray-100">
            <svg
              fill="none"
              height="24"
              shapeRendering="geometricPrecision"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              width="24"
            >
              <path d="M6 9l6 6 6-6"></path>
            </svg>
          </span>
        </summary>
        <ul className="group-open:animate-fadeIn mt-3 text-neutral-600">
          {item?.nestedLink?.map((item, index) => (
            <Link to={`${item?.menuLink}`} key={index}>
              <li
                className={`px-4 py-2 group capitalize ${
                  location.pathname.includes(item?.menuLink.toLowerCase()) ||
                  location.pathname.includes(item?.moreLink?.toLowerCase())
                    ? "bg-theme text-gray-100"
                    : ""
                } hover:bg-theme transition duration-300 ease-in-out rounded-lg flex items-center gap-2 mb-2 text-gray-700`}
              >
                <div className="flex items-center gap-1">
                  {item?.menuImg}
                  <span>{item?.menuTitle}</span>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </details>
    </div>
  );
};

export default SideBarDropDown;
