import { formatFullDateAndTime, formatPrice } from "../../utils/index";
import StatusChange from "../../components/Table/StatusChange";
import { tableIcons } from "../../Data/Icons";
import { Link, useNavigate } from "react-router-dom";

const BookingCard = ({ item }) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`details/${item?._id}`)} key={item?._id}>
      <div className="bg-white rounded-md shadow-md px-2 py-2 mb-5">
        {/* top header for booking */}
        <div className="flex items-center justify-between pb-1 mb-1 border-b-2">
          <p className="text-sm">#{item?.bookingId}</p>
          <div className="flex items-center gap-1">
            <StatusChange item={item} column={"rideStatus"} />
            <StatusChange item={item} column={"bookingStatus"} />
          </div>
        </div>
        {/* vehicle booking */}
        <div className="flex items-center mb-2">
          <div className="flex-1 flex gap-1">
            <div className="w-20 h-20">
              <img
                src={item?.vehicleImage}
                className="w-full h-full object-contain"
                alt={item?.vehicleName}
              />
            </div>
            <div>
              <h2 className="uppercase text-sm font-bold">
                {item?.vehicleName}
              </h2>
              <p className="text-xs">({item?.vehicleBasic?.vehicleNumber})</p>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-right text-theme font-bold">
              ₹
              {item?.bookingPrice?.discountTotalPrice &&
              item?.bookingPrice?.discountTotalPrice > 0
                ? formatPrice(item?.bookingPrice?.discountTotalPrice)
                : formatPrice(item?.bookingPrice?.totalPrice)}
            </p>
          </div>
        </div>
        {/* user info booking */}
        <div
          className="mb-3"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <p className="flex items-center text-sm">
            {tableIcons?.user}
            <Link to={`/all-users/${item?.userId?._id}`}>
              <span className="ml-1 capitalize">
                {item?.userId?.firstName} {item?.userId?.lastName}
              </span>
            </Link>
          </p>
          <p className="flex items-center text-sm">
            {tableIcons?.phone}
            <Link to={`tel:${item?.userId?.contact}`}>
              <span className="ml-1 capitalize text-theme">
                {item?.userId?.contact}{" "}
              </span>
            </Link>
          </p>
        </div>
        {/* time between booking  */}
        <div className="flex items-center justify-between mb-1">
          <p className="flex items-center text-xs">
            {tableIcons?.dateCalender}{" "}
            <span className="ml-1">
              {item?.BookingStartDateAndTime &&
                formatFullDateAndTime(item?.BookingStartDateAndTime)}
            </span>
          </p>
          <p className="flex items-center text-xs">
            {tableIcons?.dateCalender}{" "}
            <span className="ml-1">
              {item?.BookingEndDateAndTime &&
                formatFullDateAndTime(item?.BookingEndDateAndTime)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
