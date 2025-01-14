import DropDownComponent from "../DropDown/DropDownComponent.jsx";
import {
  formatFullDateAndTime,
  formatPathNameToTitle,
  formatPrice,
  formatTimeStampToDate,
} from "../../utils/index.js";
import Pagination from "../Pagination/Pagination.jsx";
import React, { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleDeleteModal } from "../../Redux/SideBarSlice/SideBarSlice.js";
import { addVehicleIdToDelete } from "../../Redux/VehicleSlice/VehicleSlice.js";
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
import UserStatusCell from "./UserStatusCell.jsx";
import UserDocumentCell from "./UserDocumentCell.jsx";
import CopyButton from "../../components/Buttons/CopyButton.jsx";
import TableImage from "./TableImageWithPopupShow.jsx";

const CustomTable = ({ Data, pagination, searchTermQuery, dataLoading }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const { limit } = useSelector((state) => state.pagination);
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
            "notes",
          ].includes(item)
      );
    }

    if (
      location.pathname == "/payments" ||
      location.pathname == "/all-invoices"
      // location.pathname == "/users-documents"
    ) {
      filteredKeys = filteredKeys.filter((item) => !["userId"].includes(item));
    }

    if (
      location.pathname == "/all-invoices"
      // location.pathname == "/users-documents"
    ) {
      filteredKeys = filteredKeys.filter(
        (item) =>
          !["userId", "firstName", "lastName", "contact", "email"].includes(
            item
          )
      );
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
    // Sort by `updatedAt` in descending order (latest first)
    // let modifiedData = [...Data].sort((a, b) => {
    //   return new Date(b.updatedAt) - new Date(a.updatedAt);
    // });
    setNewUpdatedData(Data);
    setSortedData(Data);
  };

  //filtering data selecting only field we need
  useEffect(() => {
    if (Data) {
      if (searchTermQuery == null) {
        getTableHeader(Data);
      }
      // clear the previous data
      setNewUpdatedData([]);
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
        <TablePageHeader setInputSearchQuery={setInputSearchQuery} />
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
                      />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {!dataLoading && Data ? (
                      newUpdatedData && newUpdatedData.length > 0 ? (
                        newUpdatedData.map((item) => (
                          <tr
                            className="bg-white transition-all duration-500 hover:bg-gray-50 max-h-[10vh]"
                            key={item?._id}
                          >
                            {location.pathname == "/all-vehicles" && (
                              <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                <CheckBoxInput isId={item?._id} />
                              </td>
                            )}
                            {/* dynamically rendering */}
                            {Columns.filter(
                              (column) =>
                                !column.includes("Status") &&
                                !column.includes("status") &&
                                !column.includes("Active") &&
                                !column.includes("Invoice")
                            )
                              // .slice(0, Columns.length - 1)
                              .map((column, columnIndex) => {
                                if (column === "files") {
                                  return (
                                    <UserDocumentCell
                                      item={item}
                                      key={columnIndex}
                                    />
                                  );
                                }
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
                                if (column === "isEmailVerified") {
                                  return (
                                    <UserStatusCell
                                      item={item}
                                      index={columnIndex}
                                    />
                                  );
                                }
                                if (column === "couponName") {
                                  return (
                                    <td
                                      className="p-3 max-w-24 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center"
                                      key={columnIndex}
                                    >
                                      {item[column]}{" "}
                                      <CopyButton textToCopy={item[column]} />
                                    </td>
                                  );
                                }
                                // Skip rendering `BookingEndDateAndTime` data to avoid duplication
                                if (
                                  column === "BookingEndDateAndTime" ||
                                  column === "state" ||
                                  column === "isContactVerified" ||
                                  column === "isDocumentVerified" ||
                                  column === "kycApproved"
                                ) {
                                  return null;
                                }
                                // Default behavior for other columns
                                return column.includes("Image") ? (
                                  <TableImage
                                    item={item}
                                    column={column}
                                    columnIndex={columnIndex}
                                  />
                                ) : typeof item[column] === "object" ? (
                                  <td
                                    className="p-3 whitespace-nowrap text-sm font-medium text-gray-900"
                                    key={columnIndex}
                                  >
                                    {column.includes("files")
                                      ? null
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
                                    className={`p-3 whitespace-nowrap text-sm font-medium text-gray-900 ${
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
                                column.includes("status") ||
                                column.includes("Active") ||
                                column.includes("Invoice")
                            ).map((column, columnIndex) =>
                              (location?.pathname === "/location-master" &&
                                column.includes("Status")) ||
                              (location?.pathname === "/all-vehicles" &&
                                column.includes("vehicleStatus")) ? (
                                <td
                                  className="p-3 whitespace-nowrap text-sm font-medium text-gray-900 pl-4"
                                  key={columnIndex}
                                >
                                  <InputSwitch
                                    value={item[column]}
                                    id={item?._id}
                                  />
                                </td>
                              ) : (
                                <td
                                  className="p-3 whitespace-nowrap text-sm font-medium text-gray-900"
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

      {pagination?.limit >= 10 && newUpdatedData?.length > 0 && (
        <div className="flex flex-wrap items-center justify-start lg:justify-between gap-4 lg:gap-2">
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
