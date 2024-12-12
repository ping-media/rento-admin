import CustomTable from "../components/Table/CustomTable";
import { formatPathNameToTitle } from "../utils";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicleMaster } from "../Data/Function";
import PreLoader from "../components/Skeleton/PreLoader";
import { endPointBasedOnURL } from "../Data/commonData";
import { Link } from "react-router-dom";

const VehicleMaster = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { vehicleMaster, loading, deletevehicleId } = useSelector(
    (state) => state.vehicles
  );

  useEffect(() => {
    // console.log(endPointBasedOnURL[location.pathname.replace("/", "")]);
    // fetch data based on url
    if (deletevehicleId == "") {
      fetchVehicleMaster(
        dispatch,
        token,
        endPointBasedOnURL[location.pathname.replace("/", "")]
      );
    }
  }, [location.pathname, deletevehicleId]);

  return !loading ? (
    <>
      <div
        className={`flex flex-wrap items-center ${
          formatPathNameToTitle(location.pathname)
            ? "justify-between"
            : "justify-end"
        } mt-5 gap-4`}
      >
        {location.pathname != "/users-documents" && (
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
      <CustomTable Data={vehicleMaster} />
    </>
  ) : (
    <PreLoader />
  );
};

export default VehicleMaster;
