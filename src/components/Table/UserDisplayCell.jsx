import { Link } from "react-router-dom";

const UserDisplayCell = ({ item }) => {
  return (
    <td
      className="p-3 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 capitalize text-left"
      key="userId"
    >
      <p>{`${item?.userId?.firstName || "Random"} ${
        item?.userId?.lastName || "User"
      }`}</p>
      <p className="text-xs hover:text-theme">
        <Link to={`tel:${item?.userId?.contact || "#"}`}>
          ({item?.userId?.contact || "NA"})
        </Link>
      </p>
    </td>
  );
};

export default UserDisplayCell;
