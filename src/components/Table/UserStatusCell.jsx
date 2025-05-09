import { tableIcons } from "../../Data/Icons";

const UserStatusCell = ({ item, index }) => {
  const isVerify =
    item?.isEmailVerified === "yes" &&
    item?.isContactVerified === "yes" &&
    item?.kycApproved === "yes"
      ? true
      : false;
  return (
    <td
      className="p-2 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 capitalize"
      key={`UserVerification_${index}`}
    >
      <p
        className={`flex items-center gap-1 ${
          isVerify ? "text-green-500" : "text-red-500/90"
        }`}
      >
        {isVerify ? <>{tableIcons?.verify}</> : <>{tableIcons?.unVerify}</>}
      </p>
    </td>
  );
};

export default UserStatusCell;
