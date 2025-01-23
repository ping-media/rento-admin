import { Link } from "react-router-dom";
import { tableIcons } from "../../Data/Icons";
// import MoreActionCell from "./MoreActionCell";

const TableActions = ({
  item,
  // loadingStates,
  // setLoadingStates,
  handleDeleteVehicle,
}) => {
  return (
    <td className="p-3 whitespace-nowrap text-sm items-center gap-1">
      <div className="flex">
        {(location.pathname == "/all-vehicles" ||
          location.pathname == "/all-bookings" ||
          location.pathname == "/all-invoices") && (
          <Link
            className="p-2 text-purple-500 hover:underline"
            to={`details/${item?._id}`}
            onClick={(e) => e.stopPropagation()}
          >
            view
          </Link>
        )}
        {!(
          location.pathname == "/users-documents" ||
          location.pathname == "/payments" ||
          location.pathname == "/all-invoices" ||
          location.pathname == "/all-bookings"
        ) && (
          <Link
            className="p-1.5 rounded-full bg-white group transition-all duration-500 hover:bg-indigo-600 flex item-center"
            to={`${item?._id}`}
            onClick={(e) => e.stopPropagation()}
          >
            {tableIcons.edit}
          </Link>
        )}
        {/* {location.pathname == "/all-bookings" && (
        <>
          <MoreActionCell
            item={item}
            loadingStates={loadingStates}
            setLoadingStates={setLoadingStates}
          />
        </>
      )} */}
        {!(
          location.pathname == "/users-documents" ||
          location.pathname == "/all-bookings" ||
          location.pathname == "/payments" ||
          location.pathname == "/all-invoices" ||
          location.pathname == "/location-master"
        ) && (
          <button
            className="p-1.5 rounded-full bg-white group transition-all duration-500 hover:bg-red-600 flex item-center"
            onClick={() => handleDeleteVehicle(item?._id)}
          >
            {tableIcons.delete}
          </button>
        )}
      </div>
    </td>
  );
};

export default TableActions;
