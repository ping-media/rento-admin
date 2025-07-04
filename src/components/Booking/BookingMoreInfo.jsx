import { formatFullDateAndTime } from "../../utils/index";
import CopyButton from "../../components/Buttons/CopyButton";
import { useSelector } from "react-redux";

const BookingMoreInfo = ({ data, datatype }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  return (
    <>
      <div className="md:hidden lg:hidden flex items-center justify-between pb-1 border-b-2">
        <h2 className="font-semibold uppercase text-md">
          {`${vehicleMaster[0]?.vehicleBrand} ${vehicleMaster[0]?.vehicleName}`}
        </h2>
        <p className="text-sm text-gray-500">
          {vehicleMaster[0]?.vehicleBasic?.vehicleNumber}
        </p>
      </div>

      {data[datatype]
        ?.filter((item) => {
          const isExtend =
            vehicleMaster[0]?.bookingPrice?.extendAmount?.length === 0 &&
            item?.key?.includes("Extended");
          return !isExtend;
        })
        .map((item, index, filteredArr) => {
          return (
            <div
              className={`flex justify-between items-center py-1.5 ${
                index == filteredArr?.length - 1 ? "" : "border-b-2"
              } border-gray-300`}
              key={index}
            >
              <span className="font-semibold text-sm uppercase">
                {item?.key}
              </span>{" "}
              <span
                className={`text-gray-500 flex items-center text-sm ${
                  item?.key === "Email" ? "" : "capitalize"
                }`}
              >
                {/* copy button  */}
                {(item?.key === "Mobile Number" ||
                  item?.key === "Email" ||
                  item?.key === "Alt Mobile Number") &&
                  item?.value !== "NA" && (
                    <CopyButton textToCopy={item?.value} />
                  )}
                {item?.value}
              </span>
            </div>
          );
        })}
      {/* if ride end before actual ending date show this  */}
      {vehicleMaster &&
        vehicleMaster[0]?.extendBooking?.originalEndDate &&
        datatype === "moreInfo" && (
          <div className="flex justify-between items-center py-1.5 border-t-2 border-gray-300">
            <span className="font-semibold text-sm uppercase">Finish On</span>
            <span className="text-gray-500 flex items-center text-xs lg:text-sm capitalize">
              {formatFullDateAndTime(vehicleMaster[0]?.BookingEndDateAndTime)}
            </span>
          </div>
        )}
    </>
  );
};

export default BookingMoreInfo;
