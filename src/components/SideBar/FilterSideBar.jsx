import { useDispatch, useSelector } from "react-redux";
import { toggleFilterSideBar } from "../../Redux/SideBarSlice/SideBarSlice";
import Input from "../InputAndDropdown/Input";
import FilterRadioInput from "./FilterRadioInput";
import React, { useEffect, useRef, useState } from "react";
import PreLoader from "../../components/Skeleton/PreLoader";
import { resetVehiclesFilter } from "../../Redux/PaginationSlice/PaginationSlice";
import { useClickOutside } from "../../utils/Helper/useClickOutside";
import useSidebarFilter from "../../hooks/use-sidebar-filter";

const FilterSideBar = () => {
  const dispatch = useDispatch();
  const { isFilterOpen } = useSelector((state) => state.sideBar);
  const { vehiclesFilter } = useSelector((state) => state.pagination);
  const {
    filterMenuList,
    filterUserMenuList,
    searchDataBasedOnFilters,
    handleApplyFilters,
    loading,
    formLoading,
    activeFilterName,
  } = useSidebarFilter();
  const [menuList, setMenuList] = useState([]);
  const [filterState, setFilterState] = useState(
    activeFilterName !== "" ? activeFilterName : "All Bookings"
  );
  const sideBarRef = useRef(null);

  useClickOutside(
    sideBarRef,
    () => {
      if (isFilterOpen) {
        dispatch(toggleFilterSideBar());
      }
    },
    isFilterOpen
  );

  // change the data based on page
  useEffect(() => {
    if (location.pathname === "/all-bookings") {
      setMenuList(filterMenuList);
    } else {
      setMenuList(filterUserMenuList);
    }
  }, [location?.href]);

  return (
    <div
      className={`fixed w-full z-40 top-0 right-0 ${
        isFilterOpen ? "bg-black bg-opacity-50" : "hidden"
      } transition-all duration-300 ease-in-out`}
    >
      {loading && <PreLoader />}
      <div
        ref={sideBarRef}
        className={`shadow-lg min-h-screen dark:shadow-gray-500 bg-white border-r-2 border-gray-200 w-full lg:w-[22%] lg:float-right ${
          isFilterOpen ? "translate-x-[0]" : "translate-x-[100%]"
        } transition-all duration-300 ease-in-out`}
      >
        {/* close button  */}
        <div className="flex items-center justify-between px-5 py-4 border-b-2">
          <h2 className="text-xl uppercase text-theme font-semibold">
            Filters
          </h2>
          <button
            className="border border-gray-300 rounded-lg p-2 dark:border-gray-100"
            title="close"
            onClick={() => dispatch(toggleFilterSideBar())}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
        <div
          className="px-3.5 py-3 overflow-y-scroll no-scrollbar flex-1"
          // style={{ height: "calc(100vh - 88px)" }}
        >
          {location.pathname !== "/all-vehicles" && (
            <>
              <ul className="leading-10 flex flex-col gap-3">
                {menuList &&
                  menuList?.length > 0 &&
                  menuList?.map((item, index) => (
                    <React.Fragment key={index}>
                      {item?.divider === true && (
                        <li className="border-b-2 border-gray-400/60 w-full my-2"></li>
                      )}
                      <li>
                        <FilterRadioInput
                          title={item?.title}
                          searchTag={item?.searchTag}
                          isChecked={filterState === item?.title}
                          onChangeFn={
                            searchDataBasedOnFilters && searchDataBasedOnFilters
                          }
                          setFilterState={setFilterState}
                        />
                      </li>
                    </React.Fragment>
                  ))}
              </ul>
            </>
          )}

          {location.pathname === "/all-vehicles" && (
            <>
              <form onSubmit={handleApplyFilters} className="mb-3">
                {(vehiclesFilter.vehicleName !== "" ||
                  vehiclesFilter.search !== "") && (
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm border p-1 rounded-md border-gray-300 hover:text-theme hover:border-theme"
                      onClick={() => dispatch(resetVehiclesFilter())}
                    >
                      Clear <span className="hidden lg:inline">Filters</span>
                    </button>
                  </div>
                )}
                <div className="mb-2">
                  <Input
                    item={"vehicleName"}
                    placeholder={"Vehicle Name"}
                    isModalClose={isFilterOpen}
                    value={vehiclesFilter.vehicleName}
                    excludeLocation={"/all-vehicles"}
                  />
                </div>
                <div className="mb-2">
                  <Input
                    item={"stationName"}
                    placeholder={"Station Name"}
                    isModalClose={isFilterOpen}
                    value={vehiclesFilter.search}
                    excludeLocation={"/all-vehicles"}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-theme px-4 py-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none disabled:bg-gray-400"
                  disabled={formLoading}
                >
                  {formLoading ? "Appling" : "Apply"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSideBar;
