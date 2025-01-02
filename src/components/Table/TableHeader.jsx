import CheckBoxInput from "../InputAndDropdown/CheckBoxInput";
import { camelCaseToSpaceSeparated } from "../../utils/index";
import { useSelector } from "react-redux";
import React from "react";

const TableHeader = ({
  Columns,
  sortConfig,
  sortData,
  newUpdatedData,
  toggleSelectAll,
}) => {
  const { tempIds } = useSelector((state) => state.vehicles);
  return (
    <>
      {Columns?.length > 0 && location.pathname == "/all-vehicles" && (
        <th
          scope="col"
          className="px-3 py-2 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize cursor-pointer"
        >
          <CheckBoxInput
            handleChange={toggleSelectAll}
            tempIds={tempIds}
            data={newUpdatedData}
            unique={"headerSelected"}
          />
        </th>
      )}
      {/* Render headers for columns that do not include "Status" or "Active" */}
      {Columns.filter(
        (item) => !item.includes("Status") && !item.includes("Active")
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
                  className="p-3 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize cursor-pointer"
                  key={`Images-${fileIndex}`}
                >
                  {`Images ${fileIndex + 1}`}
                </th>
              ))}
            </React.Fragment>
          );
        }
        if (item === "userId") {
          return (
            <th
              scope="col"
              className="p-3 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize cursor-pointer"
              key={"userId"}
            >
              User Name & Phone
            </th>
          );
        }
        if (item === "BookingStartDateAndTime" || item === "city") {
          return (
            <th
              scope="col"
              className="p-3 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize cursor-pointer"
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
        if (item === "BookingEndDateAndTime" || item === "state") {
          return null;
        }
        return (
          <th
            scope="col"
            className="p-3 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize cursor-pointer"
            key={index}
            onClick={() => sortData(item)}
          >
            {camelCaseToSpaceSeparated(item)}
            {sortConfig.key === item &&
              (sortConfig.direction === "asc" ? "↑" : "↓")}
          </th>
        );
      })}

      {/* Render headers for columns containing "Status" or "Active" */}
      {Columns.filter(
        (item) => item.includes("Status") || item.includes("Active")
      ).map((item, index) => (
        <th
          scope="col"
          className="p-3 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize cursor-pointer"
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
          location?.pathname === "/users-documents"
        ) && (
          <th
            scope="col"
            className="p-3 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize cursor-pointer"
            key="Actions"
          >
            Actions
          </th>
        )}
    </>
  );
};

export default TableHeader;
