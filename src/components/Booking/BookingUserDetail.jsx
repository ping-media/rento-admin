import CopyButton from "../../components/Buttons/CopyButton";

const BookingUserDetails = ({ data }) => {
  return (
    <>
      {data?.user?.map((item, index) => (
        <div
          className={`flex justify-between items-center py-1.5 ${
            index == data?.user?.length - 1 ? "" : "border-b-2"
          } border-gray-300`}
          key={index}
        >
          <span className="font-semibold uppercase text-sm">{item?.key}</span>{" "}
          <span
            className={`text-gray-500 flex items-center text-sm ${
              item?.key === "Email" ? "" : "capitalize"
            }`}
          >
            {/* copy button  */}
            {(item?.key === "Mobile Number" || item?.key === "Email") && (
              <CopyButton textToCopy={item?.value} />
            )}
            {/* data  */}
            {item.key === "Document Status"
              ? item?.value === "yes"
                ? "verified"
                : "not verified"
              : item?.value}
          </span>
        </div>
      ))}
    </>
  );
};

export default BookingUserDetails;
