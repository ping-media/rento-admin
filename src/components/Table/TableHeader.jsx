import { camelCaseToSpaceSeparated } from "../../utils/index";
import React from "react";
import CheckBoxInputToMultiple from "../InputAndDropdown/CheckBoxInputToMultiple";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const TableHeader = ({ Columns, sortConfig, sortData, newUpdatedData }) => {
  const { loggedInRole } = useSelector((state) => state.user);
  const location = useLocation();

  const headerForBooking = [
    { vehicleName: "vehicle" },
    { BookingStartDateAndTime: "Pick Up" },
    { BookingEndDateAndTime: "Drop Off" },
    { paymentgatewayOrderId: "Payment Order ID" },
    { rrnNumber: "RRN Number" },
    { bookingPrice: "Price" },
  ];

  if (Columns?.length === 0) {
    return;
  }

  return (
    <>
      {Columns?.length > 0 && location.pathname == "/all-vehicles" && (
        <th
          scope="col"
          className="p-2 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize cursor-pointer"
        >
          <CheckBoxInputToMultiple
            data={newUpdatedData}
            unique={"headerSelected"}
          />
        </th>
      )}

      <th
        scope="col"
        className="p-2 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize cursor-pointer"
      >
        SL
      </th>
      {Columns.filter(
        (item) =>
          !item.includes("status") &&
          !item.includes("Status") &&
          !item.includes("Active"),
      ).map((item, index) => {
        if (item === "files") {
          const maxFiles =
            location.pathname == "/users-documents"
              ? Array(2).fill("image")
              : Array(6).fill("image");
          return (
            <React.Fragment key={index}>
              {maxFiles.map((_, fileIndex) => (
                <th
                  scope="col"
                  className="p-2 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize cursor-pointer"
                  key={`Images-${fileIndex}`}
                >
                  {`Images ${fileIndex + 1}`}
                </th>
              ))}
            </React.Fragment>
          );
        }

        // if (location?.pathname === "/all-bookings") {
        if (["/all-bookings", "/payments"].includes(location?.pathname)) {
          const bookingHeader = headerForBooking.find(
            (header) => Object.keys(header)[0] === item,
          );
          if (bookingHeader) {
            const label = Object.values(bookingHeader)[0];
            return (
              <th
                scope="col"
                className="p-2 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize cursor-pointer"
                key={item}
              >
                {label}
              </th>
            );
          }
        }

        if (item === "userId") {
          return (
            <th
              scope="col"
              className="p-2 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize cursor-pointer"
              key={"userId"}
            >
              {location.pathname == "/station-master" ? "Manager" : "User"}
            </th>
          );
        }
        if (item === "bookingPrice" && location.pathname === "/payments") {
          return (
            <React.Fragment key={"userPaymentRecived"}>
              <th
                scope="col"
                className="p-2 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize cursor-pointer"
              >
                Payment Recived
              </th>
              <th
                scope="col"
                className="p-3 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize cursor-pointer"
                key={"userPaid"}
              >
                booking price
              </th>
            </React.Fragment>
          );
        }
        if (item === "openStartTime") {
          return (
            <th
              scope="col"
              className="p-2 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize cursor-pointer"
              key={"openingHour"}
            >
              Opening Hours
            </th>
          );
        }
        if (
          location.pathname === "/all-invoices" ||
          location?.pathname === "/all-users" ||
          location?.pathname === "/all-managers"
        ) {
          if (item === "firstName") {
            return (
              <th
                scope="col"
                className="p-2 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize cursor-pointer"
                key={"userId"}
              >
                User Name & Phone
              </th>
            );
          }
          if (item === "lastName" || item === "contact") {
            return null;
          }
        }
        if (item === "city") {
          return (
            <th
              scope="col"
              className="p-2 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize cursor-pointer"
              key={
                item === "BookingStartDateAndTime"
                  ? "startAndEndDate"
                  : " CityAndState"
              }
            >
              {item === "BookingStartDateAndTime"
                ? " Start & End Date and Time"
                : " City & State"}
            </th>
          );
        }
        if (item === "isEmailVerified") {
          return (
            <th
              scope="col"
              className="p-2 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize cursor-pointer"
              key="UserVerification"
            >
              Verified
            </th>
          );
        }
        if (
          item === "state" ||
          item === "isContactVerified" ||
          item === "isDocumentVerified" ||
          item === "kycApproved" ||
          item === "openEndTime"
        ) {
          return null;
        }
        return (
          <th
            scope="col"
            className="p-2 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize cursor-pointer"
            key={index}
            onClick={() => sortData(item)}
          >
            {camelCaseToSpaceSeparated(item)}
            {sortConfig.key === item &&
              (sortConfig.direction === "asc" ? "↑" : "↓")}
          </th>
        );
      })}

      {Columns.filter(
        (item) =>
          item.includes("status") ||
          item.includes("Status") ||
          item.includes("Active"),
      ).map((item, index) => (
        <th
          scope="col"
          className="p-2 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize cursor-pointer"
          key={`Status-${index}`}
          onClick={() => sortData(item)}
        >
          {camelCaseToSpaceSeparated(item)}
          {sortConfig.key === item &&
            (sortConfig.direction === "asc" ? "↑" : "↓")}
        </th>
      ))}

      {/* Add "Actions" as the last header */}
      {newUpdatedData.length > 0 &&
        !(
          location?.pathname === "/payments" ||
          location?.pathname === "/all-pickup-image" ||
          location?.pathname === "/users-documents" ||
          location.pathname == "/all-bookings"
        ) &&
        loggedInRole !== "manager" && (
          <th
            scope="col"
            className="p-2 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize cursor-pointer"
            key="Actions"
          >
            Actions
          </th>
        )}
    </>
  );
};

export default TableHeader;
