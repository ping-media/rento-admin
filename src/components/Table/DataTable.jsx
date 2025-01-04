import DropDownComponent from "../DropDown/DropDownComponent.jsx";
import {
  formatFullDateAndTime,
  formatPathNameToTitle,
  formatPrice,
  formatTimeStampToDate,
} from "../../utils/index.js";
import Pagination from "../Pagination/Pagination.jsx";
import React, { lazy, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleDeleteModal,
  togglePickupImageModal,
} from "../../Redux/SideBarSlice/SideBarSlice.js";
import {
  addTempIdOneByOne,
  addTempIds,
  addTempIdsAll,
  addVehicleIdToDelete,
  removeTempIds,
} from "../../Redux/VehicleSlice/VehicleSlice.js";
import InputSwitch from "../InputAndDropdown/InputSwitch.jsx";
import CheckBoxInput from "../InputAndDropdown/CheckBoxInput.jsx";
import StatusChange from "./StatusChange.jsx";
import TableNotFound from "../Skeleton/TableNotFound.jsx";
import TableHeader from "./TableHeader.jsx";
const UploadPickupImageModal = lazy(() =>
  import("../../components/Modal/UploadPickupImageModal")
);
import { useDebounce } from "../../utils/Helper/debounce.js";
import { handleChangeSearchTerm } from "../../Redux/PaginationSlice/PaginationSlice.js";
import TableDataLoading from "../../components/Skeleton/TableDataLoading.jsx";
import TableActions from "./TableActions.jsx";
import UserDisplayCell from "./UserDisplayCell.jsx";
import BookingDateAndCityCell from "./BookingDateAndCityCell.jsx";
import TablePageHeader from "./TablePageHeader.jsx";

const CustomTable = ({ Data, pagination, searchTermQuery }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const { limit } = useSelector((state) => state.pagination);
  // const { token } = useSelector((state) => state.user);
  const [limitedData, setLimitedData] = useState(
    (limit && Number(limit)) || 10
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const showRecordsOptions = [10, 20, 25, 50, 100];
  //   sorting
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [Columns, setColumns] = useState([]);
  const [newUpdatedData, setNewUpdatedData] = useState([]);
  const [inputSearchQuery, setInputSearchQuery] = useState("");
  const searchTerm = useDebounce(inputSearchQuery, 500);
  const { tempIds } = useSelector((state) => state.vehicles);
  const dispatch = useDispatch();

  const loadFiltersAndData = () => {
    if (newUpdatedData && pagination) {
      const pageCount = Number(pagination?.totalPages);
      setTotalPages(pageCount);
      const start = (Number(pagination?.currentPage) - 1) * limitedData;
      const end = start + limitedData;
      // if there is data in sortedData
      if (sortedData) return setNewUpdatedData(sortedData?.slice(start, end));
    }
  };

  // resting the table data after every page change
  useEffect(() => {
    setColumns([]);
    setNewUpdatedData([]);
  }, [location.href]);

  // for loading filters
  useEffect(() => {
    loadFiltersAndData();
  }, [Data]);

  // Sorting function
  const sortData = (key) => {
    if (newUpdatedData) {
      const direction =
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc";
      const sorted = [...newUpdatedData].sort((a, b) => {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
      });
      setSortedData(sorted);
      setSortConfig({ key, direction });
    }
  };

  // for table header
  const getTableHeader = (Data) => {
    if (Data.length == 0) return;
    // Extract keys from the first item (assuming all items have the same structure)
    const keys = Object.keys(Data[0]);

    let filteredKeys = keys.filter(
      (key) =>
        ![
          "_id",
          "vehicleMasterId",
          "vehicleTableId",
          "stationMasterUserId",
          "vehiclePlan",
          "vehicleBasic",
          "stationId",
          "createdAt",
          "updatedAt",
          "latitude",
          "longitude",
          "imageFileName",
          "__v",
          "locationId",
          "freeKms",
          "extraKmsCharges",
          "vehicleModel",
          "vehicleColor",
          "vehicleBookingStatus",
          "refundableDeposit",
          "lateFee",
          "speedLimit",
          "kmsRun",
          "condition",
          "lastServiceDate",
          "country",
          // "userId",
        ].includes(key)
    );

    if (location.pathname == "/all-bookings") {
      filteredKeys = filteredKeys.filter(
        (item) =>
          ![
            "paySuccessId",
            "vehicleImage",
            "vehicleBrand",
            "paymentgatewayOrderId",
            "paymentgatewayReceiptId",
            "paymentInitiatedDate",
            "discountCuopon",
            "stationName",
            "paymentMethod",
            "payInitFrom",
          ].includes(item)
      );
    }

    if (
      location.pathname == "/payments" ||
      location.pathname == "/all-invoices" ||
      location.pathname == "/users-documents"
    ) {
      filteredKeys = filteredKeys.filter((item) => !["userId"].includes(item));
    }

    const header = [...filteredKeys];

    // Extract "Status" or "Active" columns
    const statusColumns = header.filter(
      (key) => key.includes("Status") || key.includes("Active")
    );

    // Remove "Status" or "Active" columns from the main list
    const filteredHeader = header.filter(
      (key) => !key.includes("Status") && !key.includes("Active")
    );
    // Add "Status" columns before "Actions" and push "Actions" at the end
    const finalHeader = [...filteredHeader, ...statusColumns].filter(Boolean);

    setColumns(finalHeader);
  };

  // for table value
  const getTableValue = (Data) => {
    if (Data.length == 0) return;

    let modifiedData = [...Data].sort((a, b) => {
      // Sort by `updatedAt` in descending order (latest first)
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    setNewUpdatedData(modifiedData);
    setSortedData(modifiedData);
  };

  //filtering data selecting only field we need
  useEffect(() => {
    if (Data) {
      if (searchTermQuery == null) {
        getTableHeader(Data);
      }
      getTableValue(Data);
    }
  }, [Data, totalPages]);

  // for changing data based on search query
  useEffect(() => {
    if (searchTerm) {
      dispatch(handleChangeSearchTerm(searchTerm));
    } else {
      dispatch(handleChangeSearchTerm(""));
    }
  }, [searchTerm]);

  // for delete the data
  const handleDeleteVehicle = (id) => {
    dispatch(addVehicleIdToDelete(id));
    dispatch(toggleDeleteModal());
  };

  const toggleSelectAll = (isChecked) => {
    if (isChecked) {
      if (!newUpdatedData) return;
      dispatch(addTempIdsAll(newUpdatedData?.map((item) => item?._id)));
    } else {
      dispatch(removeTempIds());
    }
  };

  const toggleSelectOne = (id) => {
    if (!id) return;
    // return dispatch(addTempIdOneByOne(id));
  };

  return (
    <>
      <div
        className={`flex flex-wrap items-center ${
          formatPathNameToTitle(location.pathname)
            ? "justify-between"
            : "justify-end"
        } mt-5 gap-4`}
      >
        {/* show this modal on specific page  */}
        {location.pathname == "/all-bookings" && <UploadPickupImageModal />}

        <TablePageHeader
          dispatch={dispatch}
          setInputSearchQuery={setInputSearchQuery}
        />
      </div>

      <div className="mt-5">
        <div className="flex flex-col">
          <div className=" overflow-x-auto pb-4 no-scrollbar">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden border shadow-lg rounded-lg border-gray-200 w-full">
                <table className="table-auto min-w-full rounded-xl">
                  <thead>
                    <tr className="bg-gray-50">
                      <TableHeader
                        Columns={Columns}
                        sortConfig={sortConfig}
                        sortData={sortData}
                        newUpdatedData={newUpdatedData}
                        toggleSelectAll={toggleSelectAll}
                      />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300 ">
                    {Data && newUpdatedData && newUpdatedData != [] ? (
                      newUpdatedData && newUpdatedData.length > 0 ? (
                        newUpdatedData.map((item) => (
                          <tr
                            className="bg-white transition-all duration-500 hover:bg-gray-50"
                            key={item?._id}
                          >
                            {location.pathname == "/all-vehicles" && (
                              <td className="p-3 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                                <CheckBoxInput
                                  handleChange={toggleSelectOne}
                                  tempIds={tempIds}
                                  data={newUpdatedData}
                                  isId={item?._id}
                                  unique={item?._id}
                                />
                              </td>
                            )}
                            {item.files &&
                              Array.from({
                                length:
                                  location.pathname == "/users-documents"
                                    ? 2
                                    : 6,
                              }).map((_, index) => (
                                <td className="p-3" key={index}>
                                  {item.files[index] ? (
                                    <img
                                      src={item.files[index].imageUrl}
                                      alt={item.files[index].fileName}
                                      className="w-28 h-20 object-contain"
                                    />
                                  ) : (
                                    "N/A"
                                  )}
                                </td>
                              ))}
                            {/* dynamically rendering */}
                            {Columns.filter(
                              (column) =>
                                !column.includes("Status") &&
                                !column.includes("Active")
                            )
                              // .slice(0, Columns.length - 1)
                              .map((column, columnIndex) => {
                                if (column === "userId") {
                                  return (
                                    <UserDisplayCell
                                      key={`${item?._id}_userDisplayCell`}
                                      item={item}
                                    />
                                  );
                                }
                                if (
                                  column === "BookingStartDateAndTime" ||
                                  column === "city"
                                ) {
                                  return (
                                    <BookingDateAndCityCell
                                      key={item?._id}
                                      item={item}
                                      column={column}
                                    />
                                  );
                                }
                                // Skip rendering `BookingEndDateAndTime` data to avoid duplication
                                if (
                                  column === "BookingEndDateAndTime" ||
                                  column === "state"
                                ) {
                                  return null;
                                }
                                // Default behavior for other columns
                                return column.includes("Image") ? (
                                  <td className="p-3" key={columnIndex}>
                                    <div className="flex items-center gap-3 text-center">
                                      <img
                                        src={item[column]}
                                        className="w-28 h-20 object-contain"
                                      />
                                    </div>
                                  </td>
                                ) : typeof item[column] === "object" ? (
                                  <td
                                    className="p-3 whitespace-nowrap text-sm leading-6 font-medium text-gray-900"
                                    key={columnIndex}
                                  >
                                    {column.includes("Documents") ||
                                    column.includes("Users")
                                      ? item[column].length
                                      : `₹${formatPrice(
                                          item[column]?.discountTotalPrice &&
                                            item[column]?.discountTotalPrice !=
                                              0
                                            ? item[column]?.discountTotalPrice
                                            : item[column]?.totalPrice
                                        )}`}
                                  </td>
                                ) : (
                                  <td
                                    className={`p-3 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 ${
                                      column?.includes("email")
                                        ? ""
                                        : "capitalize"
                                    }`}
                                    key={columnIndex}
                                  >
                                    {column.includes("Charges") ||
                                    column.includes("Deposit") ||
                                    column.includes("Cost") ||
                                    column.includes("Price")
                                      ? `₹ ${formatPrice(item[column])}`
                                      : column.includes("Duration")
                                      ? `${item[column]} Days`
                                      : column.includes("DateAndTime")
                                      ? formatFullDateAndTime(item[column])
                                      : column?.includes("InitiatedDate")
                                      ? item[column] !== "NA"
                                        ? formatTimeStampToDate(item[column])
                                        : ""
                                      : column?.includes("bookingId")
                                      ? `#${item[column]}`
                                      : item[column]}
                                  </td>
                                );
                              })}
                            {/* Render "Status" or "Active" columns at the end */}
                            {Columns.filter(
                              (column) =>
                                column.includes("Status") ||
                                column.includes("Active")
                            ).map((column, columnIndex) =>
                              (location?.pathname === "/location-master" &&
                                column.includes("Status")) ||
                              (location?.pathname === "/all-vehicles" &&
                                column.includes("vehicleStatus")) ? (
                                <td
                                  className="p-3 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 pl-4"
                                  key={columnIndex}
                                >
                                  <InputSwitch
                                    value={item[column]}
                                    id={item?._id}
                                  />
                                </td>
                              ) : (
                                <td
                                  className="p-3 whitespace-nowrap text-sm leading-6 font-medium text-gray-900"
                                  key={columnIndex}
                                >
                                  <StatusChange item={item} column={column} />
                                </td>
                              )
                            )}
                            <TableActions
                              item={item}
                              loadingStates={loadingStates}
                              setLoadingStates={setLoadingStates}
                              handleDeleteVehicle={handleDeleteVehicle}
                            />
                          </tr>
                        ))
                      ) : (
                        <TableNotFound />
                      )
                    ) : (
                      <TableDataLoading />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {pagination?.limit >= 10 && (
        <div className="flex flex-wrap items-center justify-start lg:justify-end gap-4 lg:gap-2">
          <div className="flex items-center gap-2">
            <h2 className="capitalize">Rows per Page</h2>
            <DropDownComponent
              defaultValue={limitedData}
              options={showRecordsOptions}
              setValue={setLimitedData}
            />
          </div>
          <span className="hidden lg:mx-1">|</span>
          <Pagination
            totalNumberOfPages={totalPages}
            currentPage={currentPage}
            setPageChanger={setCurrentPage}
          />
        </div>
      )}
    </>
  );
};

export default CustomTable;
