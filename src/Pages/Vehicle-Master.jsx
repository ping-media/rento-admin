import CustomTable from "../components/Table/CustomTable";
import { formatPathNameToTitle } from "../utils";
import { lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVehicleMasterWithPagination,
  handleFilterData,
} from "../Data/Function";
import PreLoader from "../components/Skeleton/PreLoader";
import { endPointBasedOnURL } from "../Data/commonData";
import { Link } from "react-router-dom";
import CustomTableComponent from "../components/Table/DataTable";
import { togglePickupImageModal } from "../Redux/SideBarSlice/SideBarSlice";
import { removeTempIds } from "../Redux/VehicleSlice/VehicleSlice";
const UploadPickupImageModal = lazy(() =>
  import("../components/Modal/UploadPickupImageModal")
);

const VehicleMaster = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { vehicleMaster, loading, deletevehicleId } = useSelector(
    (state) => state.vehicles
  );
  const { page, limit } = useSelector((state) => state.pagination);

  useEffect(() => {
    // fetch data based on url
    if (deletevehicleId == "") {
      fetchVehicleMasterWithPagination(
        dispatch,
        token,
        endPointBasedOnURL[location.pathname.replace("/", "")],
        page,
        limit
      );
    }
  }, [location.pathname, deletevehicleId, page, limit]);

  // clear data after page change
  useEffect(() => {
    dispatch(removeTempIds());
  }, []);

  return !loading ? (
    <>
      <div
        className={`flex flex-wrap items-center ${
          formatPathNameToTitle(location.pathname)
            ? "justify-between"
            : "justify-end"
        } mt-5 gap-4`}
      >
        {/* show this modal on specific page  */}
        {location.pathname == "/all-pickup-image" && <UploadPickupImageModal />}

        {!(
          location.pathname == "/payments" ||
          location.pathname == "/all-invoices" ||
          location.pathname == "/users-documents"
        ) && (
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2">
              <h1 className="text-xl xl:text-2xl uppercase font-bold text-theme">
                {formatPathNameToTitle(location.pathname)}
              </h1>

              <Link
                className="bg-theme font-semibold text-gray-100 px-2.5 py-1.5 rounded-md shadow-lg hover:bg-theme-light hover:shadow-md inline-flex items-center gap-1"
                to={location.pathname != "/all-pickup-image" ? "add-new" : "#"}
                onClick={() =>
                  location.pathname == "/all-pickup-image" &&
                  dispatch(togglePickupImageModal())
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="stroke-gray-100"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add
              </Link>
            </div>
            {/* <div className="w-full lg:w-[30%] bg-white rounded-md shadow-lg">
              <form className="flex items-center justify-center p-2">
                <input
                  type="text"
                  placeholder="Search Here.."
                  className="w-full rounded-md px-2 py-1 focus:outline-none focus:border-transparent"
                  onChange={(e) =>
                    handleFilterData(
                      e,
                      newUpdatedData,
                      pagination,
                      setTotalPages,
                      setNewUpdatedData,
                      loadFiltersAndData
                    )
                  }
                />
                <button
                  type="submit"
                  className="bg-gray-800 text-white rounded-md px-4 py-1 ml-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="stroke-gray-100"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              </form>
            </div> */}
          </div>
        )}
      </div>
      {console.log(vehicleMaster)}
      {/* <CustomTable
        Data={vehicleMaster?.data}
        pagination={vehicleMaster?.pagination}
      /> */}
      <CustomTableComponent
        Data={vehicleMaster?.data}
        pagination={vehicleMaster?.pagination}
      />
    </>
  ) : (
    <PreLoader />
  );
};

export default VehicleMaster;
