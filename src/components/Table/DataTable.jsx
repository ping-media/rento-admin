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

const CustomTable = ({ Data, pagination, searchTermQuery, dataLoading }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const { limit } = useSelector((state) => state.pagination);
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

  return (
    <>
      <div
        className={`flex flex-wrap items-center ${
          formatPathNameToTitle(location.pathname)
            ? "justify-between"
            : "justify-end"
        } mt-1 gap-4`}
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
                            key={`row-${index}` || item?._id}
                            onClick={() => handleViewData(item?._id)}
                          >
                            {location.pathname == "/all-vehicles" && (
                              <td
                                className="p-3 whitespace-nowrap text-sm font-medium text-gray-900"
                                onClick={(e) => e.stopPropagation()}
                              >
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
                            ).map((column, columnIndex) => {
                              if (column === "userId") {
                                return (
                                  <UserDisplayCell
                                    key={`${columnIndex + 1}_userDisplay`}
                                    item={item}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                );
                              }
                              if (column === "city") {
                                return (
                                  <BookingDateAndCityCell
                                    key={`${
                                      columnIndex + 1
                                    }_bookingDateAndCity`}
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
                                    key={`UserVerification_${columnIndex + 1}`}
                                  />
                                );
                              }
                              if (column === "couponName") {
                                return (
                                  <td
                                    className="p-3 max-w-24 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center"
                                    key={`${columnIndex + 1}_copy`}
                                  >
                                    {item[column]}{" "}
                                    <CopyButton textToCopy={item[column]} />
                                  </td>
                                );
                              }
                              if (column === "openStartTime") {
                                return (
                                  <td
                                    className="p-3 whitespace-nowrap text-sm font-medium text-gray-900"
                                    key={`${columnIndex + 1}_Time`}
                                  >
                                    <p>
                                      {`${changeNumberIntoTime(
                                        item?.openStartTime
                                      )} - ${changeNumberIntoTime(
                                        item?.openEndTime
                                      )}`}
                                    </p>
                                  </td>
                                );
                              }
                              if (
                                location.pathname === "/all-invoices" ||
                                location?.pathname === "/all-users" ||
                                location?.pathname === "/all-managers"
                              ) {
                                if (column === "firstName") {
                                  return (
                                    <UserDisplayCell
                                      key={`${item?._id}_userDisplayCell`}
                                      firstName={item?.firstName}
                                      lastName={item?.lastName}
                                      Contact={item?.contact}
                                    />
                                  );
                                }
                                if (
                                  column === "lastName" ||
                                  column === "contact"
                                ) {
                                  return null;
                                }
                              }
                              // Skip rendering `BookingEndDateAndTime` data to avoid duplication
                              if (
                                column === "state" ||
                                column === "isContactVerified" ||
                                column === "isDocumentVerified" ||
                                column === "kycApproved" ||
                                column === "openEndTime"
                              ) {
                                return null;
                              }
                              // Default behavior for other columns
                              return column.includes("Image") ? (
                                <TableImage
                                  item={item}
                                  column={column}
                                  key={`${columnIndex}_tableImage`}
                                />
                              ) : typeof item[column] === "object" ? (
                                <>
                                  {location?.pathname === "/payments" && (
                                    <td
                                      className="p-3 whitespace-nowrap text-sm font-medium text-gray-900"
                                      key={`${columnIndex}_payment`}
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
                                    className="p-3 whitespace-nowrap text-sm font-medium text-gray-900"
                                    key={`${columnIndex}_discount`}
                                  >
                                    {column.includes("files")
                                      ? null
                                      : `₹${formatPrice(
                                          item[column]?.isDiscountZero ===
                                            true ||
                                            (item[column]?.discountTotalPrice &&
                                              item[column]
                                                ?.discountTotalPrice != 0)
                                            ? item[column]?.discountTotalPrice
                                            : item[column]?.totalPrice
                                        )}`}
                                  </td>
                                </>
                              ) : (
                                <td
                                  className={`p-3 text-sm font-medium text-gray-900 ${
                                    column?.includes("email")
                                      ? ""
                                      : "capitalize"
                                  } ${
                                    column?.includes("address")
                                      ? "max-w-40"
                                      : "whitespace-nowrap"
                                  }`}
                                  key={`${columnIndex}_other`}
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
                                    : column?.includes("paymentMethod")
                                    ? item[column] === "partiallyPay"
                                      ? "online"
                                      : item[column]
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
                                  onClick={(e) => e.stopPropagation()}
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
              <div className="flex items-center justify-center h-52 bg-white rounded-xl">
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
