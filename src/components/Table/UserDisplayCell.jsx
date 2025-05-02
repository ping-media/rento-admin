import { Link } from "react-router-dom";

const UserDisplayCell = ({ item, firstName, lastName, Contact }) => {
  const getUserId = () => {
    console.log(Array.isArray(item?.userId));
    const user = Array.isArray(item?.userId)
      ? item.userId[0]
      : typeof item?.userId === "object" && item.userId !== null
      ? item.userId
      : null;
    return user?._id || "#";
  };

  return (
    <td
      className="p-2 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 capitalize text-left"
      key={item?._id}
      onClick={(e) => e.stopPropagation()}
    >
      <p
        className={`${
          !["/all-users", "/all-managers"].includes(location.pathname)
            ? "hover:text-theme hover:underline"
            : ""
        }`}
      >
        <Link
          to={
            !["/all-users", "/all-managers"].includes(location.pathname)
              ? `/all-users/${getUserId()}`
              : "#"
          }
        >
          {`${
            item?.userId[0]?.firstName ||
            item?.userId?.firstName ||
            firstName ||
            "Random"
          } ${
            item?.userId[0]?.lastName ||
            item?.userId?.lastName ||
            lastName ||
            "User"
          }`}
        </Link>
      </p>
      <p className="text-xs hover:text-theme">
        <Link
          to={`tel:${
            item?.userId[0]?.contact || item?.userId?.contact || Contact || "#"
          }`}
        >
          (
          {item?.userId[0]?.contact || item?.userId?.contact || Contact || "NA"}
          )
        </Link>
      </p>
    </td>
  );
};

export default UserDisplayCell;
