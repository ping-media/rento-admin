import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import Header from "../Header/Header";
import SideBar from "../SideBar/SideBar";
import Alert from "../Alert/Alert";
import SignOutModal from "../Modal/SignOutModal";
import DeleteModal from "../Modal/DeleteModal";
import ScrollToTopButton from "../ScrollButton/ScrollToTopButton";
import PreLoader from "../Skeleton/PreLoader";
import { handleCurrentUser } from "../../Redux/UserSlice/UserSlice";

const Layout = () => {
  const dispatch = useDispatch();
  //error message
  const { message, type } = useSelector((state) => state.error);
  //logedIn user
  const { theme } = useSelector((state) => state.theme);
  const { is_open } = useSelector((state) => state.sideBar);
  const mainRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const { token, user, loading, currentUser } = useSelector(
    (state) => state.user
  );

  //scrolltotop function
  const handleScrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // hide the button until user scroll to certain height
  useEffect(() => {
    const handleScroll = () => {
      if (mainRef.current) {
        setVisible(mainRef.current.scrollTop > 200);
      }
    };
    const div = mainRef.current;
    if (div) {
      div.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (div) {
        div.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  //decrypting loggedIn userData and storing in the state
  useEffect(() => {
    if (user != null) {
      dispatch(handleCurrentUser(user));
    }
  }, []);

  return !loading ? (
    token != null ? (
      <>
        <div
          className={`w-full flex relative ${theme == "dark" ? "dark" : ""}`}
        >
          {/* for showing error  */}
          {message && <Alert error={message} errorType={type} />}
          {/* beforeSignout user will see this modal  */}
          <SignOutModal />
          <DeleteModal />
          <div
            className={`${
              is_open
                ? "translate-x-[-100%] lg:translate-x-[0]"
                : "translate-x-[0] lg:translate-x-[-100%] lg:ml-[-18%]"
            } w-[83%] lg:w-[18%] absolute lg:relative bg-white z-10 transition duration-300 ease-in-out dark:bg-slate-900`}
          >
            <SideBar />
          </div>
          <div
            className={`${
              !is_open ? "w-full" : "w-full lg:w-[83%]"
            } transition duration-300 ease-in-out dark:bg-slate-900`}
          >
            <Header />
            <main>
              <div
                className="px-6 py-4 overflow-hidden overflow-y-scroll no-scrollbar"
                ref={mainRef}
                style={{ height: "calc(100vh - 90.4px)" }}
              >
                {/* scrolltotop button  */}
                {visible && (
                  <ScrollToTopButton handleClick={handleScrollToTop} />
                )}
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </>
    ) : (
      <Navigate to="/" />
    )
  ) : (
    <PreLoader />
  );
};

export default Layout;
