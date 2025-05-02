import { Link, useLocation } from "react-router-dom";

const UserDisplayCell = ({ item, firstName, lastName, Contact }) => {
  const location = useLocation();

  const getUserData = () => {
    if (Array.isArray(item?.userId)) return item.userId[0];
    if (typeof item?.userId === "object" && item.userId !== null)
      return item.userId;
    return null;
  };

  const user = getUserData();
  const userId = user?._id || "#";
  const displayFirstName = user?.firstName || firstName || "Random";
  const displayLastName = user?.lastName || lastName || "User";
  const contact = user?.contact || Contact || "NA";

  const shouldLink = !["/all-users", "/all-managers"].includes(
    location.pathname
  );

  return (
    <td
      className="p-2 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 capitalize text-left"
      key={item?._id}
      onClick={(e) => e.stopPropagation()}
    >
      <p className={shouldLink ? "hover:text-theme hover:underline" : ""}>
        <Link to={shouldLink ? `/all-users/${userId}` : "#"}>
          {`${displayFirstName} ${displayLastName}`}
        </Link>
      </p>
      <p className="text-xs hover:text-theme">
        <Link to={`tel:${contact !== "NA" ? contact : "#"}`}>({contact})</Link>
      </p>
    </td>
  );
};

export default UserDisplayCell;
