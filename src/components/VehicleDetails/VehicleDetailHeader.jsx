import { useDispatch, useSelector } from "react-redux";
import BackButton from "../../components/Buttons/BackButton";
import React from "react";
import {
  toggleVehicleServiceModal,
  toggleVehicleUpdateModal,
} from "../../Redux/SideBarSlice/SideBarSlice";
import { tableIcons } from "../../Data/Icons";
import { Link, useParams } from "react-router-dom";

const VehicleDetailHeader = () => {
  const { id } = useParams();
  const { loggedInRole } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <div className="flex items-center flex-wrap gap-2 lg:gap-0 justify-between mb-3">
      <div className="flex items-center gap-2">
        <BackButton />
        <h1 className="text-2xl uppercase font-bold text-theme">
          Vehicle Details
        </h1>
      </div>
      <div className="flex items-center flex-wrap gap-2">
        <button
          className="bg-theme px-4 py-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none"
          type="button"
          onMouseEnter={() => {
            import("../../components/Modal/ChangeBulkVehicle");
          }}
          onClick={() => dispatch(toggleVehicleUpdateModal())}
        >
          {tableIcons["common-edit"]}
          Update Prices
        </button>

        <button
          className="bg-theme px-4 py-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none"
          type="button"
          onMouseEnter={() => {
            import("../../components/Table/MaintenanceTable");
          }}
          onClick={() => dispatch(toggleVehicleServiceModal())}
        >
          {tableIcons["add"]}
          Add Maintenance
        </button>

        {loggedInRole !== "manager" && (
          <Link
            className="bg-theme px-4 py-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none"
            to={`/all-vehicles/${id}`}
          >
            {tableIcons["common-edit"]}
            <span>Edit</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default React.memo(VehicleDetailHeader);
