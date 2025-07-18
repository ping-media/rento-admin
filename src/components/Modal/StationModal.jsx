import { useDispatch, useSelector } from "react-redux";
import { toggleStationAndVehicleModal } from "../../Redux/SideBarSlice/SideBarSlice";
import Spinner from "../Spinner/Spinner";
import { useState } from "react";
import useFetch from "../../utils/Helper/FetchData";
import {
  addOrRemoveTempData,
  handleUpdateStatus,
} from "../../Redux/VehicleSlice/VehicleSlice";
import { useDebounce } from "../../utils/Helper/debounce";
import { postData } from "../../Data/index";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";

const AddonModal = () => {
  const dispatch = useDispatch();
  const { isStationAndVehicleModalActive } = useSelector(
    (state) => state.sideBar
  );
  const { tempData } = useSelector((state) => state.vehicles);
  const [formLoading, setFormLoading] = useState(false);
  const [isAll, setIsAll] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search);

  const url = debouncedValue
    ? `/getStationData?search=${debouncedValue}&page=1&limit=10`
    : null;

  const { data, hookLoading, token } = useFetch(url);

  const [selectedStation, setSelectedStation] = useState([]);

  const handleUpdateVehicles = async (event) => {
    event.preventDefault();

    try {
      setFormLoading(true);
      let stationId = [];
      selectedStation.map((station) => stationId.push(station.stationId));
      const newData = { ...tempData, stationId, all: isAll };

      const response = await postData(
        `/updateVehicleMasterwithVehicles?_id=${tempData._id}`,
        newData,
        token
      );

      if (response.success) {
        dispatch(
          handleUpdateStatus({
            id: tempData._id,
            newStatus: tempData.status,
            flag: "status",
          })
        );
        setSelectedStation([]);
        dispatch(addOrRemoveTempData(null));
        dispatch(toggleStationAndVehicleModal());
      }
    } catch (error) {
      console.log(error?.message);
      handleAsyncError(dispatch, "Unable to process the request! try again");
    } finally {
      setFormLoading(false);
    }
  };

  const handleAddonToggle = (checked, item) => {
    if (checked) {
      setSelectedStation((prev) => [...prev, item]);
    } else {
      setSelectedStation((prev) => prev.filter((i) => i._id !== item._id));
    }
  };

  return (
    <div
      className={`fixed ${
        !isStationAndVehicleModalActive ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-10 mx-auto shadow-xl rounded-md bg-white max-w-md">
        <div className="flex justify-between border-b p-2">
          <h2 className="text-theme font-semibold text-lg uppercase">
            Select Station
          </h2>
          <button
            onClick={() => {
              dispatch(addOrRemoveTempData(null));
              dispatch(toggleStationAndVehicleModal());
            }}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            disabled={formLoading}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className="px-4 py-4 pt-2">
          <form onSubmit={handleUpdateVehicles}>
            <p className="mb-2 italic text-sm text-gray-500">
              <span className="font-semibold text-gray-600">Note:</span> Select
              all stations options in case of not selecting any station.
            </p>
            <div className="w-full mb-2">
              <div className="mb-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search station..."
                  className="w-full outline-0 border border-gray-300 px-3 py-2 rounded-md"
                  disabled={formLoading}
                />
              </div>
              {hookLoading ? (
                <Spinner />
              ) : (
                data?.length > 0 &&
                !isAll &&
                data
                  ?.filter((station) => station?.status !== "inactive")
                  ?.map((item, index) => {
                    const isChecked = selectedStation.some(
                      (i) => i._id === item._id
                    );
                    return (
                      <div
                        className="flex items-center gap-1 mb-1 lg:mb-2"
                        key={index}
                      >
                        <input
                          type="checkbox"
                          id={item?.name}
                          className="w-4 h-4 accent-red-600"
                          checked={isChecked}
                          onChange={(e) =>
                            handleAddonToggle(e.target.checked, item)
                          }
                        />
                        <label
                          htmlFor={item?.stationName}
                          className="text-sm cursor-pointer capitalize"
                        >
                          {item?.stationName}
                        </label>
                      </div>
                    );
                  })
              )}
              <div className="flex items-center gap-1 my-1 pt-1 lg:mb-2">
                <input
                  type="checkbox"
                  id={"all"}
                  className="w-4 h-4 accent-red-600"
                  checked={isAll}
                  onChange={() => {
                    setSelectedStation([]);
                    setIsAll(!isAll);
                  }}
                />
                <label
                  htmlFor={"all"}
                  className="text-sm cursor-pointer capitalize"
                >
                  All Stations
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="bg-theme px-4 py-2 mt-3 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none disabled:bg-theme/60 w-full flex items-center justify-center outline-none"
              disabled={formLoading}
            >
              {!formLoading ? (
                `${
                  tempData?.status === "active" ? "Enable" : "Disable"
                } Station`
              ) : (
                <Spinner message={"loading..."} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddonModal;
