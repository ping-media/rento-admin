import { formatFullDateAndTime } from "../../utils/index";
import CopyButton from "../../components/Buttons/CopyButton";
import { useSelector } from "react-redux";

const BookingMoreInfo = ({ data, datatype }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
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
            {(item?.key === "Mobile Number" ||
              item?.key === "Email" ||
              item?.key === "Alt Mobile Number") &&
              item?.value !== "NA" && <CopyButton textToCopy={item?.value} />}
            {item?.value}
          </span>
        </div>
      ))}
      {/* if ride end before actual ending date show this  */}
      {vehicleMaster &&
        vehicleMaster[0]?.extendBooking?.originalEndDate &&
        datatype === "moreInfo" && (
          <div className="flex justify-between items-center py-1.5 border-t-2 border-gray-300">
            <span className="font-semibold text-xs lg:text-sm uppercase">
              Finish On
            </span>
            <span className="text-gray-500 flex items-center text-xs lg:text-sm capitalize">
              {formatFullDateAndTime(vehicleMaster[0]?.BookingEndDateAndTime)}
            </span>
          </div>
        )}
    </>
  );
};

export default BookingMoreInfo;
