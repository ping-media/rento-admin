import { useSelector } from "react-redux";
import VehicleInfo from "../VehicleDetails/VehicleInfo";
import { useEffect, useState } from "react";
import PreLoader from "../Skeleton/PreLoader";
import { formatFullDateAndTime } from "../../utils/index";
import BookingFareDetails from "./BookingFareDetails";
import BookingUserDetails from "./BookingUserDetail";
import BookingStatusFlag from "./BookingStatusFlag";
import BookingMoreInfo from "./BookingMoreInfo";

const BookingDetail = () => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [data, setData] = useState(null);

  // combining data for use
  useEffect(() => {
    if (vehicleMaster?.length === 1) {
      const data = {
        user: [
          {
            key: "Full Name",
            value:
              (vehicleMaster[0] &&
                `${vehicleMaster[0]?.userId?.firstName} ${vehicleMaster[0]?.userId?.lastName}`) ||
              "",
          },
          {
            key: "Mobile Number",
            value:
              (vehicleMaster[0] && vehicleMaster[0]?.userId?.contact) ||
              "xxxxxxxxxx",
          },
          {
            key: "Email",
            value:
              (vehicleMaster[0] && vehicleMaster[0]?.userId?.email) ||
              "example@gmail.com",
          },
        ],
        moreInfo: [
          {
            key: "Pick Up Location",
            value: `${vehicleMaster && vehicleMaster[0]?.stationName}`,
          },
          {
            key: "Drop Off Location",
            value: `${vehicleMaster && vehicleMaster[0]?.stationName}`,
          },
          {
            key: "Start Date",
            value: `${
              vehicleMaster &&
              formatFullDateAndTime(
                vehicleMaster && vehicleMaster[0]?.BookingStartDateAndTime
              )
            }`,
          },
          {
            key: "End Date",
            value: `${
              vehicleMaster &&
              formatFullDateAndTime(
                vehicleMaster && vehicleMaster[0]?.BookingEndDateAndTime
              )
            }`,
          },
          {
            key: "Booking Date",
            value: `${
              vehicleMaster &&
              formatFullDateAndTime(
                vehicleMaster && vehicleMaster[0]?.createdAt
              )
            }`,
          },
        ],
      };
      return setData(data);
    }
  }, [vehicleMaster]);

  return data != null ? (
    <>
      <div className="flex gap-4 flex-wrap">
        <div className="bg-white shadow-md rounded-xl flex-1 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-md lg:text-lg font-semibold text-gray-500">
              {`BookingId: #${vehicleMaster[0]?.bookingId}`}
            </h2>
            <BookingStatusFlag
              title={"Booking Status"}
              rides={vehicleMaster[0]}
              flag={"bookingStatus"}
            />
          </div>
          <div className="border-2 p-2 border-gray-300 rounded-lg mb-8">
            <BookingUserDetails data={data} />
          </div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-md lg:text-lg font-semibold text-gray-500">
              More Information
            </h2>
            <BookingStatusFlag
              title={"Ride Status"}
              rides={vehicleMaster[0]}
              flag={"rideStatus"}
            />
          </div>
          <div className="border-2 p-2 border-gray-300 rounded-lg">
            <BookingMoreInfo data={data} />
          </div>
        </div>
        <div className="flex-1 px-6 py-4 bg-white shadow-md rounded-lg">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold uppercase text-md lg:text-lg">
                {`${vehicleMaster[0]?.vehicleBrand} ${vehicleMaster[0]?.vehicleName}`}
              </h2>
            </div>
            <div>
              <h2 className="font-semibold uppercase hidden lg:block text-sm">
                Rental Price
              </h2>
              <p className="font-bold text-sm text-lg">
                ₹{vehicleMaster && vehicleMaster[0]?.bookingPrice?.rentAmount}
                .00/DAY
              </p>
            </div>
          </div>
          <VehicleInfo
            vehicleImage={vehicleMaster[0]?.vehicleImage}
            vehicleName={vehicleMaster[0]?.vehicleName}
          />
          <div className="flex items-center justify-between mb-3 border-b-2 pb-1.5 mb-1.5">
            <h2 className="text-md lg:text-lg font-semibold text-gray-500">
              Fare Details
            </h2>
            <BookingStatusFlag
              title={"Payment Status"}
              rides={vehicleMaster[0]}
              flag={"paymentStatus"}
            />
          </div>
          <BookingFareDetails rides={vehicleMaster && vehicleMaster[0]} />
        </div>
      </div>
    </>
  ) : (
    <PreLoader />
  );
};

export default BookingDetail;
