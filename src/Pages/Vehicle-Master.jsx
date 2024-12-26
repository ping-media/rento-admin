import CustomTable from "../components/Table/CustomTable";
import { formatPathNameToTitle } from "../utils";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicleMasterWithPagination } from "../Data/Function";
import PreLoader from "../components/Skeleton/PreLoader";
import { endPointBasedOnURL } from "../Data/commonData";
import { Link } from "react-router-dom";
import CustomTableComponent from "../components/Table/DataTable";

const VehicleMaster = () => {
  const dispatch = useDispatch();
  const { currentUser, token } = useSelector((state) => state.user);
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
        limit,
        currentUser?.userType
      );
    }
  }, [location.pathname, deletevehicleId, page, limit]);

  return !loading ? (
    <>
      <div
        className={`flex flex-wrap items-center ${
          formatPathNameToTitle(location.pathname)
            ? "justify-between"
            : "justify-end"
        } mt-5 gap-4`}
      >
        {!(
          location.pathname == "/payments" ||
          location.pathname == "/all-invoices" ||
          location.pathname == "/users-documents"
        ) && (
          <div className="flex items-center justify-between gap-2 w-full">
            <h1 className="text-xl xl:text-2xl uppercase font-bold text-theme">
              {formatPathNameToTitle(location.pathname)}
            </h1>

            <Link
              className="bg-theme font-semibold text-gray-100 px-4 lg:px-6 py-2.5 rounded-md shadow-lg hover:bg-theme-light hover:shadow-md inline-flex items-center gap-1"
              to={"add-new"}
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
              Add new
            </Link>
          </div>
        )}
      </div>
      {/* {console.log(vehicleMaster)} */}
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
