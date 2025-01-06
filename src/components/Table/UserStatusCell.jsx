const UserStatusCell = ({ item, index }) => {
  return (
    <td
      className="p-3 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 capitalize"
      key={`UserVerification_${index}`}
    >
      <p>{`Email Verify: ${item?.isEmailVerified}`}</p>
      <p>{`Contact Verify: ${item?.isContactVerified}`}</p>
      <p>{`Kyc Approved: ${item?.kycApproved}`}</p>
    </td>
  );
};

export default UserStatusCell;
