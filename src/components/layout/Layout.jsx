import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { lazy, useCallback, useEffect, useState } from "react";
import Header from "../Header/Header";
import SideBar from "../SideBar/SideBar";
import Alert from "../Alert/Alert";
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
  const [validateLoading, setValidateLoading] = useState(false);
  const { currentUser, token, user, loading } = useSelector(
    (state) => state.user
  );
  const { extraAddOn } = useSelector((state) => state.general);
  const location = useLocation();

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
  }, [dispatch, token]);

  //decrypting loggedIn userData and storing in the state
  useEffect(() => {
    if (user != null) {
      dispatch(handleCurrentUser(user));
    }
    getGeneralSettings();
  }, [user, dispatch, getGeneralSettings]);

  // if user is not found or inactive then logout for first time
  useEffect(() => {
    if (!token || currentUser?.userType === "customer") {
      dispatch(handleSignOut());
      return;
    }

    (async () => {
      try {
        setValidateLoading(true);
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
  }, [token, currentUser?.userType, dispatch]);

  // addOn Data
  useEffect(() => {
    if (!extraAddOn?.data?.length) {
      (async () => {
        dispatch(startAddOnLoading());
        const response = await getData("/addOn?page=1&limit=50", token);
        if (response?.status === 200) {
          dispatch(addAddOn(response));
        }
      })();
    }
  }, [extraAddOn?.data?.length, dispatch, token]);

  //need to reset some value when ever user change page
  useEffect(() => {
    dispatch(handleRestPagination());
    dispatch(resetVehiclesFilter());
    dispatch(removeTempIds());
    dispatch(removemaintenanceIds());
    dispatch(handleIsHeaderChecked(false));
  }, [location.pathname]);

  if (navigateLoad) {
    return <PreLoader />;
  }

  return !validateLoading && !loading ? (
    token !== null ? (
      <div className="relative">
        {/* for showing error  */}
        {message && <Alert error={message} errorType={type} />}
        {/* beforeSignout user will see this modal  */}
        <SignOutModal />
        <DeleteModal />

        {/* Overlay backdrop when mobile drawer is open */}
        {is_open && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => dispatch(closeSideBar())}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={`fixed top-0 left-0 z-50 w-[250px] h-full bg-white dark:bg-slate-900 shadow-lg transition-transform duration-300 ease-in-out lg:hidden ${
            is_open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SideBar />
        </div>

        {/* Layout Wrapper */}
        <div
          className={`flex flex-col h-screen w-full ${
            theme === "dark" ? "dark" : ""
          }`}
        >
          {/* Main Layout (Desktop) */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar for desktop only */}
            <aside className="hidden lg:block w-[250px] h-full overflow-y-auto bg-white dark:bg-slate-900 border-r">
              <SideBar />
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col bg-gray-50 dark:bg-slate-900 overflow-hidden">
              {/* Header (desktop only) */}
              <div className="bg-white dark:bg-slate-900 h-[60.4px] z-10">
                <Header />
              </div>

              {/* Main Content */}
              <main className="flex-1 overflow-y-auto p-3 lg:p-4">
                <Outlet />
              </main>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <Navigate to="/" />
    )
  ) : (
    <PreLoader />
  );
};

export default Layout;
