import CopyButton from "../../components/Buttons/CopyButton";

const BookingMoreInfo = ({ data, datatype }) => {
  return (
    <>
      {data[datatype]?.map((item, index) => (
        <div
          className={`flex justify-between items-center py-1.5 ${
            index == data[datatype]?.length - 1 ? "" : "border-b-2"
          } border-gray-300`}
          key={index}
        >
          <span className="font-semibold text-xs lg:text-sm uppercase">
            {item?.key}
          </span>{" "}
          <span
            className={`text-gray-500 flex items-center text-xs lg:text-sm ${
              item?.key === "Email" ? "" : "capitalize"
            }`}
          >
            {/* copy button  */}
            {(item?.key === "Mobile Number" || item?.key === "Email") && (
              <CopyButton textToCopy={item?.value} />
            )}
            {item?.value}
          </span>
        </div>
      ))}
    </>
  );
};

export default BookingMoreInfo;
