import { Link } from "react-router-dom";

const UserDisplayCell = ({ item, firstName, lastName, Contact }) => {
  return (
    <td
      className="p-2 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 capitalize text-left"
      key={item?._id}
      onClick={(e) => e.stopPropagation()}
    >
      <p>{`${item?.userId?.firstName || firstName || "Random"} ${
        item?.userId?.lastName || lastName || "User"
      }`}</p>
      <p className="text-xs hover:text-theme">
        <Link to={`tel:${item?.userId?.contact || Contact || "#"}`}>
          ({item?.userId?.contact || Contact || "NA"})
        </Link>
      </p>
    </td>
  );
};

export default UserDisplayCell;
