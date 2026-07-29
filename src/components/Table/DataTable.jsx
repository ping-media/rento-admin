import DropDownComponent from "../DropDown/DropDownComponent.jsx";
import {
  changeNumberIntoTime,
  formatPathNameToTitle,
} from "../../utils/index.js";
import Pagination from "../Pagination/Pagination.jsx";
import React, { useEffect } from "react";
import InputSwitch from "../InputAndDropdown/InputSwitch.jsx";
import StatusChange from "./StatusChange.jsx";
import TableNotFound from "../Skeleton/TableNotFound.jsx";
import TableHeader from "./TableHeader.jsx";
import TableActions from "./TableActions.jsx";
import UserDisplayCell from "./UserDisplayCell.jsx";
import BookingDateAndCityCell from "./BookingDateAndCityCell.jsx";
import TablePageHeader from "./TablePageHeader.jsx";
import UserStatusCell from "./UserStatusCell.jsx";
import CopyButton from "../../components/Buttons/CopyButton.jsx";
import TableImage from "./TableImageWithPopupShow.jsx";
import RenderCellContent from "./RenderCellContent.jsx";
import PriceCell from "./PriceCell.jsx";
import useDataTable from "../../hooks/use-data-table.js";
import {
  SELF_CONTAINED,
  SKIP_COLUMNS,
  USER_PAGES,
} from "../../constants/table.js";
import BookingCardView from "./BookingCardView.jsx";
import TableSkeleton from "./TableSkeleton.jsx";
import { Link } from "react-router-dom";

const CustomTable = ({ Data, pagination, searchTermQuery, dataLoading }) => {
  const {
    loadFiltersAndData,
    sortData,
    getTableHeader,
    getTableValue,
    handleDeleteVehicle,
    handleViewData,
    loadingStates,
    setLoadingStates,
    limit,
    loggedInRole,
    currentPage,
    setCurrentPage,
    totalPages,
    showRecordsOptions,
    setSortedData,
    sortConfig,
    Columns,
    setColumns,
    newUpdatedData,
    setNewUpdatedData,
    inputSearchQuery,
    setInputSearchQuery,
    location,
  } = useDataTable({ searchTermQuery, pagination });

  // resting the table data after every page change
  useEffect(() => {
    setColumns([]);
    setNewUpdatedData([]);
    setSortedData([]);
  }, [location.pathname]);

  //filtering data selecting only field we need
  useEffect(() => {
    if (!Data?.length) {
      setNewUpdatedData([]);
      return;
    }

    getTableHeader(Data);
    loadFiltersAndData();

    setNewUpdatedData([]);
    getTableValue(Data);
  }, [Data, totalPages]);

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
                  <TableSkeleton />
                ) : (
                  <table className="table-auto min-w-full rounded-xl">
                    <thead>
                      <tr className="bg-gray-50 h-14 sm:h-12">
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
                            className={`bg-white p-3.5 md:p-0 transition-all duration-500 hover:bg-gray-50 h-14 sm:h-12 ${location.pathname === "/payments" ? "" : "cursor-pointer"}`}
                            key={`row-${item._id}-${index}`}
                            onClick={() => handleViewData(item)}
                          >
                            {/* Checkbox — vehicles page only */}
                            {/* {location.pathname === "/all-vehicles" && (
                              <td
                                className="px-2 py-1 whitespace-nowrap text-md lg:text-sm font-medium text-gray-900"
                                key={`checkbox-${item._id}-${index}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <CheckBoxInput isId={item?._id} />
                              </td>
                            )} */}

                            {/* Serial number */}
                            <td
                              className="px-2 py-1 whitespace-nowrap text-md lg:text-sm font-medium text-gray-900"
                              key={`slNo-${index}`}
                            >
                              {(() => {
                                const page =
                                  Number(pagination?.currentPage) || 1;
                                const pageLimit = Number(limit) || 10;
                                const serial =
                                  (page - 1) * pageLimit + index + 1;
                                return serial < 10 ? `0${serial}` : `${serial}`;
                              })()}
                            </td>

                            {location.pathname === "/all-vehicles" && (
                              <td
                                className="px-2 py-1 whitespace-nowrap text-md lg:text-sm font-medium text-gray-900"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <InputSwitch
                                  value={item["vehicleStatus"]}
                                  id={item?._id}
                                />
                              </td>
                            )}

                            {/* Main columns */}
                            {Columns.filter(
                              (col) =>
                                !col.includes("Status") &&
                                !col.includes("status") &&
                                !col.includes("Active") &&
                                !col.includes("Invoice"),
                            ).map((column, columnIndex) => {
                              if (SKIP_COLUMNS.has(column)) return null;

                              if (
                                ["lastName", "contact"].includes(column) &&
                                USER_PAGES.has(location.pathname)
                              )
                                return null;

                              const cellKey = `cell-${item._id}-${column}-${columnIndex}-${index}`;

                              const renderCell = () => {
                                if (column === "userId")
                                  return (
                                    <UserDisplayCell
                                      item={item}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  );

                                if (column === "city")
                                  return (
                                    <BookingDateAndCityCell
                                      item={item}
                                      column={column}
                                    />
                                  );

                                // if (column === "isEmailVerified")
                                if (column === "kycApproved")
                                  return (
                                    <UserStatusCell
                                      item={item}
                                      index={columnIndex}
                                    />
                                  );

                                if (column === "couponName")
                                  return (
                                    <td
                                      className="px-2 py-1 max-w-36 lg:max-w-24 whitespace-nowrap text-md lg:text-sm font-medium text-gray-900 flex items-center"
                                      key={cellKey}
                                    >
                                      {item[column]}{" "}
                                      <CopyButton textToCopy={item[column]} />
                                    </td>
                                  );

                                if (column === "openStartTime")
                                  return (
                                    <td
                                      className="px-2 py-1 whitespace-nowrap text-md lg:text-sm font-medium text-gray-900"
                                      key={cellKey}
                                    >
                                      <p>{`${changeNumberIntoTime(item?.openStartTime)} - ${changeNumberIntoTime(item?.openEndTime)}`}</p>
                                    </td>
                                  );

                                if (
                                  column === "firstName" &&
                                  USER_PAGES.has(location.pathname)
                                )
                                  return (
                                    <UserDisplayCell
                                      firstName={item?.firstName}
                                      lastName={item?.lastName}
                                      Contact={item?.contact}
                                    />
                                  );

                                if (column.includes("Image"))
                                  return (
                                    <TableImage item={item} column={column} />
                                  );

                                if (
                                  typeof item[column] === "object" &&
                                  column === "currentBooking"
                                )
                                  return null;
                                // return (
                                //   <td
                                //     className="px-2 py-1 whitespace-nowrap text-md lg:text-sm font-medium text-gray-900"
                                //     key={cellKey}
                                //     onClick={(e) => e.stopPropagation()}
                                //   >
                                //     <Link
                                //       to={
                                //         item[column] !== null
                                //           ? `/all-bookings/details/${item[column]?._id}_${item[column]?.bookingId}`
                                //           : "#"
                                //       }
                                //     >
                                //       <span
                                //         className={`${item[column] === null ? "bg-green-500/30" : "bg-yellow-500/35"} rounded-md px-4 py-2`}
                                //       >
                                //         {item[column]?.bookingId ??
                                //           "Available"}
                                //       </span>
                                //     </Link>
                                //   </td>
                                // );

                                if (typeof item[column] === "object")
                                  return (
                                    <React.Fragment key={cellKey}>
                                      <PriceCell
                                        key={`booking-${item._id}-${column}-${columnIndex}-${index}`}
                                        item={item}
                                        column={column}
                                      />
                                    </React.Fragment>
                                  );

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
                                        "message",
                                      ].includes(column)
                                        ? "max-w-32 truncate"
                                        : column.includes("vehicleName")
                                          ? "max-w-24 truncate"
                                          : "whitespace-nowrap"
                                    }`}
                                    key={cellKey}
                                    title={
                                      column === "message"
                                        ? item[column]?.toString() || ""
                                        : undefined
                                    }
                                  >
                                    {RenderCellContent(
                                      column,
                                      item[column],
                                      item,
                                      location,
                                    )}
                                  </td>
                                );
                              };

                              const rendered = renderCell();
                              if (!rendered) return null;

                              // Components that return their own <td> don't need a wrapper
                              if (
                                SELF_CONTAINED.has(column) ||
                                column === "userId" ||
                                column === "city" ||
                                column === "isEmailVerified" ||
                                (column === "firstName" &&
                                  USER_PAGES.has(location.pathname)) ||
                                column.includes("Image") ||
                                typeof item[column] === "object"
                              ) {
                                return (
                                  <React.Fragment key={cellKey}>
                                    {rendered}
                                  </React.Fragment>
                                );
                              }

                              return rendered;
                            })}

                            {/* Status columns — always rendered on the right */}
                            {Columns.filter(
                              (col) =>
                                col.includes("Status") ||
                                col.includes("status") ||
                                col.includes("Active") ||
                                col.includes("Invoice"),
                            ).map((column, columnIndex) => {
                              const statusKey = `status-${item._id}-${column}-${columnIndex}-${index}`;

                              const isToggleStatus =
                                (location.pathname === "/location-master" &&
                                  column.includes("Status")) ||
                                (location.pathname === "/all-vehicles" &&
                                  column.includes("vehicleStatus")) ||
                                (location.pathname === "/station-master" &&
                                  column.includes("status")) ||
                                (location.pathname === "/vehicle-master" &&
                                  column.includes("status"));

                              const renderStatusCell = () => {
                                if (isToggleStatus)
                                  return (
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
                                  );

                                if (column.includes("rideStatus"))
                                  return (
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
                                  );

                                return (
                                  <td
                                    className="px-2 py-1 md:max-w-16 whitespace-nowrap text-md lg:text-sm font-medium text-gray-900"
                                    key={statusKey}
                                  >
                                    <StatusChange item={item} column={column} />
                                  </td>
                                );
                              };

                              return renderStatusCell();
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
                            (location.pathname === "/all-vehicles"
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
        <div className="lg:hidden mt-5">
          <BookingCardView
            dataLoading={dataLoading}
            Data={Data}
            newUpdatedData={newUpdatedData}
          />
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
