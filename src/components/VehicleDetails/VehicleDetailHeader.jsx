import { useDispatch, useSelector } from "react-redux";
import BackButton from "../../components/Buttons/BackButton";
import React from "react";
import {
  toggleVehicleServiceModal,
  toggleVehicleUpdateModal,
} from "../../Redux/SideBarSlice/SideBarSlice";
import { Link, useParams } from "react-router-dom";

const VehicleDetailHeader = ({ setIsPlanModalOpen, onDocClick }) => {
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
          className="bg-theme p-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none"
          type="button"
          onMouseEnter={() => {
            import("../../components/Modal/ChangeBulkVehicle");
          }}
          onClick={() => dispatch(toggleVehicleUpdateModal())}
        >
          Bulk Update
        </button>

        <button
          type="button"
          className="bg-theme p-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none"
          onClick={onDocClick}
        >
          Documents
        </button>

        <button
          className="bg-theme p-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none"
          type="button"
          onClick={() => setIsPlanModalOpen(true)}
        >
          Traiff
        </button>

        <button
          className="bg-theme p-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none"
          type="button"
          onMouseEnter={() => {
            import("../../components/Table/MaintenanceTable");
          }}
          onClick={() => dispatch(toggleVehicleServiceModal())}
        >
          Add Block
        </button>

        {loggedInRole !== "manager" && (
          <Link
            className="bg-theme p-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none"
            to={`/all-vehicles/${id}`}
          >
            <span>Edit</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default React.memo(VehicleDetailHeader);
