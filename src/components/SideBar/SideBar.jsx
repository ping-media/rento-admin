import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSideBar } from "../../Redux/SideBarSlice/SideBarSlice";
import { useIsMobile } from "../../utils";
import { useEffect } from "react";
import { menuList } from "./menuList";
import SideBarDropDown from "./SideBarDropDown";
import rentoLogo from "../../assets/logo/rento-logo.png";

const SideBar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const { is_open } = useSelector((state) => state.sideBar);
  const { theme } = useSelector((state) => state.theme);
  // const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (isMobile) {
      if (!is_open) {
        dispatch(toggleSideBar());
      }
    }
  }, [window.location.href]);

  return (
    <div className="shadow-lg min-h-screen dark:shadow-gray-500 bg-white border-r-2 border-gray-200">
      {/* <div className="shadow-lg min-h-screen dark:shadow-gray-500 bg-theme-seconday-dark"> */}
      {/* close button  */}
      <div className="lg:hidden float-right px-5 py-4">
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
      <div className="py-[0.5rem]">
        <div className="w-24 lg:w-28 h-14 lg:h-16 mx-auto">
          <img
            src={rentoLogo}
            className="w-full h-full object-contain"
            loading="lazy"
            alt="RENTO_BIKES"
          />
        </div>
      </div>
      <div
        className="px-3.5 py-3 overflow-y-scroll no-scrollbar"
        style={{ height: "calc(100vh - 88px)" }}
      >
        <ul className="leading-9">
          {menuList.map((item, index) => {
            if (item.nestedLink) {
              return <SideBarDropDown item={item} key={index} />;
            } else {
              return (
                <Link to={`${item?.menuLink}`} key={index}>
                  <li
                    className={`px-4 py-1 group capitalize text-md ${
                      location.pathname.includes(
                        item?.menuLink.toLowerCase()
                      ) ||
                      location.pathname.includes(item?.moreLink?.toLowerCase())
                        ? "bg-theme text-gray-100"
                        : ""
                    } hover:bg-theme transition duration-300 ease-in-out rounded-md flex items-center gap-2 mb-2 dark:text-gray-100`}
                  >
                    <div
                      className={`w-7 h-7 group-hover:text-gray-100 text-lg ${
                        location.pathname.includes(
                          item?.menuLink?.toLowerCase()
                        ) ||
                        location.pathname.includes(
                          item?.moreLink?.toLowerCase()
                        )
                          ? "text-gray-100"
                          : ""
                      }`}
                    >
                      {/* menuItem icon  */}
                      {item?.menuImg}
                    </div>
                    <span className="group-hover:text-gray-100">
                      {item?.menuTitle}
                    </span>
                  </li>
                </Link>
              );
            }
          })}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
