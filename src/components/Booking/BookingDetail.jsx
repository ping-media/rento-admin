import { useDispatch, useSelector } from "react-redux";
import VehicleInfo from "../VehicleDetails/VehicleInfo";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchVehicleMasterById } from "../../Data/Function";
import PreLoader from "../Skeleton/PreLoader";
import { getData } from "../../Data";

const BookingDetail = () => {
  const { vehicleMaster, loading } = useSelector((state) => state.vehicles);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [collectedData, setCollectedData] = useState(null);

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

  useEffect(() => {
    if (vehicleMaster?.length == 1) {
      fetchCollectedData(`/getAllUsers?_id=${vehicleMaster[0]?.userId}`);
    }
    console.log(vehicleMaster, collectedData);
  }, [vehicleMaster]);

  const data = {
    user: [
      {
        key: "First Name",
        value:
          (collectedData && collectedData["userId"][0]?.firstName) || "John",
      },
      {
        key: "Last Name",
        value: (collectedData && collectedData["userId"][0]?.lastName) || "deo",
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
          (collectedData && collectedData["userId"][0]?.createdAt) ||
          "2024-10-28 02:45 PM",
      },
    ],
    moreInfo: [
      { key: "Pick Up Location", value: "Hoodi, Bangalore" },
      { key: "Drop Off Location", value: "Hoodi, Bangalore" },
      { key: "Start Date", value: "2024-10-29 09:30:00" },
      { key: "End Date", value: "2024-10-30 09:30:00" },
    ],
  };

  return !loading ? (
    <>
      <div className="flex gap-4 flex-wrap">
        <div className="bg-white shadow-md rounded-xl flex-1 px-6 py-4">
          <h2 className="mb-3 text-xl font-semibold text-gray-500">
            {`${data?.user[0]?.value} requested for rental`}
          </h2>
          <div className="border-2 p-2 border-gray-300 rounded-lg mb-8">
            {data?.user?.map((item, index) => (
              <div
                className={`flex justify-between items-center py-1.5 ${
                  index == data?.user?.length - 1 ? "" : "border-b-2"
                } border-gray-300`}
                key={index}
              >
                <span className="font-semibold uppercase">{item?.key}</span>{" "}
                <span className="text-gray-500">{item?.value}</span>
              </div>
            ))}
          </div>
          <h2 className="mb-3 text-xl font-semibold text-gray-500">
            More Information
          </h2>
          <div className="border-2 p-2 border-gray-300 rounded-lg">
            {data?.moreInfo?.map((item, index) => (
              <div
                className={`flex justify-between items-center py-1.5 ${
                  index == data?.moreInfo?.length - 1 ? "" : "border-b-2"
                } border-gray-300`}
                key={index}
              >
                <span className="font-semibold uppercase">{item?.key}</span>{" "}
                <span className="text-gray-500">{item?.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 px-6 py-4 bg-white shadow-md rounded-lg">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold uppercase text-lg">Hero Mastero 125</h2>
              <small className="text-gray-600">2024</small>
            </div>
            <div>
              <h2 className="font-semibold uppercase">Rental Price</h2>
              <p className="font-bold text-lg">
                ₹{vehicleMaster && vehicleMaster[0]?.bookingPrice?.bookingPrice}
                .00/DAY
              </p>
            </div>
          </div>
          <VehicleInfo />
        </div>
      </div>
    </>
  ) : (
    <PreLoader />
  );
};

export default BookingDetail;
