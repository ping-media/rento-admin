import DropDownComponent from "../DropDown/DropDownComponent.jsx";
import {
  changeNumberIntoTime,
  formatPathNameToTitle,
} from "../../utils/index.js";
import Pagination from "../Pagination/Pagination.jsx";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleDeleteModal } from "../../Redux/SideBarSlice/SideBarSlice.js";
import { addVehicleIdToDelete } from "../../Redux/VehicleSlice/VehicleSlice.js";
import InputSwitch from "../InputAndDropdown/InputSwitch.jsx";
import CheckBoxInput from "../InputAndDropdown/CheckBoxInput.jsx";
import StatusChange from "./StatusChange.jsx";
import TableNotFound from "../Skeleton/TableNotFound.jsx";
import TableHeader from "./TableHeader.jsx";
import { useDebounce } from "../../utils/Helper/debounce.js";
import { handleChangeSearchTerm } from "../../Redux/PaginationSlice/PaginationSlice.js";
import TableDataLoading from "../../components/Skeleton/TableDataLoading.jsx";
import TableActions from "./TableActions.jsx";
import UserDisplayCell from "./UserDisplayCell.jsx";
import BookingDateAndCityCell from "./BookingDateAndCityCell.jsx";
import TablePageHeader from "./TablePageHeader.jsx";
import UserStatusCell from "./UserStatusCell.jsx";
import CopyButton from "../../components/Buttons/CopyButton.jsx";
import TableImage from "./TableImageWithPopupShow.jsx";
import BookingCard from "../../components/Card/BookingCard.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import CardNotFound from "../../components/Skeleton/CardNotFound.jsx";
import CardDataLoading from "../../components/Skeleton/CardDataLoading.jsx";
import RenderCellContent from "./RenderCellContent.jsx";
import PriceCell from "./PriceCell.jsx";

const CustomTable = ({ Data, pagination, searchTermQuery, dataLoading }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const { limit } = useSelector((state) => state.pagination);
  const { loggedInRole } = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const showRecordsOptions = [25, 50, 100, 200, 500];
  //   sorting
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [Columns, setColumns] = useState([]);
  const [newUpdatedData, setNewUpdatedData] = useState([]);
  const [inputSearchQuery, setInputSearchQuery] = useState("");
  const searchTerm = useDebounce(inputSearchQuery, 500);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadFiltersAndData = useCallback(() => {
    if (newUpdatedData && pagination) {
      let dataToDisplay = [...sortedData];

      if (
        inputSearchQuery.trim() !== "" &&
        location.pathname === "/all-vehicles"
      ) {
        setTotalPages(1);
      } else {
        const pageCount = Number(pagination?.totalPages);
        setTotalPages(pageCount);
        const start = (Number(pagination?.currentPage) - 1) * limit;
        const end = start + limit;
        dataToDisplay = sortedData?.slice(start, end);
      }

      setNewUpdatedData(dataToDisplay);
    }
  }, [newUpdatedData, pagination?.totalPages, pagination?.currentPage]);

  // resting the table data after every page change
  useEffect(() => {
    setColumns([]);
    setNewUpdatedData([]);
  }, [location.href]);

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
      setNewUpdatedData(sorted);
      setSortConfig({ key, direction });
    }
  };

  // for table header
  const getTableHeader = (Data) => {
    if (Data.length == 0) return;
    const keys = Object.keys(Data[0]);

    let filteredKeys = keys.filter(
      (key) =>
        ![
          "_id",
          "vehicleMasterId",
          "vehicleTableId",
          "stationMasterUserId",
          "vehiclePlan",
          "pinCode",
          "vehicleBrand",
          "vehicleBasic",
          "stationId",
          "createdAt",
          "updatedAt",
          "latitude",
          "bookedFrom",
          "longitude",
          "imageFileName",
          "__v",
          "locationId",
          "freeKms",
          "extraKmsCharges",
          "vehicleModel",
          "vehicleBookingStatus",
          "refundableDeposit",
          "lateFee",
          "speedLimit",
          "kmsRun",
          "condition",
          "lastServiceDate",
          "country",
          "altContact",
          "dateofbirth",
          "gender",
          "addressProof",
          "address",
          "drivingLicence",
          "paymentUpdates",
          "lastMeterReading",
          "mapLink",
          "mobileToken",
          "weekendPriceIncrease",
          "weekendPercentage",
          "isGstActive",
          "gstPercentage",
          "extraAddOn",
          "transactionType",
          "payments",
        ].includes(key),
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
            "paymentMethod",
            "payInitFrom",
            "notes",
            "extendBooking",
            "changeVehicle",
            "paymentStatus",
          ].includes(item),
      );
    }

    if (location.pathname == "/all-vehicles") {
      filteredKeys = filteredKeys.filter(
        (item) => !["vehicleImage"].includes(item),
      );
    }

    if (
      location.pathname == "/payments" ||
      location.pathname == "/all-invoices"
    ) {
      filteredKeys = filteredKeys.filter(
        (item) => !["userId", "paymentMethod"].includes(item),
      );
    }

    if (location.pathname == "/all-invoices") {
      filteredKeys = filteredKeys.filter(
        (item) => !["userId", "email", "paidInvoice"].includes(item),
      );
    }

    let header = [...filteredKeys];

    const statusColumns = header.filter(
      (key) => key.includes("Status") || key.includes("Active"),
    );

    const filteredHeader = header.filter(
      (key) => !key.includes("Status") && !key.includes("Active"),
    );

    const finalHeader = [...filteredHeader, ...statusColumns].filter(Boolean);

    setColumns(finalHeader);
  };

  // for table value
  const getTableValue = (Data) => {
    if (Data.length == 0) return;
    setNewUpdatedData(Data);
    setSortedData(Data);
  };

  //filtering data selecting only field we need
  useEffect(() => {
    if (Data) {
      if (searchTermQuery == null) {
        getTableHeader(Data);
      }
      loadFiltersAndData();
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
      dispatch(handleChangeSearchTerm(null));
    }
  }, [searchTerm]);

  // for delete the data
  const handleDeleteVehicle = (id) => {
    dispatch(addVehicleIdToDelete(id));
    dispatch(toggleDeleteModal());
  };

  // let user enter in view page or edit page when click on table row
  const handleViewData = useCallback(
    (item) => {
      const { _id: id, bookingId } = item;

      const url =
        location.pathname === "/all-bookings"
          ? `details/${id}_${bookingId.toString()}`
          : location.pathname === "/all-vehicles" ||
              location.pathname === "/all-invoices"
            ? `details/${id}`
            : location?.pathname === "/payments"
              ? "#"
              : `${id}`;

      navigate(url);
    },
    [navigate, location.pathname],
  );

  // Add this useEffect to clear data when loading starts
  useEffect(() => {
    if (dataLoading) {
      setNewUpdatedData([]);
    }
  }, [dataLoading]);

  return (
    <>
      <div
        className={`flex flex-wrap items-center ${
          formatPathNameToTitle(location.pathname)
            ? "justify-between"
            : "justify-end"
        } mt-1 gap-2 lg:gap-4`}
      >
        <TablePageHeader
          inputSearchQuery={inputSearchQuery}
          setInputSearchQuery={setInputSearchQuery}
          bookingData={newUpdatedData}
        />
      </div>

      {/* table view  */}
      <div
        className={`${
          location.pathname === "/all-bookings" ? "hidden lg:block" : ""
        } mt-5`}
      >
        <div className="flex flex-col">
          <div className=" overflow-x-auto pb-4">
            <div className="min-w-full inline-block align-middle">
              <div className="relative overflow-hidden border shadow-lg rounded-lg border-gray-200 w-full">
                {dataLoading ? (
                  <table className="table-auto min-w-full rounded-xl">
                    <thead>
                      <tr className="bg-gray-50">
                        {/* Show generic loading headers */}
                        {Array.from({ length: 7 }).map((_, i) => (
                          <th key={i} className="px-2 py-3 text-left">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                      <TableDataLoading />
                    </tbody>
                  </table>
                ) : (
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
                      {newUpdatedData?.length > 0 ? (
                        newUpdatedData.map((item, index) => (
                          <tr
                            className={`bg-white transition-all duration-500 hover:bg-gray-50 max-h-[10vh] ${location.pathname === "/payments" ? "" : "cursor-pointer"}`}
                            key={`row-${item._id}-${index}`}
                            onClick={() => handleViewData(item)}
                          >
                            {/* Checkbox column for all-vehicles page */}
                            {location.pathname === "/all-vehicles" && (
                              <td
                                className="px-2 py-1 whitespace-nowrap text-md lg:text-sm font-medium text-gray-900"
                                key={`checkbox-${item._id}-${index}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <CheckBoxInput isId={item?._id} />
                              </td>
                            )}
                            <td
                              className="px-2 py-1 whitespace-nowrap text-md lg:text-sm font-medium text-gray-900"
                              key={`slNo-${index}`}
                            >
                              {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </td>
                            {/* Main columns render - filtering out status and special columns */}
                            {Columns.filter(
                              (column) =>
                                !column.includes("Status") &&
                                !column.includes("status") &&
                                !column.includes("Active") &&
                                !column.includes("Invoice"),
                            ).map((column, columnIndex) => {
                              // Skip certain columns that should not be rendered
                              if (
                                column === "state" ||
                                column === "isContactVerified" ||
                                column === "isDocumentVerified" ||
                                column === "kycApproved" ||
                                column === "openEndTime" ||
                                (["lastName", "contact"].includes(column) &&
                                  [
                                    "/all-invoices",
                                    "/all-users",
                                    "/all-managers",
                                  ].includes(location.pathname))
                              ) {
                                return null;
                              }
                              const cellKey = `cell-${item._id}-${column}-${columnIndex}-${index}`;

                              if (column === "userId") {
                                return (
                                  <UserDisplayCell
                                    key={cellKey}
                                    item={item}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                );
                              }

                              if (column === "city") {
                                return (
                                  <BookingDateAndCityCell
                                    key={cellKey}
                                    item={item}
                                    column={column}
                                  />
                                );
                              }

                              if (column === "isEmailVerified") {
                                return (
                                  <UserStatusCell
                                    key={cellKey}
                                    item={item}
                                    index={columnIndex}
                                  />
                                );
                              }

                              if (column === "couponName") {
                                return (
                                  <td
                                    className="px-2 py-1 max-w-36 lg:max-w-24 whitespace-nowrap text-md lg:text-sm font-medium text-gray-900 flex items-center"
                                    key={cellKey}
                                  >
                                    {item[column]}{" "}
                                    <CopyButton textToCopy={item[column]} />
                                  </td>
                                );
                              }

                              if (column === "openStartTime") {
                                return (
                                  <td
                                    className="px-2 py-1 whitespace-nowrap text-md lg:text-sm font-medium text-gray-900"
                                    key={cellKey}
                                  >
                                    <p>{`${changeNumberIntoTime(
                                      item?.openStartTime,
                                    )} - ${changeNumberIntoTime(
                                      item?.openEndTime,
                                    )}`}</p>
                                  </td>
                                );
                              }

                              if (
                                column === "firstName" &&
                                [
                                  "/all-invoices",
                                  "/all-users",
                                  "/all-managers",
                                ].includes(location.pathname)
                              ) {
                                return (
                                  <UserDisplayCell
                                    key={cellKey}
                                    firstName={item?.firstName}
                                    lastName={item?.lastName}
                                    Contact={item?.contact}
                                  />
                                );
                              }

                              if (column.includes("Image")) {
                                return (
                                  <TableImage
                                    key={cellKey}
                                    item={item}
                                    column={column}
                                  />
                                );
                              }

                              if (typeof item[column] === "object") {
                                const paymentKey = `payment-${item._id}-${column}-${columnIndex}-${index}`;
                                // const priceKey = `price-${item._id}-${column}-${columnIndex}-${index}`;

                                return (
                                  <React.Fragment key={cellKey}>
                                    <PriceCell
                                      key={paymentKey}
                                      item={item}
                                      column={column}
                                    />
                                  </React.Fragment>
                                );
                              }

                              return (
                                <td
                                  className={`px-2 py-1 text-md lg:text-sm font-medium text-gray-900 ${
                                    column?.includes("email")
                                      ? ""
                                      : "capitalize"
                                  } ${
                                    [
                                      "address",
                                      "email",
                                      "stationName",
                                    ].includes(column)
                                      ? "max-w-32 truncate"
                                      : column.includes("vehicleName")
                                        ? "max-w-24 truncate"
                                        : "whitespace-nowrap"
                                  }`}
                                  key={cellKey}
                                >
                                  {RenderCellContent(
                                    column,
                                    item[column],
                                    item,
                                    location,
                                  )}
                                </td>
                              );
                            })}

                            {/* Status columns render */}
                            {Columns.filter(
                              (column) =>
                                column.includes("Status") ||
                                column.includes("status") ||
                                column.includes("Active") ||
                                column.includes("Invoice"),
                            ).map((column, columnIndex) => {
                              const isVehicleOrLocationStatus =
                                (location?.pathname === "/location-master" &&
                                  column.includes("Status")) ||
                                (location?.pathname === "/all-vehicles" &&
                                  column.includes("vehicleStatus")) ||
                                (location?.pathname === "/station-master" &&
                                  column.includes("status")) ||
                                (location?.pathname === "/vehicle-master" &&
                                  column.includes("status"));

                              const statusKey = `status-${item._id}-${column}-${columnIndex}-${index}`;

                              return isVehicleOrLocationStatus ? (
                                <td
                                  className="px-2 py-1 whitespace-nowrap text-md lg:text-sm font-medium text-gray-900"
                                  key={statusKey}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <InputSwitch
                                    value={item[column]}
                                    id={item?._id}
                                  />
                                </td>
                              ) : column.includes("rideStatus") ? (
                                <td
                                  className="px-2 py-1 whitespace-nowrap text-md lg:text-sm font-medium text-gray-900"
                                  key={statusKey}
                                >
                                  <p className="bg-gray-300/20 border border-gray-300/60 tracking-wider p-1 text-center rounded-md uppercase text-xs">
                                    {["pending", "canceled"].includes(
                                      item[column],
                                    )
                                      ? "Not Started"
                                      : item[column] === "completed"
                                        ? item[column]
                                        : "Started"}
                                  </p>
                                </td>
                              ) : (
                                <td
                                  className="px-2 py-1 whitespace-nowrap text-md lg:text-sm font-medium text-gray-900"
                                  key={statusKey}
                                >
                                  <StatusChange item={item} column={column} />
                                </td>
                              );
                            })}

                            {/* Action buttons */}
                            {loggedInRole !== "manager" && (
                              <TableActions
                                item={item}
                                loadingStates={loadingStates}
                                setLoadingStates={setLoadingStates}
                                handleDeleteVehicle={handleDeleteVehicle}
                                key={`actions-${item._id}-${index}`}
                              />
                            )}
                          </tr>
                        ))
                      ) : (
                        <TableNotFound
                          ColumnsCount={
                            (location.pathname == "/all-vehicles"
                              ? Columns?.length + 2
                              : Columns?.length + 1) || 7
                          }
                        />
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* card view for bookings page only  */}
      {location.pathname === "/all-bookings" && (
        <div
          className={`${
            location.pathname === "/all-bookings" ? "lg:hidden" : ""
          } mt-5`}
        >
          {!dataLoading && Data ? (
            newUpdatedData && newUpdatedData.length > 0 ? (
              newUpdatedData.map((item) => (
                <BookingCard item={item} key={item?._id} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-52 bg-white rounded-xl shadow-xl">
                <CardNotFound />
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-52 bg-white rounded-xl">
              <CardDataLoading />
            </div>
          )}
        </div>
      )}

      {pagination?.limit >= 10 && newUpdatedData?.length > 0 && (
        <div className="flex flex-wrap items-center justify-start lg:justify-between gap-4 lg:gap-2">
          <div className="flex items-center gap-2">
            <h2 className="capitalize">Rows per Page</h2>
            <DropDownComponent options={showRecordsOptions} />
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
