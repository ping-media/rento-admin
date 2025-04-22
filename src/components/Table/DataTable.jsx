import DropDownComponent from "../DropDown/DropDownComponent.jsx";
import {
  changeNumberIntoTime,
  formatFullDateAndTime,
  formatPathNameToTitle,
  formatPrice,
  formatTimeStampToDate,
} from "../../utils/index.js";
import Pagination from "../Pagination/Pagination.jsx";
import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import CardNotFound from "../../components/Skeleton/CardNotFound.jsx";
import CardDataLoading from "../../components/Skeleton/CardDataLoading.jsx";
import MaintenanceStatusBadge from "./MaintenanceBadge.jsx";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadFiltersAndData = () => {
    if (newUpdatedData && pagination) {
      const pageCount = Number(pagination?.totalPages);
      setTotalPages(pageCount);
      const start = (Number(pagination?.currentPage) - 1) * limit;
      const end = start + limit;
      // if there is data in sortedData
      if (sortedData) return setNewUpdatedData(sortedData?.slice(start, end));
    }
  };

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
          // "perDayCost",
          "vehicleBrand",
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
          "drivingLicence",
          "paymentUpdates",
          "lastMeterReading",
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
            "extendBooking",
            "changeVehicle",
            "paymentStatus",
          ].includes(item)
      );
    }

    if (
      location.pathname == "/payments" ||
      location.pathname == "/all-invoices"
      // location.pathname == "/users-documents"
    ) {
      filteredKeys = filteredKeys.filter(
        (item) => !["userId", "paymentMethod"].includes(item)
      );
    }

    if (
      location.pathname == "/all-invoices"
      // location.pathname == "/users-documents"
    ) {
      filteredKeys = filteredKeys.filter(
        (item) => !["userId", "email", "paidInvoice"].includes(item)
      );
    }

    let header = [...filteredKeys];

    // header = header.map((key) =>
    //   key === "isCouponActive" ? "Coupon Status" : key
    // );

    const statusColumns = header.filter(
      (key) => key.includes("Status") || key.includes("Active")
    );

    const filteredHeader = header.filter(
      (key) => !key.includes("Status") && !key.includes("Active")
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
  const handleViewData = (id) => {
    navigate(
      location.pathname === "/all-bookings" ||
        location.pathname === "/all-vehicles" ||
        location.pathname === "/all-invoices"
        ? `details/${id}`
        : location?.pathname === "/payments"
        ? "#"
        : `${id}`
    );
  };

  const renderCellContent = (column, value) => {
    if (!value && value !== 0) return "";

    if (
      column.includes("Charges") ||
      column.includes("Deposit") ||
      column.includes("Cost") ||
      column.includes("Price")
    ) {
      return `₹ ${formatPrice(value)}`;
    }

    if (column.includes("Duration")) {
      return `${value} Days`;
    }

    if (column.includes("DateAndTime")) {
      return formatFullDateAndTime(value);
    }

    if (column?.includes("InitiatedDate")) {
      return value !== "NA" ? formatTimeStampToDate(value) : "";
    }

    if (column?.includes("bookingId")) {
      return `#${value}`;
    }

    if (column?.includes("paymentMethod")) {
      return value === "partiallyPay" ? "online" : value;
    }

    return value;
  };

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
        />
      </div>

      {/* table view  */}
      <div
        className={`${
          location.pathname === "/all-bookings" ? "hidden lg:block" : ""
        } mt-5`}
      >
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
                        newUpdatedData.map((item, index) => (
                          <tr
                            className="bg-white transition-all duration-500 hover:bg-gray-50 max-h-[10vh] cursor-pointer"
                            key={`row-${item._id}-${index}`}
                            onClick={() => handleViewData(item?._id)}
                          >
                            {/* Checkbox column for all-vehicles page */}
                            {location.pathname === "/all-vehicles" && (
                              <td
                                className="p-2 whitespace-nowrap text-sm font-medium text-gray-900"
                                key={`checkbox-${item._id}-${index}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <CheckBoxInput isId={item?._id} />
                              </td>
                            )}

                            {/* Main columns render - filtering out status and special columns */}
                            {Columns.filter(
                              (column) =>
                                !column.includes("Status") &&
                                !column.includes("status") &&
                                !column.includes("Active") &&
                                !column.includes("Invoice")
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
                                    className="p-2 max-w-36 lg:max-w-24 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center"
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
                                    className="p-2 whitespace-nowrap text-sm font-medium text-gray-900"
                                    key={cellKey}
                                  >
                                    <p>{`${changeNumberIntoTime(
                                      item?.openStartTime
                                    )} - ${changeNumberIntoTime(
                                      item?.openEndTime
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
                                const priceKey = `price-${item._id}-${column}-${columnIndex}-${index}`;

                                return (
                                  <React.Fragment key={cellKey}>
                                    {location?.pathname === "/payments" && (
                                      <td
                                        className="p-2 whitespace-nowrap text-sm font-medium text-gray-900"
                                        key={paymentKey}
                                      >
                                        ₹{" "}
                                        {item?.paymentStatus ===
                                          "partially_paid" ||
                                        item?.paymentStatus === "partiallyPay"
                                          ? formatPrice(
                                              item?.bookingPrice?.userPaid
                                            )
                                          : item?.bookingPrice
                                              ?.discountTotalPrice > 0
                                          ? formatPrice(
                                              item?.bookingPrice
                                                ?.discountTotalPrice
                                            )
                                          : formatPrice(
                                              item?.bookingPrice?.totalPrice
                                            )}
                                      </td>
                                    )}
                                    <td
                                      className={`p-2 whitespace-nowrap text-sm font-medium text-gray-900 ${
                                        column.includes("maintenance")
                                          ? "capitalize"
                                          : ""
                                      }`}
                                      key={priceKey}
                                    >
                                      {column.includes("maintenance") &&
                                        console.log()}
                                      {column.includes(
                                        "files"
                                      ) ? null : column.includes(
                                          // ) //   ) //     `${item[column]?.length} Plan Applied` //   ) : ( //     "No Plan Applied" //   item[column]?.length === 0 ? ( // column.includes("Plan") ? (
                                          "maintenance"
                                        ) ? (
                                        <MaintenanceStatusBadge
                                          maintenanceList={item[column]}
                                        />
                                      ) : (
                                        `₹${formatPrice(
                                          item[column]?.isDiscountZero ===
                                            true ||
                                            (item[column]?.discountTotalPrice &&
                                              item[column]
                                                ?.discountTotalPrice != 0)
                                            ? item[column]?.discountTotalPrice
                                            : item[column]?.totalPrice
                                        )}`
                                      )}
                                    </td>
                                  </React.Fragment>
                                );
                              }

                              return (
                                <td
                                  className={`p-2 text-sm font-medium text-gray-900 ${
                                    column?.includes("email")
                                      ? ""
                                      : "capitalize"
                                  } ${
                                    // column?.includes("address")
                                    ["address", "vehicleName"].includes(column)
                                      ? "max-w-40"
                                      : "whitespace-nowrap"
                                  }`}
                                  key={cellKey}
                                >
                                  {renderCellContent(column, item[column])}
                                </td>
                              );
                            })}

                            {/* Status columns render */}
                            {Columns.filter(
                              (column) =>
                                column.includes("Status") ||
                                column.includes("status") ||
                                column.includes("Active") ||
                                column.includes("Invoice")
                            ).map((column, columnIndex) => {
                              const isVehicleOrLocationStatus =
                                (location?.pathname === "/location-master" &&
                                  column.includes("Status")) ||
                                (location?.pathname === "/all-vehicles" &&
                                  column.includes("vehicleStatus"));

                              const statusKey = `status-${item._id}-${column}-${columnIndex}-${index}`;

                              return isVehicleOrLocationStatus ? (
                                <td
                                  className="p-2 whitespace-nowrap text-sm font-medium text-gray-900 pl-4"
                                  key={statusKey}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <InputSwitch
                                    value={item[column]}
                                    id={item?._id}
                                  />
                                </td>
                              ) : (
                                <td
                                  className="p-2 whitespace-nowrap text-sm font-medium text-gray-900"
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
