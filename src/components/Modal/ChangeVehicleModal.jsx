import { useDispatch, useSelector } from "react-redux";
import { toggleChangeVehicleModal } from "../../Redux/SideBarSlice/SideBarSlice";
import { useEffect, useState } from "react";
import { getData, postData } from "../../Data/index";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import SelectDropDown from "../../components/InputAndDropdown/SelectDropDown";
import {
  calculateTax,
  camelCaseToSpaceSeparated,
  formatDateToISO,
  formatPrice,
  getDurationInDays,
} from "../../utils/index";
import Input from "../../components/InputAndDropdown/Input";
import PreLoader from "../../components/Skeleton/PreLoader";
import Spinner from "../../components/Spinner/Spinner";
import {
  handleChangesInBooking,
  updateTimeLineData,
} from "../../Redux/VehicleSlice/VehicleSlice";
import { updateTimeLineForPayment } from "../../Data/Function";

const ChangeVehicleModal = ({ bookingData }) => {
  const dispatch = useDispatch();
  const { isChangeVehicleModalActive } = useSelector((state) => state.sideBar);
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [formLoading, setFormLoading] = useState(false);
  const [isModalClose, setIsModalClose] = useState(false);
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [freeVehicles, setFreeVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const { token } = useSelector((state) => state.user);

  //   for fetching vehicle based on  dynamic date and time
  useEffect(() => {
    if (!isChangeVehicleModalActive) return;
    (async () => {
      try {
        setVehicleLoading(true);
        const response = await getData(
          `/getAllVehiclesAvailable?stationId=${
            bookingData?.stationId
          }&BookingStartDateAndTime=${formatDateToISO(new Date()).replace(
            ".000Z",
            "Z"
          )}&BookingEndDateAndTime=${bookingData?.BookingEndDateAndTime}`,
          token
        );
        if (response?.status === 200) {
          setFreeVehicles(response?.data);
        } else {
          return handleAsyncError(dispatch, response?.message);
        }
      } catch (error) {
        return handleAsyncError(dispatch, error?.message);
      } finally {
        setVehicleLoading(false);
      }
    })();
  }, [isChangeVehicleModalActive]);

  //   selecting and making the data for updating booking
  const handleChangeSelectedVehicle = (vehicleId) => {
    const changeToNewVehicle = freeVehicles?.find(
      (item) => item?._id == vehicleId
    );
    // calculating the duration
    const startDate =
      bookingData?.BookingStartDateAndTime <=
      formatDateToISO(new Date()).replace(".000Z", "Z")
        ? formatDateToISO(new Date()).replace(".000Z", "Z")
        : bookingData?.BookingStartDateAndTime;
    const endDate = bookingData?.BookingEndDateAndTime;

    const daysLeft = getDurationInDays(
      startDate?.slice(0, 10),
      endDate?.slice(0, 10)
    );
    // calculate the price
    const bookingPriceWithoutHelmet = Number(changeToNewVehicle?.perDayCost);
    const bookingPrice = Number(bookingPriceWithoutHelmet) * Number(daysLeft);
    const bookingPricePlusHelmet =
      Number(
        bookingData?.bookingPrice?.extraAddonPrice < 200
          ? Number(bookingData?.bookingPrice?.extraAddonPrice) *
              Number(daysLeft < 4 ? daysLeft : 4)
          : bookingData?.bookingPrice?.extraAddonPrice || 0
      ) + Number(bookingPrice);
    const tax = calculateTax(bookingPricePlusHelmet, 18);
    const totalPrice = Number(bookingPricePlusHelmet) + Number(tax);
    const oldDiscountPrice = bookingData?.bookingPrice?.discountTotalPrice;
    const oldTotalPrice = bookingData?.bookingPrice?.totalPrice;

    // calculating the diffAmount
    const diffAmount =
      Number(oldDiscountPrice) > 0
        ? Number(totalPrice) - Number(oldDiscountPrice)
        : Number(totalPrice) - Number(oldTotalPrice);
    // it diffAmount comes in negative value than make it zero
    const finalDiffAmount = diffAmount <= 0 ? 0 : Math.floor(diffAmount);

    const data = {
      _id: bookingData?._id,
      vehicleMasterId: changeToNewVehicle?.vehicleMasterId,
      vehicleTableId: changeToNewVehicle?._id,
      vehicleImage: changeToNewVehicle?.vehicleImage,
      vehicleBrand: changeToNewVehicle?.vehicleBrand,
      vehicleName: changeToNewVehicle?.vehicleName,
      bookingPrice: {
        bookingPrice: bookingPrice,
        vehiclePrice: bookingPrice,
        extraAddonPrice: bookingData?.bookingPrice?.extraAddonPrice,
        discountPrice: bookingData?.bookingPrice?.discountPrice || 0,
        discountTotalPrice: bookingData?.bookingPrice?.discountTotalPrice || 0,
        isDiscountZero: bookingData?.bookingPrice?.isDiscountZero || false,
        isPackageApplied: bookingData?.bookingPrice?.isPackageApplied || false,
        tax: tax,
        totalPrice: totalPrice,
        rentAmount: Number(changeToNewVehicle?.perDayCost),
        diffAmount: [
          ...(bookingData?.diffAmount || []),
          {
            id: bookingData?.diffAmount?.length + 1,
            title: "changedVehicle",
            amount: finalDiffAmount,
            paymentMethod: "",
            status: finalDiffAmount > 0 ? "unpaid" : "paid",
          },
        ],
      },
      changeVehicle: {
        vehicleMasterId: bookingData?.vehicleMasterId,
        vehicleTableId: bookingData?._id,
        bookingPrice: bookingData?.bookingPrice,
        vehicleName: bookingData?.vehicleName,
        vehicleNumber: bookingData?.vehicleBasic?.vehicleNumber,
      },
      vehicleBasic: {
        isChanged: true,
        refundableDeposit: changeToNewVehicle?.refundableDeposit,
        speedLimit: changeToNewVehicle?.speedLimit,
        vehicleNumber: changeToNewVehicle?.vehicleNumber,
        freeLimit: changeToNewVehicle?.freeLimit,
        lateFee: changeToNewVehicle?.lateFee,
        extraKmCharge: changeToNewVehicle?.extraKmCharge,
        startRide: bookingData?.vehicleBasic?.startRide,
        endRide: bookingData?.vehicleBasic?.endRide,
      },
      firstName: vehicleMaster[0]?.userId?.firstName,
      managerContact: vehicleMaster[0]?.stationMasterUserId?.contact,
    };

    return setSelectedVehicle(data);
  };

  // apply vehicle for Maintenance
  const handleChangeVehicle = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const otp = formData.get("OTP");
    if (!otp) return handleAsyncError(dispatch, "Please provide otp first!");

    const data = {
      ...selectedVehicle,
      otp,
      contact: bookingData?.userId?.contact,
    };
    if (!data)
      return handleAsyncError(dispatch, "unable to change vehicle! try again.");
    try {
      setFormLoading(true);
      const response = await postData("/vehicleChange", data, token);
      if (response?.status === 200) {
        // updating the redux state
        const { firstName, managerContact, ...updatedSelectedVehicle } =
          selectedVehicle;
        dispatch(handleChangesInBooking(updatedSelectedVehicle));
        // pushing the data for upating the timeline
        const timeLineData = await updateTimeLineForPayment(
          data,
          token,
          "Vehicle Changed",
          `From (${vehicleMaster[0]?.vehicleBasic?.vehicleNumber}) to (${selectedVehicle?.vehicleBasic?.vehicleNumber})`
        );
        // for updating timeline redux data
        dispatch(updateTimeLineData(timeLineData));
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
  const handleSendOtp = async () => {
    try {
      setOtpLoading(true);
      const data = {
        contact: bookingData?.userId?.contact,
      };
      const response = await postData("/otpGenerat", data, token);
      if (response?.status === 200) {
        return handleAsyncError(dispatch, response?.message, "success");
      } else {
        return handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setOtpLoading(false);
    }
  };

  // for closing the modal & clear the values
  const handleCloseModal = async () => {
    setFreeVehicles([]);
    setSelectedVehicle(null);
    setIsModalClose(true);
    return dispatch(toggleChangeVehicleModal());
  };

  return (
    <div
      className={`fixed ${
        !isChangeVehicleModalActive ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-20 mx-auto shadow-xl rounded-md bg-white max-w-xl">
        <div className="flex justify-between p-2">
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

        <div className="p-6 pt-0 text-center">
          {vehicleLoading && <PreLoader />}
          <form onSubmit={handleChangeVehicle}>
            <div className="mb-2">
              <SelectDropDown
                item={"vehicleTableId"}
                onChangeFn={handleChangeSelectedVehicle}
                options={freeVehicles}
                changetoDefault={isModalClose}
                changeModalClose={setIsModalClose}
                require={true}
              />
              {selectedVehicle && selectedVehicle?.length === 0 && (
                <p className="italic text-gray-100 mt-1">No vehicle Found.</p>
              )}
            </div>
            {selectedVehicle !== null && (
              <div className="w-full bg-gray-300 rounded-lg bg-opacity-75 py-2 px-2.5 mb-2">
                <h2 className="text-left">Old Vehicle</h2>
                <ul className="leading-7 text-left mb-1">
                  {[
                    "rentAmount",
                    "tax",
                    "extraAddonPrice",
                    "totalPrice",
                    "discountTotalPrice",
                  ].map((key, index) => {
                    const value = bookingData?.bookingPrice?.[key];
                    if (value !== undefined || value !== 0) {
                      if (bookingData?.bookingPrice?.[key] === 0) {
                        return null;
                      }
                      return (
                        <li
                          className={`capitalize ${
                            key === "discountTotalPrice" || key === "totalPrice"
                              ? "font-semibold"
                              : ""
                          }`}
                          key={index}
                        >
                          {key != "extraAddonPrice"
                            ? camelCaseToSpaceSeparated(key)
                            : "Extra Helmet"}
                          : ₹
                          {key === "rentAmount" || key === "extraAddonPrice"
                            ? `${formatPrice(
                                Math.floor(value)
                              )} * ${getDurationInDays(
                                bookingData?.BookingStartDateAndTime,
                                bookingData?.BookingEndDateAndTime
                              )} day(s)`
                            : formatPrice(Math.floor(value))}
                        </li>
                      );
                    } else {
                      return null;
                    }
                  })}
                </ul>
                <h2 className="text-left">New Vehicle</h2>
                <ul className="leading-7 text-left mb-1">
                  {["rentAmount", "tax", "extraAddonPrice", "totalPrice"].map(
                    (key, index) => {
                      const value = selectedVehicle?.bookingPrice?.[key];
                      if (bookingData?.bookingPrice?.[key] === 0) {
                        return null;
                      }
                      if (value !== undefined) {
                        return (
                          <li
                            className={`capitalize ${
                              key === "totalPrice" ? "font-semibold" : ""
                            }`}
                            key={index}
                          >
                            {key != "extraAddonPrice"
                              ? camelCaseToSpaceSeparated(key)
                              : "Extra Helmet"}
                            : ₹
                            {key === "rentAmount" || key === "extraAddonPrice"
                              ? `${formatPrice(
                                  Math.floor(value)
                                )} * ${getDurationInDays(
                                  bookingData?.BookingStartDateAndTime,
                                  bookingData?.BookingEndDateAndTime
                                )} day(s)`
                              : formatPrice(Math.floor(value))}
                          </li>
                        );
                      } else {
                        return null;
                      }
                    }
                  )}
                </ul>
                {selectedVehicle && (
                  <p className="font-semibold text-left">
                    Amount need to pay: ₹
                    {
                      selectedVehicle?.bookingPrice?.diffAmount[
                        selectedVehicle?.bookingPrice?.diffAmount?.length - 1
                      ]?.amount
                    }
                  </p>
                )}
              </div>
            )}
            <div className="mb-2">
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
            </div>
            <button
              type="submit"
              className="bg-theme px-4 py-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none disabled:bg-gray-400"
              disabled={formLoading || selectedVehicle === null}
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
