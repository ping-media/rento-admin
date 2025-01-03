import { useDispatch, useSelector } from "react-redux";
import VehicleInfo from "../VehicleDetails/VehicleInfo";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchVehicleMasterById } from "../../Data/Function";
import PreLoader from "../Skeleton/PreLoader";
import { getData } from "../../Data";
import {
  formatFullDateAndTime,
  formatReadableDateTime,
} from "../../utils/index";
import BookingFareDetails from "./BookingFareDetails";
import BookingUserDetails from "./BookingUserDetail";
import BookingStatusFlag from "./BookingStatusFlag";
import BookingMoreInfo from "./BookingMoreInfo";

const BookingDetail = () => {
  const { vehicleMaster, loading } = useSelector((state) => state.vehicles);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [collectedData, setCollectedData] = useState(null);
  const [data, setData] = useState(null);

  const fetchCollectedData = async (userUrl) => {
    const userResponse = await getData(userUrl, token);

    if (userResponse) {
      return setCollectedData({
        userId: userResponse?.data,
      });
    }
  };

  // through this we are fetching single vehicle data
  useEffect(() => {
    if (id) {
      fetchVehicleMasterById(dispatch, id, token, "/getBookings");
    }
  }, []);
  // fetching user data
  useEffect(() => {
    if (vehicleMaster?.length == 1) {
      fetchCollectedData(`/getAllUsers?_id=${vehicleMaster[0]?.userId}`);
    }
    // console.log(vehicleMaster, collectedData);
  }, [vehicleMaster]);

  // combining data for use
  useEffect(() => {
    if (vehicleMaster?.length == 1 && collectedData != null) {
      const data = {
        user: [
          {
            key: "First Name",
            value:
              (collectedData && collectedData["userId"][0]?.firstName) ||
              "John",
          },
          {
            key: "Last Name",
            value:
              (collectedData && collectedData["userId"][0]?.lastName) || "deo",
          },
          {
            key: "Mobile Number",
            value:
              (collectedData && collectedData["userId"][0]?.contact) ||
              "xxxxxxxxxx",
          },
          {
            key: "Email",
            value:
              (collectedData && collectedData["userId"][0]?.email) ||
              "example@gmail.com",
          },
          {
            key: "Joined",
            value:
              (collectedData &&
                formatReadableDateTime(
                  collectedData["userId"][0]?.createdAt
                )) ||
              "2024-10-28 02:45 PM",
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
        ],
      };
      return setData(data);
    }
  }, [vehicleMaster, collectedData]);

  return !loading && data != null ? (
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
