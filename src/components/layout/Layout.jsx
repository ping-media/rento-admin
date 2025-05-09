import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { lazy, useCallback, useEffect, useRef, useState } from "react";
import Header from "../Header/Header";
import SideBar from "../SideBar/SideBar";
import Alert from "../Alert/Alert";
// import ScrollToTopButton from "../ScrollButton/ScrollToTopButton";
import PreLoader from "../Skeleton/PreLoader";
import {
  handleCurrentUser,
  handleSignOut,
  handleVerifyLoading,
} from "../../Redux/UserSlice/UserSlice";
import {
  handleRestPagination,
  resetVehiclesFilter,
} from "../../Redux/PaginationSlice/PaginationSlice";
import {
  handleIsHeaderChecked,
  removemaintenanceIds,
  removeTempIds,
} from "../../Redux/VehicleSlice/VehicleSlice";
import { handleLogoutUser, validateUser } from "../../Data/Function";
import { getData } from "../../Data/index";
import {
  addAddOn,
  addGeneral,
  startAddOnLoading,
  startLoading,
  stopLoading,
} from "../../Redux/GeneralSlice/GeneralSlice";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
// modals
const SignOutModal = lazy(() => import("../Modal/SignOutModal"));
const DeleteModal = lazy(() => import("../Modal/DeleteModal"));

const Layout = () => {
  const dispatch = useDispatch();
  //error message
  const { message, type } = useSelector((state) => state.error);
  const { navigateLoad } = useSelector((state) => state.dashboard);
  //logedIn user
  const { theme } = useSelector((state) => state.theme);
  const { is_open } = useSelector((state) => state.sideBar);
  const mainRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [validateLoading, setValidateLoading] = useState(false);
  const { currentUser, token, user, loading } = useSelector(
    (state) => state.user
  );
  // const { page, limit } = useSelector((state) => state.pagination);
  const { extraAddOn } = useSelector((state) => state.general);

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

  const getGeneralSettings = useCallback(async () => {
    try {
      dispatch(startLoading());
      const response = await getData("/general", token);
      if (response.success === true) {
        dispatch(addGeneral(response.data));
      } else if (response.success === false) {
        handleAsyncError(
          dispatch,
          "Unable to Load General Settings! try refresh page"
        );
      }
    } finally {
      dispatch(stopLoading());
    }
  }, []);

  //decrypting loggedIn userData and storing in the state
  useEffect(() => {
    if (user != null) {
      dispatch(handleCurrentUser(user));
    }
    getGeneralSettings();
  }, []);

  // if user is not found or inactive then logout for first time
  useEffect(() => {
    (async () => {
      try {
        setValidateLoading(true);
        if (currentUser && currentUser?.userType === "customer") {
          return dispatch(handleSignOut());
        }
        await validateUser(
          token,
          handleLogoutUser,
          dispatch,
          handleVerifyLoading
        );
      } finally {
        setValidateLoading(false);
      }
    })();
  }, []);

  // addOn Data
  useEffect(() => {
    if (extraAddOn?.data?.length > 0) return;

    (async () => {
      dispatch(startAddOnLoading());
      const response = await getData("/addOn?page=1&limit=50", token);
      if (response?.status === 200) {
        dispatch(addAddOn(response));
      }
    })();
  }, []);

  //need to reset some value when ever user change page
  useEffect(() => {
    dispatch(handleRestPagination());
    dispatch(resetVehiclesFilter());
    dispatch(removeTempIds());
    dispatch(removemaintenanceIds());
    dispatch(handleIsHeaderChecked(false));
  }, [location.href]);

  if (navigateLoad) {
    return <PreLoader />;
  }

  return !validateLoading && !loading ? (
    token !== null ? (
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
            } w-[100%] lg:w-[18%] absolute lg:relative bg-black/50 lg:bg-transparent z-50 lg:z-10 transition duration-300 ease-in-out dark:bg-slate-900`}
          >
            <div className="w-[83%] lg:w-[100%] bg-white">
              <SideBar />
            </div>
          </div>
          <div
            className={`${
              !is_open ? "w-full" : "w-full lg:w-[83%]"
            } transition duration-300 ease-in-out dark:bg-slate-900`}
          >
            <Header />
            <main>
              <div
                className="p-3 lg:px-6 lg:py-4 overflow-hidden overflow-y-scroll no-scrollbar"
                ref={mainRef}
                style={{ height: "calc(100vh - 90.4px)" }}
              >
                {/* scrolltotop button  */}
                {/* {visible && (
                  <ScrollToTopButton handleClick={handleScrollToTop} />
                )} */}
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
