import { useSelector } from "react-redux";
import BulkActionButtons from "../../components/Table/BulkActionButtons";
import { tableIcons } from "../../Data/Icons";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { formatPathNameToTitle } from "../../utils";

const ROUTE_TITLES = {
  "/station-master": "Stations",
  "/all-users": "Customers",
  "/all-plans": "Plan Master",
  "/all-vehicles": "Vehicles",
  "/all-bookings": "Bookings",
  "/all-coupons": "Coupons",
  "/all-managers": "Managers",
  "/location-master": "Cities",
  "/all-invoices": "Invoices",
};

export function getPageTitle(pathname, activeFilterName) {
  // Special dynamic case
  if (pathname.includes("/all-bookings") && activeFilterName) {
    return activeFilterName;
  }

  // Exact match override
  if (ROUTE_TITLES[pathname]) {
    return ROUTE_TITLES[pathname];
  }

  // Default fallback
  return formatPathNameToTitle(pathname);
}

const NO_ADD_BUTTON_ROUTES = ["/payments", "/all-invoices", "/users-documents"];

const TitleAndButton = ({ className = "flex" }) => {
  const { activeFilterName } = useSelector((state) => state.pagination);
  const location = useLocation();
  const showAddButton = !NO_ADD_BUTTON_ROUTES.includes(location.pathname);
  const pageTitle = getPageTitle(location.pathname, activeFilterName);

  return (
    <div
      className={`items-center justify-between lg:justify-start gap-2 ${className}`}
    >
      <h1 className="text-xl xl:text-2xl capitalize font-bold text-theme">
        {pageTitle}
      </h1>

      {showAddButton && (
        <Link
          className="bg-theme font-semibold text-gray-100 p-3 lg:px-2.5 lg:py-1.5 rounded-md shadow-lg hover:bg-theme-light hover:shadow-md inline-flex items-center gap-1"
          to={
            location.pathname !== "/all-pickup-image"
              ? `${location.pathname}/add-new`
              : "#"
          }
        >
          {tableIcons.add}
          Add
        </Link>
      )}
      {/* this button is to perform bulk action */}
      {location.pathname === "/all-vehicles" && <BulkActionButtons />}
    </div>
  );
};

export default TitleAndButton;
