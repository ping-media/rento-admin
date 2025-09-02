import { useDispatch, useSelector } from "react-redux";
import { toggleChangeVehicleModal } from "../../Redux/SideBarSlice/SideBarSlice";
import { useEffect, useState } from "react";
import { getData, postData } from "../../Data/index";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import {
  formatDateToISOWithoutSecond,
  formatPrice,
  getDurationInDays,
} from "../../utils/index";
import PreLoader from "../../components/Skeleton/PreLoader";
import Spinner from "../../components/Spinner/Spinner";
import {
  handleChangesAfterVehicleChange,
  updateTimeLineData,
} from "../../Redux/VehicleSlice/VehicleSlice";
import SelectDropDownVehicle from "../../components/InputAndDropdown/SelectDropDownVehicle";
import PriceList from "../../components/Form/VehicleComponents/PriceList";

const ChangeVehicleModal = ({ bookingData }) => {
  const dispatch = useDispatch();
  const { isChangeVehicleModalActive } = useSelector((state) => state.sideBar);
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [formLoading, setFormLoading] = useState(false);
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const { vehiclesFilter } = useSelector((state) => state.pagination);
  const [freeVehicles, setFreeVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const { token } = useSelector((state) => state.user);
  const [payableAmount, setPayableAmount] = useState(0);
  const [vehicleId, setVehicleId] = useState("");

  const isGSTActive =
    bookingData?.stationData?.isGstActive === "active" ? true : false || false;

  const extendBookings =
    bookingData?.bookingPrice?.extendAmount?.length > 0
      ? bookingData?.bookingPrice?.extendAmount?.filter(
          (extend) => extend?.status === "paid"
        )
      : [];

  const extendBookingDuration = extendBookings.reduce(
    (sum, extend) => sum + Number(extend?.extendDuration || 0),
    0
  );

  const extendBookingTotal = extendBookings.reduce(
    (sum, extend) => sum + Number(extend?.amount || 0),
    0
  );

  //   for fetching vehicle based on  dynamic date and time
  useEffect(() => {
    if (!isChangeVehicleModalActive) return;

    (async () => {
      try {
        setVehicleLoading(true);
        let endpoint = `/getAllVehiclesAvailable?stationId=${bookingData?.stationId}&BookingStartDateAndTime=${bookingData?.BookingStartDateAndTime}&BookingEndDateAndTime=${bookingData?.BookingEndDateAndTime}&page=1&limit=25`;

        if (vehiclesFilter?.bookingVehicleName !== "") {
          endpoint = `/getAllVehiclesAvailable?stationId=${bookingData?.stationId}&search=${vehiclesFilter?.bookingVehicleName}&BookingStartDateAndTime=${bookingData?.BookingStartDateAndTime}&BookingEndDateAndTime=${bookingData?.BookingEndDateAndTime}&page=1&limit=100`;
        }
        const response = await getData(endpoint, token);
        if (response?.status === 200) {
          setFreeVehicles(response?.data);
        } else {
          const vehicleData =
            response?.unavailabilityReasons &&
            response?.unavailabilityReasons.length > 0
              ? response.unavailabilityReasons[0]
              : null;

          const customMessage =
            vehicleData !== null
              ? `${vehicleData?.reason} and booking id is ${vehicleData?.bookingId}`
              : null;
          return handleAsyncError(
            dispatch,
            customMessage !== null ? customMessage : response?.message
          );
        }
      } catch (error) {
        return handleAsyncError(dispatch, error?.message);
      } finally {
        setVehicleLoading(false);
      }
    })();
  }, [isChangeVehicleModalActive, vehiclesFilter]);

  //   selecting and making the data for updating booking
  const handleChangeSelectedVehicle = (vehicleId) => {
    const changeToNewVehicle = freeVehicles?.find(
      (item) => item?._id == vehicleId
    );

    // getting start date whether according to extend or first booking
    const currentDateAndTime = formatDateToISOWithoutSecond(new Date());
    const startDate = bookingData?.BookingStartDateAndTime;
    const endDate = bookingData?.BookingEndDateAndTime;

    // calculating the duration
    const daysLeft = getDurationInDays(
      currentDateAndTime?.slice(0, 10),
      endDate?.slice(0, 10)
    );

    const totalBookingDuration = getDurationInDays(
      startDate?.slice(0, 10),
      endDate?.slice(0, 10)
    );

    const data = {
      booking_id: bookingData?._id,
      newVehicleData: changeToNewVehicle,
      daysLeft,
      totalBookingDuration,
    };

    // setting new payable amount for user
    const oldBookingPrice = bookingData?.bookingPrice;
    let total =
      changeToNewVehicle?.totalRentalCost +
      (oldBookingPrice?.extraAddonPrice || 0);

    if (isGSTActive) {
      total +=
        (changeToNewVehicle?.tax || 0) + (oldBookingPrice?.addonTax || 0);
    }

    setPayableAmount(oldBookingPrice?.totalPrice - total);
    return setSelectedVehicle(data);
  };

  useEffect(() => {
    if (vehicleId !== "") {
      handleChangeSelectedVehicle(vehicleId);
    }
  }, [vehicleId]);

  // apply vehicle for Maintenance
  const handleChangeVehicle = async (event) => {
    event.preventDefault();
    // const formData = new FormData(event.target);
    // const otp = formData.get("OTP");
    // if (!otp) return handleAsyncError(dispatch, "Please provide otp first!");

    if (!selectedVehicle)
      return handleAsyncError(dispatch, "unable to change vehicle! try again.");
    try {
      setFormLoading(true);
      const response = await postData("/vehicleChange", selectedVehicle, token);
      if (response?.success) {
        if (response?.data && vehicleMaster) {
          const newData = {
            ...response?.data,
            userId: {
              ...vehicleMaster[0]?.userId,
            },
          };
          dispatch(handleChangesAfterVehicleChange(newData));
        }
        // for updating timeline redux data
        if (response?.timeLine) {
          dispatch(updateTimeLineData(response.timeLine));
        }
        handleAsyncError(dispatch, "vehicle Change Successfully", "success");
        return dispatch(toggleChangeVehicleModal());
      } else {
        handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setFormLoading(false);
    }
  };

  //   for sending the otp
  // const handleSendOtp = async () => {
  //   try {
  //     setOtpLoading(true);
  //     const data = {
  //       contact: bookingData?.userId?.contact,
  //     };
  //     const response = await postData("/otpGenerat", data, token);
  //     if (response?.status === 200) {
  //       return handleAsyncError(dispatch, response?.message, "success");
  //     } else {
  //       return handleAsyncError(dispatch, response?.message);
  //     }
  //   } catch (error) {
  //     return handleAsyncError(dispatch, error?.message);
  //   } finally {
  //     setOtpLoading(false);
  //   }
  // };

  useEffect(() => {
    if (!isChangeVehicleModalActive) {
      setSelectedVehicle(null);
    }
  }, [isChangeVehicleModalActive]);

  // for closing the modal & clear the values
  const handleCloseModal = async () => {
    setFreeVehicles([]);
    setSelectedVehicle(null);
    return dispatch(toggleChangeVehicleModal());
  };

  const isDisabled =
    bookingData?.bookingPrice?.diffAmount &&
    bookingData?.bookingPrice?.diffAmount?.length > 0 &&
    bookingData?.bookingPrice?.diffAmount[
      bookingData?.bookingPrice?.diffAmount?.length - 1
    ]?.status === "unpaid"
      ? true
      : false;

  return (
    <div
      className={`fixed ${
        !isChangeVehicleModalActive ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-20 mx-auto shadow-xl rounded-md bg-white max-w-xl">
        <div className="flex justify-between border-b p-2">
          <h2 className="text-theme font-semibold text-lg uppercase">
            Change Vehicle
          </h2>
          <button
            onClick={handleCloseModal}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            disabled={formLoading || false}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className="p-6 pt-2 text-center">
          {vehicleLoading && <PreLoader />}
          {isDisabled && (
            <p className="text-left text-xs lg:text-sm text-theme italic mb-2">
              <span className="font-bold mr-1">Note:</span>
              update the pending payment in order to change vehicle.
            </p>
          )}
          <form onSubmit={handleChangeVehicle}>
            <div className="w-full bg-gray-300 rounded-lg bg-opacity-75 py-2 px-2.5 mb-2">
              <div className="flex items-center justify-between">
                <h2 className="text-left font-semibold">
                  Current Vehicle Info
                </h2>
                <p className="text-sm capitalize">
                  ({`${bookingData?.vehicleBrand} ${bookingData?.vehicleName}`})
                </p>
              </div>
              <ul className="leading-7 text-left mb-1">
                <PriceList
                  options={[
                    "bookingPrice",
                    "discountTotalPrice",
                    "extraAddonPrice",
                    "tax",
                    "totalPrice",
                  ]}
                  extendBooking={{
                    duration: extendBookingDuration,
                    amount: extendBookingTotal,
                  }}
                  bookingData={bookingData}
                  isGSTActive={isGSTActive}
                />
              </ul>
              {selectedVehicle !== null && (
                <>
                  <div className="flex items-center justify-between border-t border-gray-600/20 pt-1">
                    <h2 className="text-left font-semibold">
                      New Vehicle Info
                    </h2>
                    <p className="text-sm capitalize">
                      (
                      {`${selectedVehicle?.newVehicleData?.vehicleBrand} ${selectedVehicle?.newVehicleData?.vehicleName}`}
                      )
                    </p>
                  </div>
                  <ul className="leading-7 text-left mb-1">
                    <li className={`capitalize font-semibold`}>
                      Booking Price: ₹{" "}
                      {formatPrice(
                        selectedVehicle?.newVehicleData?.totalRentalCost
                      )}
                    </li>
                    <li className={`capitalize font-semibold`}>
                      Total Price: ₹{" "}
                      {formatPrice(
                        selectedVehicle?.newVehicleData?.totalRentalCost +
                          (bookingData?.bookingPrice?.extraAddonPrice || 0) +
                          (selectedVehicle?.newVehicleData?.tax || 0) +
                          (bookingData?.bookingPrice?.addonTax || 0)
                      )}
                    </li>
                  </ul>
                </>
              )}
            </div>
            <div className="text-left mb-2">
              <SelectDropDownVehicle
                item={"Vehicle"}
                name={"vehicleTableId"}
                options={freeVehicles}
                setValueChanger={setVehicleId}
                setSelectedChanger={setSelectedVehicle}
                isModalClose={isChangeVehicleModalActive}
              />
              {selectedVehicle && selectedVehicle?.length === 0 && (
                <p className="italic text-gray-100 mt-1">No vehicle Found.</p>
              )}
            </div>
            {/* )} */}
            {/* <div className="mb-2">
              <Input item={"OTP"} type="number" require={true} />
              {selectedVehicle !== null && (
                <div className="text-left mt-2">
                  <button
                    type="button"
                    className="rounded-md bg-theme text-white border-theme p-1.5 disabled:bg-gray-400"
                    disabled={otpLoading || selectedVehicle === null}
                    onClick={handleSendOtp}
                  >
                    {!otpLoading ? (
                      "Send OTP"
                    ) : (
                      <Spinner textColor="black" message={"sending..."} />
                    )}
                  </button>
                </div>
              )}
            </div> */}
            {/* <p className="text-left text-base mb-3">
              <span className="font-semibold">
                {payableAmount > 0 ? "Payable" : "Refund"} Amount:
              </span>{" "}
              ₹{formatPrice(Math.abs(payableAmount))}
            </p> */}
            <button
              type="submit"
              className="bg-theme px-4 py-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none disabled:bg-gray-400 w-full flex items-center justify-center"
              disabled={isDisabled || formLoading || selectedVehicle === null}
            >
              {!formLoading ? (
                "Change vehicle"
              ) : (
                <Spinner message={"loading..."} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangeVehicleModal;
