import { useDispatch, useSelector } from "react-redux";
import VehicleInfo from "../VehicleDetails/VehicleInfo";
import { lazy, useEffect, useState } from "react";
import PreLoader from "../Skeleton/PreLoader";
import {
  formatDateTimeISTForUser,
  formatDateToISOWithoutSecond,
  formatFullDateAndTime,
  formatPrice,
} from "../../utils/index";
import BookingFareDetails from "./BookingFareDetails";
import BookingUserDetails from "./BookingUserDetail";
import BookingStatusFlag from "./BookingStatusFlag";
import BookingMoreInfo from "./BookingMoreInfo";
import CopyButton from "../../components/Buttons/CopyButton";
import BookingNote from "./BookingNote";
import {
  toggleChangeVehicleModal,
  togglePaymentUpdateModal,
} from "../../Redux/SideBarSlice/SideBarSlice";
import BookingTimeLine from "./BookingTimeLine";
import AdditionalInfo from "./AdditionalInfo";
import Button from "../Buttons/Button";
import Spinner from "../../components/Spinner/Spinner";
import VehicleImages from "./VehicleImages";
import UserRideTimeLine from "./UserRideTimeLine";
const ChangeVehicleModal = lazy(() =>
  import("../../components/Modal/ChangeVehicleModal")
);
const ExtendBookingModal = lazy(() =>
  import("../../components/Modal/ExtendBookingModal")
);

const BookingDetail = ({ pickupImagesLoading }) => {
  const { vehicleMaster, vehiclePickupImage } = useSelector(
    (state) => state.vehicles
  );
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("booking");
  const dispatch = useDispatch();

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
              (vehicleMaster[0] && vehicleMaster[0]?.userId?.contact) || "NA",
          },
          {
            key: "Alt Mobile Number",
            value:
              (vehicleMaster[0] && vehicleMaster[0]?.userId?.altContact) ||
              "NA",
          },
          {
            key: "Email",
            value:
              (vehicleMaster[0] && vehicleMaster[0]?.userId?.email) ||
              "example@gmail.com",
          },
          {
            key: "Document Status",
            value:
              (vehicleMaster[0] && vehicleMaster[0]?.userId?.kycApproved) ||
              "no",
          },
        ],
        // managerInfo: [
        //   {
        //     key: "Full Name",
        //     value:
        //       vehicleMaster &&
        //       `${vehicleMaster[0]?.stationMasterUserId?.firstName} ${vehicleMaster[0]?.stationMasterUserId?.lastName}`,
        //   },
        //   {
        //     key: "Mobile Number",
        //     value: `${
        //       (vehicleMaster &&
        //         vehicleMaster[0]?.stationMasterUserId?.contact) ||
        //       "NA"
        //     }`,
        //   },
        //   {
        //     key: "Alt Mobile Number",
        //     value: `${
        //       (vehicleMaster &&
        //         vehicleMaster[0]?.stationMasterUserId?.altContact) ||
        //       "NA"
        //     }`,
        //   },
        //   {
        //     key: "Email",
        //     value:
        //       vehicleMaster &&
        //       `${vehicleMaster[0]?.stationMasterUserId?.email}`,
        //   },
        // ],
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
                (vehicleMaster &&
                  vehicleMaster[0]?.extendBooking?.originalEndDate) ||
                  (vehicleMaster && vehicleMaster[0]?.BookingEndDateAndTime)
              )
            }`,
          },
          {
            key: "Booked On",
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
      <ChangeVehicleModal bookingData={vehicleMaster && vehicleMaster[0]} />
      <ExtendBookingModal bookingData={vehicleMaster && vehicleMaster[0]} />

      <div className="flex gap-4 flex-wrap">
        <div className="bg-white shadow-md rounded-xl flex-1 px-3 lg:px-6 py-4">
          {vehicleMaster[0]?.notes && (
            <p className="text-sm text-end italic text-gray-400 mb-1">
              {/* here we will show only notes with noteType cancel  */}
              {vehicleMaster[0]?.notes
                ?.filter((note) => note.noteType === "cancel")
                .map((note, index) => (
                  <div key={note._id || index}>
                    {`Cancel note by ${note.key}: (${note.value})`}
                  </div>
                ))}
            </p>
          )}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-md lg:text-lg font-semibold text-gray-500 flex items-center">
              {`BookingId: #${vehicleMaster[0]?.bookingId}`}{" "}
              <CopyButton textToCopy={`#${vehicleMaster[0]?.bookingId}`} />
            </h2>
            <BookingStatusFlag
              title={"Booking Status"}
              rides={vehicleMaster[0]}
              flag={"bookingStatus"}
            />
          </div>
          <div className="border-2 p-2 border-gray-300 rounded-lg mb-4">
            <BookingUserDetails
              data={data}
              userId={vehicleMaster[0]?.userId?._id}
            />
          </div>
          {/* <div className="flex items-center justify-between mb-3">
            <h2 className="text-md lg:text-lg font-semibold text-gray-500">
              Manager Information
            </h2>
            <BookingStatusFlag
              title={"Manager Status"}
              rides={vehicleMaster[0]?.stationMasterUserId}
              flag={"status"}
            />
          </div> */}
          {/* <div className="border-2 p-2 border-gray-300 rounded-lg mb-4">
            <BookingMoreInfo data={data} datatype={"managerInfo"} />
          </div> */}
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
            <BookingMoreInfo data={data} datatype={"moreInfo"} />
          </div>
          <div>
            <h2 className="text-md lg:text-lg font-semibold text-gray-500 mt-5">
              Vehicle Images
            </h2>
            {pickupImagesLoading ? (
              <Spinner />
            ) : !pickupImagesLoading && vehiclePickupImage?.length > 0 ? (
              <VehicleImages />
            ) : (
              <p className="text-sm italic text-gray-400">
                No vehicles Images Found.
              </p>
            )}
          </div>
          <div className="mt-5 mb-5">
            <div className="flex items-center gap-1 justify-between mb-5">
              <h2 className="text-md lg:text-lg font-semibold text-gray-500 w-2/4">
                {tab.charAt(0).toUpperCase() + tab.slice(1) || "Booking"}{" "}
                Timeline
              </h2>
              <div className="relative flex border rounded overflow-hidden flex-1">
                <div
                  className={`absolute top-0 left-0 h-full bg-theme transition-all duration-300 rounded text-white z-0`}
                  style={{
                    width: "50%",
                    transform: `translateX(${tab === "rides" ? "100%" : "0%"})`,
                  }}
                />
                {["booking", "rides"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`flex-1 z-10 p-1 font-semibold transition-colors duration-300 ${
                      tab === item ? "text-white" : "text-gray-800"
                    }`}
                    onClick={() => setTab(item)}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {(vehicleMaster[0] && tab === "booking" && <BookingTimeLine />) ||
              (vehicleMaster[0] && tab === "rides" && <UserRideTimeLine />)}
          </div>
        </div>
        <div className="flex-1 px-6 py-4 bg-white shadow-md rounded-lg">
          <div className="flex lg:items-center justify-between mb-5">
            <div>
              <h2 className="font-bold uppercase text-md lg:text-lg flex flex-wrap items-center gap-2">
                {`${vehicleMaster[0]?.vehicleBrand} ${vehicleMaster[0]?.vehicleName}`}
                {!(
                  vehicleMaster[0]?.rideStatus === "completed" ||
                  vehicleMaster[0]?.bookingStatus === "canceled" ||
                  vehicleMaster[0]?.BookingEndDateAndTime <
                    formatDateToISOWithoutSecond(new Date())
                ) && (
                  <button
                    className="text-sm font-medium bg-theme text-gray-100 px-1.5 rounded shadow-md py-0.5"
                    type="button"
                    onClick={() => dispatch(toggleChangeVehicleModal())}
                  >
                    Change Vehicle
                  </button>
                )}
              </h2>
              <small className="text-sm text-gray-400">
                Vehicle Number: ({vehicleMaster[0]?.vehicleBasic?.vehicleNumber}
                )
              </small>
            </div>
            <div>
              <h2 className="font-semibold uppercase hidden lg:block text-sm">
                Rental Price
              </h2>
              <p className="font-bold text-sm text-lg">
                ₹
                {vehicleMaster &&
                  formatPrice(vehicleMaster[0]?.bookingPrice?.rentAmount)}
                /DAY
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
          <div className="flex items-center justify-between border-b-2 pt-1.5 mt-2 pb-1.5 mb-3">
            <h2 className="text-md lg:text-lg font-semibold text-gray-500">
              Additional Information
            </h2>
            {((vehicleMaster &&
              vehicleMaster[0]?.bookingPrice?.diffAmount &&
              vehicleMaster[0]?.bookingPrice?.diffAmount?.length > 0 &&
              vehicleMaster[0]?.bookingPrice?.diffAmount?.filter(
                (record) => record?.status !== "paid"
              )?.length > 0) ||
              (vehicleMaster &&
                vehicleMaster[0]?.bookingPrice?.extendAmount &&
                vehicleMaster[0]?.bookingPrice?.extendAmount?.length > 0 &&
                vehicleMaster[0]?.bookingPrice?.extendAmount?.filter(
                  (record) => record?.status !== "paid"
                )?.length > 0)) && (
              <Button
                title={"Update Payment"}
                customClass={"text-sm bg-theme text-gray-100 px-1.5 py-1"}
                fn={() => dispatch(togglePaymentUpdateModal())}
              />
            )}
          </div>
          <div className="mb-3">
            <AdditionalInfo />
          </div>
          <div className="flex items-center justify-between mb-3 border-b-2 pb-1.5 mb-1.5">
            <h2 className="text-md lg:text-lg font-semibold text-gray-500">
              Add Note
            </h2>
          </div>
          <BookingNote />
        </div>
      </div>
    </>
  ) : (
    <PreLoader />
  );
};

export default BookingDetail;
