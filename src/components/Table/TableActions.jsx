import { Link } from "react-router-dom";
import { tableIcons } from "../../Data/Icons";
import { useDispatch } from "react-redux";
import { toggleVehicleServiceModal } from "../../Redux/SideBarSlice/SideBarSlice";
import { addBlockVehicleId } from "../../Redux/VehicleSlice/VehicleSlice";

const TableActions = ({ item, handleDeleteVehicle }) => {
  const dispatch = useDispatch();
  // for deleting the vehicle
  const handleDelete = (e, id) => {
    e.stopPropagation();
    return handleDeleteVehicle(id);
  };

  // for blocking the vehicle
  const handleBlockVehicle = (e, id) => {
    e.stopPropagation();
    dispatch(addBlockVehicleId(id));
    dispatch(toggleVehicleServiceModal());
  };

  return (
    <td className="px-2 py-1 whitespace-nowrap text-sm items-center gap-1">
      <div className="flex">
        {location.pathname == "/all-vehicles" && (
          <button
            type="button"
            className="p-1.5 rounded-full bg-white group transition-all duration-500 hover:text-white hover:bg-gray-600 flex item-center"
            onClick={(e) => handleBlockVehicle(e, item?._id)}
            title="Block Vehicle"
          >
            {tableIcons?.block}
          </button>
        )}
        {!(
          location.pathname == "/users-documents" ||
          location.pathname == "/payments" ||
          location.pathname == "/all-invoices" ||
          location.pathname == "/all-bookings" ||
          location.pathname == "/logs"
        ) && (
          <Link
            className="p-1.5 rounded-full bg-white group transition-all duration-500 hover:bg-indigo-600 flex item-center"
            to={`${item?._id}`}
            onClick={(e) => e.stopPropagation()}
          >
            {tableIcons.edit}
          </Link>
        )}
        {!(
          location.pathname == "/users-documents" ||
          location.pathname == "/all-bookings" ||
          location.pathname == "/payments" ||
          location.pathname == "/location-master" ||
          location.pathname == "/logs"
        ) && (
          <button
            className="p-1.5 rounded-full bg-white group transition-all duration-500 hover:bg-red-600 flex item-center"
            onClick={(e) => handleDelete(e, item?._id)}
          >
            {tableIcons.delete}
          </button>
        )}
      </div>
    </td>
  );
};

export default TableActions;
