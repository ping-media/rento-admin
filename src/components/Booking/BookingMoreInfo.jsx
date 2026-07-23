import { Link } from "react-router-dom";
import CopyButton from "../../components/Buttons/CopyButton";
import { useSelector } from "react-redux";

const COPYABLE_FIELDS = new Set([
  "Mobile Number",
  "Email",
  "Alt Mobile Number",
  "Start OTP",
  "End OTP",
]);

const BookingMoreInfo = ({ data, datatype }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);

  const vehicle = vehicleMaster?.[0];

  const filteredData =
    data[datatype]?.filter((item) => {
      const isExtend =
        vehicle?.bookingPrice?.extendAmount?.length === 0 &&
        item?.key?.includes("Extended");

      const isEmptyValue = item?.value === "";
      const isVisible = item?.isVisible === true;

      return !isExtend && !isEmptyValue && isVisible;
    }) ?? [];

  return (
    <>
      <div className="md:hidden lg:hidden flex items-center justify-between pb-1 border-b-2">
        <h2 className="font-semibold uppercase text-md">
          {`${vehicle?.vehicleBrand} ${vehicle?.vehicleName}`}
        </h2>
        <Link to={`/all-vehicles/details/${vehicle?.vehicleTableId?._id}`}>
          <p className="text-md text-gray-500">
            {vehicle?.vehicleBasic?.vehicleNumber}
          </p>
        </Link>
      </div>

      {filteredData.map((item, index, filteredArr) => {
        return (
          <div
            className={`flex justify-between items-center py-1.5 ${
              index === filteredArr?.length - 1 ? "" : "border-b-2"
            } border-gray-300`}
            key={`${item.key}-${item.value}`}
          >
            <span className="text-md capitalize">{item?.key}</span>{" "}
            <span
              className={`text-gray-500 font-semibold flex items-center text-md ${
                item?.key === "Email" ? "" : "capitalize"
              }`}
            >
              {typeof item?.value === "function" ? (
                <button onClick={item?.value} className="text-theme underline">
                  View Readings
                </button>
              ) : (
                <>
                  {/* copy button  */}
                  {COPYABLE_FIELDS.has(item?.key) && item?.value !== "NA" && (
                    <CopyButton textToCopy={item?.value} />
                  )}
                  {item?.value}
                </>
              )}
            </span>
          </div>
        );
      })}
    </>
  );
};

export default BookingMoreInfo;
