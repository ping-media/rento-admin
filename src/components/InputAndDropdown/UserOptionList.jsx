import { Add } from "@mui/icons-material";

const UserOptionList = ({
  users,
  loaded,
  onSelect,
  onAddCustomer,
  addLabel = "Add Customer",
  className = "top-20",
}) => (
  <div
    className={`absolute ${className} w-full rounded-md px-3 py-2 bg-white border-2 z-30`}
  >
    <ul>
      {!loaded && <li className="my-2 italic text-gray-400">loading...</li>}

      {loaded && users.length === 0 && (
        <li
          tabIndex="0"
          role="button"
          className="my-1.5 italic text-gray-400 cursor-pointer"
          onClick={onAddCustomer}
        >
          <Add className="size-5" /> {addLabel}
        </li>
      )}

      {users.map((u) => (
        <li
          key={u._id}
          className="my-2 cursor-pointer text-gray-500 w-full"
          onClick={() => onSelect(u)}
        >
          {u.firstName} {u.lastName} | {u.contact} | {u.userType}
        </li>
      ))}
    </ul>
  </div>
);

export default UserOptionList;
